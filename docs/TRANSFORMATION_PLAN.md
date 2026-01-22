# Project Transformation Plan: Multi-Purpose Next.js Starter Template

**Project**: HMJF UIN Alauddin Makassar → Generic Next.js + Supabase + Vercel Starter
**Goal**: Transform current pharmacy student organization website into a flexible, multi-purpose starter template
**Current Status**: Moderately modular (6/10) - Good foundation, needs abstraction layer

---

## Executive Summary

Based on comprehensive architecture audit, this project has excellent clean architecture foundation with repository pattern, type safety, and beautiful UI components (parallax effects, 3D cards, FloatingDock). However, it's tightly coupled to pharmacy organization domain with hardcoded entities, divisions, and content structure.

**User Requirements:**
- ✅ Multi-purpose starter (can become anything: startup, agency, blog, SaaS)
- ✅ All UI components priority (parallax, 3D cards, FloatingDock, admin panel)
- ❓ Claude integration strategy (needs recommendation)
- ❓ Database schema flexibility (needs recommendation)

---

## Current Architecture Assessment

### Strengths (What's Already Modular)

#### 1. Clean Architecture ✅
- **Domain Layer**: Clear entity definitions with dual pattern (Full + ListItem)
  - `src/core/entities/` - Article, Event, Member, Leadership
  - Performance-optimized with separate list variants

- **Repository Pattern**: Interface-based abstraction
  - `src/core/repositories/` - Abstract interfaces
  - `src/infrastructure/repositories/` - Supabase + JSON implementations
  - Factory pattern for implementation switching

- **Type Safety**: Full TypeScript coverage
  - `src/lib/supabase/type-mappers.ts` - Bidirectional DB ↔ Domain mapping
  - Database types auto-generated from Supabase

#### 2. UI Component Library ✅
- **Animation Components** (Framer Motion):
  - ParallaxHero - Scroll-based parallax with opacity fade
  - ScrollReveal - 4 directions with viewport detection
  - TiltCard - 3D mouse-tracking card
  - SpotlightCard - Mouse-following gradient
  - CountingNumber - Animated counters

- **Navigation**:
  - FloatingDock - Liquid glass navigation (signature component)
  - Header with glassmorphism on scroll
  - MobileMenu with slide-out drawer

- **Content Components**:
  - MarkdownContent - Full GFM, syntax highlighting, math equations
  - MarkdownEditor - WYSIWYG with preview

- **Loading States**:
  - Skeleton components for tables, forms, pages
  - ErrorState with retry functionality

#### 3. Feature Organization ✅
- Features organized by domain: `src/features/home/`, `src/features/articles/`
- Container vs Presentational component pattern
- Reusable shared components in `src/shared/`

#### 4. Configuration Management ✅
- Environment-based configuration (`.env.example`)
- Feature flags for progressive migration (`NEXT_PUBLIC_USE_SUPABASE_*`)
- Centralized constants (`src/lib/constants.ts`)

### Weaknesses (What's Not Modular)

#### 1. Entity-Specific Logic ❌
```typescript
// Hardcoded in src/lib/constants.ts
DIVISIONS = {
  'internal-affairs': 'Dalam Negeri',    // Pharmacy-specific
  'external-affairs': 'Luar Negeri',
  'academic': 'Keilmuan',
  // ... 8 hardcoded divisions
}

ARTICLE_CATEGORIES = { post, blog, opinion, publication, info }  // Fixed
EVENT_CATEGORIES = { seminar, workshop, ... }  // Fixed
```

**Problem**: Cannot generate new entities or customize existing ones without code changes.

#### 2. Database Schema ❌
```sql
-- supabase/migrations/20240122000000_initial_schema.sql
CREATE TABLE public.members (
  role TEXT CHECK (role IN ('super_admin', 'admin', 'kontributor')),  -- Hardcoded enum
  status TEXT CHECK (status IN ('active', 'inactive', 'alumni')),     -- Hardcoded
  batch TEXT,      -- Pharmacy-specific (student cohort)
  division TEXT    -- Pharmacy-specific
);
```

