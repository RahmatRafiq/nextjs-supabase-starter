/**
 * Configuration Index
 *
 * Central configuration file for the entire application.
 * All configuration is organized into logical sections for easy navigation.
 *
 * Sections:
 * 1. Site Configuration - Basic site info, contact details, social media
 * 2. Domain Configuration - Categories and classifications
 * 3. Navigation Configuration - Routes and menu structure
 * 4. Content Configuration - Static homepage and about page content
 */

// =============================================================================
// 1. SITE CONFIGURATION
// =============================================================================

/**
 * Site Configuration
 *
 * Contains all site-specific information including:
 * - Site name, URL, and description
 * - Contact information (email, WhatsApp, address)
 * - Social media links
 *
 * Values can be overridden via environment variables for deployment flexibility.
 */
export const SITE_CONFIG = {
  /** Site name shown in header and metadata */
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'HMJF UIN Alauddin',

  /** Full organization name for formal contexts */
  fullName: 'Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar',

  /** Site URL - used for metadata and canonical URLs */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  /** Site description for SEO and metadata */
  description:
    'Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar - Wadah organisasi mahasiswa farmasi untuk pengembangan akademik, soft skills, dan pengabdian masyarakat',

  /** WhatsApp number for contact (format: 62812xxxxxxxx) */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890',

  /** Organization email address */
  email: 'hmjf@uin-alauddin.ac.id',

  /** Instagram handle (with @) */
  instagram: '@hmjf.uinalauddin',

  /** Physical address of the organization */
  address: 'Jl. H.M. Yasin Limpo No. 36, Romangpolong, Gowa, Sulawesi Selatan',
} as const;

// =============================================================================
// 2. DOMAIN CONFIGURATION
// =============================================================================

/**
 * Article Categories
 * Keys are used in URLs and database, values are displayed to users.
 */
export const ARTICLE_CATEGORIES = {
  post: 'Post',
  blog: 'Blog',
  opinion: 'Opinion',
  publication: 'Publication',
  info: 'Info',
} as const;

/**
 * Event Categories
 * Keys are used in URLs and database, values are displayed to users.
 */
export const EVENT_CATEGORIES = {
  seminar: 'Seminar',
  workshop: 'Workshop',
  'community-service': 'Pengabdian Masyarakat',
  competition: 'Kompetisi',
  training: 'Pelatihan',
  other: 'Lainnya',
} as const;

/**
 * Organization Divisions
 * Represents the structural divisions within the organization.
 */
export const DIVISIONS = {
  'internal-affairs': 'Dalam Negeri',
  'external-affairs': 'Luar Negeri',
  academic: 'Keilmuan',
  'student-development': 'Pengembangan Mahasiswa',
  entrepreneurship: 'Kewirausahaan',
  'media-information': 'Media dan Informasi',
  'sports-arts': 'Olahraga dan Seni',
  'islamic-spirituality': 'Kerohanian Islam',
} as const;

/**
 * Gallery Categories
 * Used for organizing photos and media in the gallery.
 */
export const GALLERY_CATEGORIES = {
  activities: 'Aktivitas',
  events: 'Event',
  facilities: 'Fasilitas',
  organization: 'Organisasi',
} as const;

// =============================================================================
// 3. NAVIGATION CONFIGURATION
// =============================================================================

/**
 * Public Routes
 * Main navigation routes for the public-facing website.
 */
export const ROUTES = {
  home: '/',
  about: '/about',
  articles: '/articles',
  events: '/events',
  leadership: '/leadership',
  members: '/members',
  gallery: '/gallery',
} as const;

/**
 * Admin Routes
 * Routes for the admin panel and management pages.
 */
export const ADMIN_ROUTES = {
  dashboard: '/admin/dashboard',
  articles: '/admin/articles',
  events: '/admin/events',
  members: '/admin/members',
  leadership: '/admin/leadership',
  users: '/admin/users',
  settings: '/admin/settings',
} as const;

/**
 * Auth Routes
 * Routes for authentication pages.
 */
export const AUTH_ROUTES = {
  login: '/auth/login',
  logout: '/auth/logout',
} as const;

/**
 * Type helper for route values
 */
export type RouteValue<T> = T[keyof T];

// =============================================================================
// 4. CONTENT CONFIGURATION (Static Homepage & About Page)
// =============================================================================

/**
 * Home Settings Type Definition
 */
export interface HomeSettings {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    description: string;
    primaryCTA: {
      text: string;
      link: string;
    };
    secondaryCTA: {
      text: string;
      link: string;
    };
    backgroundImage: string;
    stats: readonly {
      value: string;
      label: string;
    }[];
  };
  features: {
    title: string;
    description: string;
    items: readonly {
      title: string;
      description: string;
      icon: string;
    }[];
  };
  cta: {
    title: string;
    description: string;
    primaryCTA: {
      text: string;
      link: string;
    };
    secondaryCTA: {
      text: string;
      phone: string;
    };
  };
}

/**
 * About Settings Type Definition
 */
export interface AboutSettings {
  story: string;
  mission: readonly string[];
  vision: string;
  values: readonly {
    title: string;
    description: string;
    icon?: string;
  }[];
  statistics?: {
    activeMembers: string;
    eventsPerYear: string;
    divisions: string;
    yearsActive: string;
  };
  timeline: readonly {
    year: string;
    title: string;
    description: string;
  }[];
  affiliations?: readonly {
    name: string;
    type: string;
    description: string;
  }[];
  certifications?: readonly {
    name: string;
    year: string;
  }[];
}

