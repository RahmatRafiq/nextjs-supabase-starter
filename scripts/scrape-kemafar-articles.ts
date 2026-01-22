/**
 * Scrape Articles from kemafar.org
 * Generates SQL INSERT statements for seed.sql
 */

import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import TurndownService from 'turndown';

interface Article {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'post' | 'blog' | 'opinion' | 'publication' | 'info';
  publishedAt: string;
  coverImage: string;
  tags: string[];
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return await response.text();
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function mapCategory(wpCategory: string): Article['category'] {
  const categoryMap: Record<string, Article['category']> = {
    'news': 'info',
    'uncategorized': 'post',
    'esai': 'opinion',
    'publication': 'publication',
  };
  return categoryMap[wpCategory.toLowerCase()] || 'post';
}

async function scrapeArticleList(categoryUrl: string): Promise<{ title: string; url: string; date: string }[]> {
  console.log(`Scraping article list from: ${categoryUrl}`);
  const html = await fetchPage(categoryUrl);
  const $ = cheerio.load(html);

  const articles: { title: string; url: string; date: string }[] = [];

  // WordPress uses h4 > a for post titles in lists
  $('h4 a[href*="kemafar.org"]').each((_i, el) => {
    const $link = $(el);
    const title = $link.text().trim();
    const url = $link.attr('href') || '';

    // Find date in the same post container
    const $parent = $link.closest('.post, article, .entry, .bs-blog-post');
    let date = '';

    // Look for date in various WordPress formats
    const dateText = $parent.find('time, .entry-date, .published, a[href*="/20"]').first().text().trim();
    if (dateText) {
      date = dateText;
    }

    if (title && url && url.includes('kemafar.org/20')) { // Only article URLs (contain year)
      articles.push({ title, url, date });
    }
  });

  console.log(`Found ${articles.length} articles`);
  return articles;
}

async function scrapeArticleContent(url: string): Promise<{ content: string; excerpt: string; image: string }> {
  console.log(`Scraping article: ${url}`);
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  // Initialize Turndown for HTML to Markdown conversion
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });

  // Extract content HTML - try multiple selectors
  let contentHtml = '';

  // Try different content selectors (ordered by specificity)
  const selectors = [
    '.bs-blog-post .entry-content',
    '.entry-content',
    '.post-content',
    '.bs-blog-post',
    'article.post',
    'article',
  ];

  for (const selector of selectors) {
    const contentEl = $(selector).first(); // Get first match only
    if (contentEl.length > 0) {
      // Clone to avoid modifying original DOM
      const cloned = contentEl.clone();

      // Remove unwanted elements
      cloned.find('script, style, iframe, .sharedaddy, .jp-relatedposts, .navigation, .comment, .post-meta, .entry-header, .entry-footer, header, footer').remove();

      contentHtml = cloned.html() || '';

      // If we found substantial content, use it
      if (contentHtml.length > 200) {
        console.log(`  → Found content using selector: ${selector} (${contentHtml.length} chars)`);
        break;
      }
    }
  }

  // If still no content, try to get all paragraphs
  if (!contentHtml || contentHtml.length < 100) {
    const paragraphs = $('article p, .post p, .entry p');
    if (paragraphs.length > 0) {
      contentHtml = paragraphs.map((_i, el) => $(el).html()).get().join('</p><p>');
      contentHtml = `<p>${contentHtml}</p>`;
      console.log(`  → Fallback: extracted ${paragraphs.length} paragraphs`);
    }
  }

  // Convert HTML to Markdown
  let content = contentHtml ? turndownService.turndown(contentHtml) : '';

  // Clean up markdown
  content = content
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .trim();

  // Generate excerpt (first 200 chars of plain text for preview)
  const plainText = content.replace(/[#*`\[\]]/g, '').trim();
  const excerpt = plainText.length > 200
    ? plainText.substring(0, 200).trim() + '...'
    : plainText || 'No excerpt available...';

  // Get featured image (WordPress standard)
  let image = $('meta[property="og:image"]').attr('content') ||
              $('.wp-post-image').attr('src') ||
              $('.entry-content img, .post-thumbnail img').first().attr('src') ||
              'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'; // Default pharmacy image

  return { content, excerpt, image };
}

async function scrapeAllArticles() {
  const categories = [
    'https://kemafar.org/category/news/',
    'https://kemafar.org/category/uncategorized/',
  ];

  const allArticles: Article[] = [];

  for (const categoryUrl of categories) {
    try {
      // Scrape multiple pages (WordPress pagination)
      let page = 1;
      let hasMorePages = true;
      const allArticleLinks: { title: string; url: string; date: string }[] = [];

      while (hasMorePages && page <= 10) { // Max 10 pages to avoid infinite loop
        const pageUrl = page === 1 ? categoryUrl : `${categoryUrl}page/${page}/`;
        console.log(`Scraping page ${page}: ${pageUrl}`);

        try {
          const articleList = await scrapeArticleList(pageUrl);

          if (articleList.length === 0) {
            hasMorePages = false;
          } else {
            allArticleLinks.push(...articleList);
            page++;
            await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit between pages
          }
        } catch (err) {
          // If page fetch fails (404 = no more pages), stop pagination
          console.log(`Page ${page} not found, stopping pagination for this category`);
          hasMorePages = false;
        }
      }

      console.log(`Total found in ${categoryUrl}: ${allArticleLinks.length} articles`);

      // Scrape content for each article
      for (const { title, url, date } of allArticleLinks) {
        try {
          const { content, excerpt, image } = await scrapeArticleContent(url);

          // Extract date from URL (format: /YYYY/MM/DD/)
          const dateMatch = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
          let publishedDate: string;

          if (dateMatch) {
            const [, year, month, day] = dateMatch;
            publishedDate = new Date(`${year}-${month}-${day}`).toISOString();
          } else {
            // Fallback to current date if URL parsing fails
            publishedDate = new Date().toISOString();
          }

          const article: Article = {
            title,
            slug: createSlug(title),
            excerpt,
            content,
            category: categoryUrl.includes('/news/') ? 'info' : 'post',
            publishedAt: publishedDate,
            coverImage: image,
            tags: ['KEMAFAR', 'Farmasi', 'UIN Alauddin'],
          };

          allArticles.push(article);
          console.log(`✓ Scraped: ${title}`);

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
          console.error(`Failed to scrape ${url}:`, err);
        }
      }
    } catch (err) {
      console.error(`Failed to scrape category ${categoryUrl}:`, err);
    }
  }

  return allArticles;
}

function generateSQLInserts(articles: Article[]): string {
  let sql = `-- =============================================
-- ARTICLES FROM KEMAFAR.ORG
-- Auto-generated seed data
-- Total: ${articles.length} articles
-- =============================================

`;

  articles.forEach((article, index) => {
    const authorJson = JSON.stringify({
      name: 'Admin KEMAFAR',
      role: 'admin',
      email: 'admin@kemafar.org'
    }).replace(/'/g, "''");

    const tagsArray = `ARRAY[${article.tags.map(t => `'${t}'`).join(', ')}]`;

    sql += `-- Article ${index + 1}: ${article.title}\n`;
    sql += `INSERT INTO public.articles (title, slug, excerpt, content, category, status, cover_image, published_at, author, tags, featured)\n`;
    sql += `VALUES (\n`;
    sql += `  '${article.title.replace(/'/g, "''")}',\n`;
    sql += `  '${article.slug}',\n`;
    sql += `  '${article.excerpt.replace(/'/g, "''")}',\n`;
    sql += `  '${article.content.replace(/'/g, "''")}',\n`;
    sql += `  '${article.category}',\n`;
    sql += `  'published',\n`;
    sql += `  '${article.coverImage}',\n`;
    sql += `  '${article.publishedAt}',\n`;
    sql += `  '${authorJson}'::jsonb,\n`;
    sql += `  ${tagsArray},\n`;
    sql += `  ${index < 3 ? 'true' : 'false'}\n`;
    sql += `)\n`;
    sql += `ON CONFLICT (slug) DO NOTHING;\n\n`;
  });

  return sql;
}

async function main() {
  console.log('🚀 Starting KEMAFAR article scraper...\n');

  try {
    const articles = await scrapeAllArticles();

    console.log(`\n✅ Successfully scraped ${articles.length} articles`);

    const sql = generateSQLInserts(articles);
    const outputPath = path.join(__dirname, '../supabase/seed-articles.sql');

    fs.writeFileSync(outputPath, sql, 'utf-8');
    console.log(`\n📝 SQL seed file saved to: ${outputPath}`);

    console.log('\n📊 Summary:');
    console.log(`   - Total articles: ${articles.length}`);
    console.log(`   - Featured: ${articles.filter(a => articles.indexOf(a) < 3).length}`);
    console.log(`   - Categories: ${new Set(articles.map(a => a.category)).size}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