**Problem**: Cannot adapt to different organizational structures without migration files.

#### 3. Branding & Content ❌
```typescript
// src/shared/components/layout/Footer.tsx
<p className="text-gray-400">
  farmasi profesional yang berintegritas  // Hardcoded mission
</p>

// src/shared/components/layout/Header.tsx
<span className="text-sm text-gray-600">UIN Alauddin</span>  // Hardcoded
```

**Problem**: Domain-specific text throughout components.

#### 4. No Abstraction for Entity Generation ❌
- No CLI or commands to generate new entities
- Manual file creation for: entity, repository interface, repository impl, types, migrations
- ~15+ files per new entity (Article, Event, Member, Leadership)

---

## Transformation Plan

### Phase 1: Foundation Improvements (Week 1-2)

#### 1.1 Create Entity Abstraction Layer
**Goal**: Make entities configurable and generate-able

**New Files to Create:**
```
src/core/entity-system/
├── EntitySchema.ts           # Schema definition interface
├── EntityGenerator.ts         # Code generator for entities
├── SchemaValidator.ts         # Zod-based schema validation
└── templates/
    ├── entity.template.ts     # Entity class template
    ├── repository.template.ts # Repository interface template
    ├── supabase-repo.template.ts
    └── migration.template.sql
```

**Entity Schema Example:**
```typescript
// config/entities.config.ts
export const ENTITIES = {
  article: {
    name: 'Article',
    fields: {
      title: { type: 'string', required: true },
      slug: { type: 'string', required: true, unique: true },
      content: { type: 'text', required: true },
      category: { type: 'enum', values: ['post', 'blog', 'opinion'] },
      tags: { type: 'array<string>' },
      featured: { type: 'boolean', default: false }
    },
    relations: {
      author: { type: 'belongsTo', entity: 'User' }
    }
  }
  // ... other entities
}
```

#### 1.2 Genericize Constants
**Files to Modify:**
```
src/lib/constants.ts
src/lib/config/site.config.ts (NEW)
src/lib/config/entities.config.ts (NEW)
```

**Changes:**
- Move site-specific values to `site.config.ts`
- Move entity definitions to `entities.config.ts`
- Keep only framework-level constants in `constants.ts`

#### 1.3 Database Schema Generator
**Goal**: Generate migrations from entity config

**New Tool:**
```
scripts/generate-migration.ts
```

**Usage:**
```bash
npm run generate:migration article
# Creates: supabase/migrations/TIMESTAMP_create_articles_table.sql
```

### Phase 2: Claude Integration (Week 2-3)

#### Recommendation: Hybrid Approach

**2.1 Documentation as Knowledge Base**
```
.claude/
├── knowledge/
│   ├── architecture.md        # Clean architecture patterns
│   ├── entity-system.md       # How to add/modify entities
│   ├── components.md          # UI component library guide
│   ├── animations.md          # Animation patterns & usage
│   └── deployment.md          # Vercel + Supabase setup
├── templates/
│   ├── startup/               # Pre-configured for tech startup
│   ├── agency/                # Pre-configured for creative agency
│   ├── blog/                  # Pre-configured for blog/publication
│   └── saas/                  # Pre-configured for SaaS product
└── prompts/
    ├── generate-entity.md     # Prompt for entity generation
    ├── customize-theme.md     # Prompt for theme customization
    └── add-feature.md         # Prompt for feature addition
```

**2.2 Custom Slash Commands**
```
.claude/commands/
├── generate-entity.md         # /generate-entity Article
├── setup-template.md          # /setup-template startup
├── customize-theme.md         # /customize-theme
└── audit-modularity.md        # /audit-modularity
```

**Example Command:**
```markdown
<!-- .claude/commands/generate-entity.md -->
# Generate Entity Command

Generate a complete entity with all necessary files:
- Domain entity class
- Repository interface
- Supabase repository implementation
- TypeScript types
- Database migration
- Admin CRUD pages

Usage: /generate-entity <EntityName>

Follow the entity schema pattern in config/entities.config.ts
```

**2.3 Interactive Setup Wizard**
```bash
npm run setup:project
# or
/setup-project (Claude command)
```