/**
 * Homepage Content
 * Static content for the homepage sections
 */
export const HOME_CONTENT = {
  hero: {
    badge: 'Organisasi Mahasiswa',
    title: 'Himpunan Mahasiswa Jurusan',
    titleHighlight: 'Farmasi',
    subtitle: 'UIN Alauddin Makassar',
    description:
      'Wadah aspirasi, kreativitas, dan pengembangan diri mahasiswa Farmasi UIN Alauddin Makassar',
    primaryCTA: {
      text: 'Kenali Kami',
      link: '/about',
    },
    secondaryCTA: {
      text: 'Lihat Program',
      link: '#features',
    },
    backgroundImage: '/images/hero-bg.jpg',
    stats: [
      { value: '150+', label: 'Anggota Aktif' },
      { value: '20+', label: 'Event / Tahun' },
      { value: '8', label: 'Divisi' },
    ],
  },
  features: {
    title: 'Program Kami',
    description: 'Berbagai program pengembangan untuk mahasiswa Farmasi yang profesional dan berintegritas',
    items: [
      {
        title: 'Keilmuan',
        description: 'Program pengembangan kompetensi akademik dan riset farmasi',
        icon: 'GraduationCap',
      },
      {
        title: 'Keprofesian',
        description: 'Pelatihan dan sertifikasi untuk persiapan dunia kerja',
        icon: 'Leaf',
      },
      {
        title: 'Kaderisasi',
        description: 'Pembinaan karakter dan leadership mahasiswa',
        icon: 'Users',
      },
      {
        title: 'Pengabdian',
        description: 'Kontribusi nyata untuk masyarakat dan lingkungan',
        icon: 'Heart',
      },
    ],
  },
  cta: {
    title: 'Bergabung Bersama Kami',
    description: 'Mari berkontribusi untuk kemajuan farmasi Indonesia',
    primaryCTA: {
      text: 'Hubungi Kami',
      link: '/contact',
    },
    secondaryCTA: {
      text: 'WhatsApp',
      phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '628123456789',
    },
  },
} as const;

/**
 * About Page Content
 * Static content for the about page sections
 */
export const ABOUT_CONTENT = {
  story: 'Himpunan Mahasiswa Jurusan Farmasi (HMJF) UIN Alauddin Makassar adalah organisasi kemahasiswaan yang berperan sebagai wadah aspirasi, kreativitas, dan pengembangan diri mahasiswa Farmasi. Didirikan dengan semangat kekeluargaan dan profesionalisme, HMJF terus berkontribusi dalam mengembangkan potensi mahasiswa di bidang akademik, keprofesian, dan pengabdian masyarakat.',
  mission: [
    'Mewujudkan mahasiswa farmasi yang berilmu, berakhlak, dan profesional',
    'Mengembangkan potensi akademik dan non-akademik mahasiswa',
    'Membangun jaringan dan kerjasama dengan berbagai pihak',
    'Memberikan kontribusi nyata kepada masyarakat',
  ],
  vision:
    'Menjadi organisasi kemahasiswaan farmasi yang unggul, inovatif, dan berdaya saing',
  values: [
    {
      title: 'Integritas',
      description: 'Menjunjung tinggi kejujuran dan etika profesional',
      icon: 'BookOpen',
    },
    {
      title: 'Kolaborasi',
      description: 'Bekerjasama untuk mencapai tujuan bersama',
      icon: 'Users',
    },
    {
      title: 'Inovasi',
      description: 'Selalu berinovasi dalam setiap program dan kegiatan',
      icon: 'HeartHandshake',
    },
    {
      title: 'Dedikasi',
      description: 'Berkomitmen penuh terhadap pengembangan organisasi',
      icon: 'Briefcase',
    },
  ],
  statistics: {
    activeMembers: '150+',
    eventsPerYear: '20+',
    divisions: '8',
    yearsActive: '2015',
  },
  timeline: [
    {
      year: '2015',
      title: 'Pendirian HMJF',
      description: 'HMJF UIN Alauddin Makassar resmi didirikan sebagai wadah mahasiswa Farmasi',
    },
    {
      year: '2018',
      title: 'Pengembangan Program',
      description: 'Peluncuran program keilmuan dan keprofesian yang terstruktur',
    },
    {
      year: '2020',
      title: 'Adaptasi Digital',
      description: 'Transformasi digital dalam kegiatan organisasi di masa pandemi',
    },
    {
      year: '2024',
      title: 'Inovasi Berkelanjutan',
      description: 'Pengembangan program inovatif dan kolaborasi lintas institusi',
    },
  ],
  affiliations: [
    {
      name: 'Ikatan Senat Mahasiswa Farmasi Indonesia (ISMKI)',
      type: 'Nasional',
      description: 'Organisasi mahasiswa farmasi tingkat nasional',
    },
    {
      name: 'Ikatan Apoteker Indonesia (IAI)',
      type: 'Profesional',
      description: 'Organisasi profesi apoteker Indonesia',
    },
    {
      name: 'Fakultas Kedokteran dan Ilmu Kesehatan',
      type: 'Institusi',
      description: 'Fakultas induk di UIN Alauddin Makassar',
    },
  ],
  certifications: [
    {
      name: 'Akreditasi A BAN-PT',
      year: '2023',
    },
    {
      name: 'ISO 9001:2015',
      year: '2022',
    },
  ],
} as const;