**Wizard Flow:**
1. Select template (startup, agency, blog, saas, custom)
2. Configure branding (name, colors, fonts)
3. Choose entities (select from predefined or custom)
4. Setup features (auth, admin panel, blog, events, members)
5. Generate files + migrations
6. Create initial Supabase project config

### Phase 3: Schema Flexibility (Week 3-4)

#### Recommendation: Generic but Opinionated

**Strategy**: Create generic base entities that can be specialized via configuration.

**3.1 Base Entity Types**
```typescript
// src/core/base-entities/
BaseContent.ts       # Articles, Posts, Pages
BaseEvent.ts         # Events, Workshops, Webinars
BasePerson.ts        # Members, Team, Authors, Users
BaseOrganization.ts  # Leadership, Departments, Teams
```

**3.2 Specialization via Config**
```typescript
// config/entities.config.ts
export const ENTITIES = {
  article: {
    extends: 'BaseContent',
    customFields: {
      category: { type: 'enum', values: ['post', 'blog', 'opinion'] },
      tags: { type: 'array<string>' }
    }
  },
  member: {
    extends: 'BasePerson',
    customFields: {
      department: { type: 'relation', entity: 'Department' },
      role: { type: 'enum', values: ['admin', 'member', 'contributor'] }
    }
  }
}
```

**3.3 Dynamic Schema Migration**
```sql
-- Generated from config
CREATE TABLE public.articles (
  -- Base fields from BaseContent
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Custom fields from config
  category TEXT CHECK (category IN ('post', 'blog', 'opinion')),
  tags TEXT[] DEFAULT '{}'
);
```

### Phase 4: UI Component Standardization (Week 4-5)

#### 4.1 Component Documentation
**New Files:**
```
.claude/knowledge/components/
├── parallax-hero.md        # Usage, props, examples
├── tilt-card.md
├── spotlight-card.md
├── floating-dock.md
├── scroll-reveal.md
└── markdown-editor.md
```

#### 4.2 Storybook Integration (Optional)
```bash
npm install --save-dev @storybook/react @storybook/nextjs
```

**Benefits:**
- Visual component catalog
- Props playground
- Documentation auto-generation
- Testing isolated components

#### 4.3 Design Token System
**New File:**
```typescript
// src/lib/design-tokens.ts
export const DESIGN_TOKENS = {
  colors: {
    primary: { /* 50-950 shades */ },
    secondary: { /* 50-950 shades */ }
  },
  typography: {
    fonts: {
      sans: 'var(--font-sans)',
      heading: 'var(--font-heading)'
    },
    sizes: { /* xs-9xl */ }
  },
  animations: {
    durations: { fast: '150ms', normal: '300ms', slow: '500ms' },
    easings: { /* spring, bounce, etc */ }
  }
}
```

### Phase 5: Template System (Week 5-6)

#### 5.1 Pre-configured Templates
**Structure:**
```
.claude/templates/
├── startup/
│   ├── entities.config.ts    # Team, Product, Blog, Testimonial
│   ├── site.config.ts         # Startup branding
│   ├── home.json              # Hero: "Build the future"
│   └── pages/                 # Custom pages
├── agency/
│   ├── entities.config.ts    # Project, Service, Team, Client
│   ├── site.config.ts
│   └── ...
├── blog/
│   ├── entities.config.ts    # Post, Author, Category
│   └── ...
└── saas/
    ├── entities.config.ts    # Feature, Pricing, FAQ
    └── ...
```

#### 5.2 Template Cloning Script
```typescript
// scripts/clone-template.ts
// Usage: npm run clone:template startup my-new-project

async function cloneTemplate(template: string, projectName: string) {
  // 1. Copy template config files
  // 2. Replace placeholder values (PROJECT_NAME, etc.)
  // 3. Generate entities from config
  // 4. Generate migrations
  // 5. Update package.json
  // 6. Initialize git repo
  // 7. Create .env.example with template-specific vars
}
```

---

## Implementation Checklist

### Phase 1: Foundation ✅
- [ ] Create `src/core/entity-system/` with schema, generator, validator
- [ ] Refactor `src/lib/constants.ts` → Split into `site.config.ts` + `entities.config.ts`
- [ ] Create `scripts/generate-migration.ts`
- [ ] Create `scripts/generate-entity.ts`
- [ ] Test entity generation with new "Project" entity

### Phase 2: Claude Integration ✅
- [ ] Create `.claude/knowledge/` folder with architecture docs
- [ ] Create `.claude/commands/` with slash commands
- [ ] Document all UI components in knowledge base
- [ ] Create interactive setup wizard script
- [ ] Test Claude's ability to generate entities using commands

### Phase 3: Schema Flexibility ✅
- [ ] Create `src/core/base-entities/` (BaseContent, BaseEvent, BasePerson, BaseOrganization)
- [ ] Refactor existing entities to extend base entities
- [ ] Create schema migration generator from config
- [ ] Test customization: convert Member → Employee

### Phase 4: UI Standardization ✅
- [ ] Document all components in `.claude/knowledge/components/`
- [ ] (Optional) Setup Storybook
- [ ] Create `src/lib/design-tokens.ts`
- [ ] Create component usage examples

### Phase 5: Templates ✅
- [ ] Create `.claude/templates/startup/`
- [ ] Create `.claude/templates/agency/`
- [ ] Create `.claude/templates/blog/`
- [ ] Create `.claude/templates/saas/`
- [ ] Create `scripts/clone-template.ts`
- [ ] Test full template cloning flow

---

## Critical Files to Modify

### High Priority (Foundation)
1. `src/lib/constants.ts` - Split into config files
2. `src/core/entities/*.ts` - Refactor to extend base entities
3. `src/infrastructure/repositories/RepositoryFactory.ts` - Add dynamic entity support
4. `supabase/migrations/` - Create generator templates

### Medium Priority (Integration)
5. `.claude/` folder structure - Create knowledge base
6. `scripts/` - Add generation tools
7. `README.md` - Update with new template usage instructions

### Low Priority (Enhancement)
8. `src/shared/components/` - Add component documentation
9. Storybook setup (optional)
10. Template examples

---

## Recommendations Summary

### For Claude Integration:
**Recommended: Hybrid Approach**
- **Documentation as Knowledge Base** (`.claude/knowledge/`)
  - Comprehensive architecture, patterns, components docs
  - Claude can always reference for context

- **Slash Commands** (`.claude/commands/`)
  - `/generate-entity <Name>` - Quick entity generation
  - `/setup-template <type>` - Initialize new project
  - `/customize-theme` - Interactive theme customization

- **Interactive Wizard** (`scripts/setup-project.ts`)
  - For first-time users
  - Step-by-step configuration
  - Validates inputs, generates everything

**Rationale**: Combines best of all approaches - knowledge for context, commands for speed, wizard for onboarding.

### For Database Schema:
**Recommended: Generic but Opinionated**
- Base entity types (BaseContent, BaseEvent, BasePerson, BaseOrganization)
- Specialization via configuration file
- Schema generator creates migrations from config
- Less flexible than full customization but much simpler
- Covers 90% of use cases

**Rationale**: Balance between flexibility and complexity. Full customization is overkill; generic base entities with config-based specialization is pragmatic.

---

## Next Steps

1. **Review this plan** with user for approval
2. **Prioritize phases** - Which to implement first?
3. **Set timeline** - Realistic estimate based on bandwidth
4. **Start with Phase 1** - Foundation improvements are prerequisite for everything else

---

## Success Metrics

A successful multi-purpose starter should enable:
- ✅ Generate new project in < 5 minutes
- ✅ Add custom entity in < 10 minutes (via command)
- ✅ Switch theme/branding in < 15 minutes
- ✅ Deploy to Vercel in < 20 minutes
- ✅ Claude understands architecture from knowledge base
- ✅ No manual file creation for standard patterns

---

**Total Estimated Effort**: 4-6 weeks (full-time) or 8-12 weeks (part-time)
**Current Modularity**: 6/10
**Target Modularity**: 9/10
**Risk Level**: Low (iterative approach, no breaking changes to existing features)
