# Issues Backlog - Starterkit Improvements

> **Priority**: Nomor terkecil = prioritas tertinggi
> **Status**: Generated from codebase audit on 2026-01-24

---

## Issue #1: [CRITICAL] Remove organization-specific references

**Labels**: `priority: critical`, `type: refactor`, `good first issue`, `starterkit-ready`

### Problem
The codebase contains 21+ files with hardcoded references to "HMJF UIN Alauddin", "Kemafar", and pharmacy-specific content. This prevents the project from being a true generic starterkit.

### Organization References Found
- **Organization Name**: "HMJF UIN Alauddin" → Should be generic placeholder
- **Brand Name**: "Kemafar" → Should be configurable
- **Domain-specific data**: Pharmacy divisions, Islamic spirituality categories
- **Contact info**: `hmjf@uin-alauddin.ac.id`, `@hmjf.uinalauddin`

### Files to Update
**Configuration:**
- `config/index.ts` (lines 30, 34, 40, 46, 158, 313)

**App Metadata:**
- `src/app/layout.tsx` (metadata)
- `src/app/(public)/articles/page.tsx` (line 15-16)

**Components:**
- `src/shared/components/layout/Header.tsx`
- `src/shared/components/layout/Footer.tsx`
- `src/app/admin/layout.tsx` (line 158)

**Database:**
- `supabase/migrations/20240122000000_initial_schema.sql` (line 2)
- `supabase/seed.sql`

**Documentation:**
- `docs/SETUP.md` (line 36 - references griyaflora_babulu)

### Solution
1. Replace all organization names with generic placeholders like "Your Organization"
2. Replace specific divisions with generic examples: "Engineering", "Marketing", "Sales"
3. Replace categories with generic: "Blog", "News", "Tutorial", "Announcement"
4. Update contact info to: `contact@example.com`, `@yourorg`
5. Move all branding to `config/index.ts` for easy customization

### Acceptance Criteria
- [ ] No mentions of "HMJF", "Kemafar", "Farmasi", "UIN Alauddin" in code
- [ ] Generic placeholder data in config and seed files
- [ ] All organization data configurable via `config/index.ts`
- [ ] Documentation updated with generic references
- [ ] `npm run build` succeeds
- [ ] Site runs with placeholder data

**Priority**: CRITICAL - Blocks starterkit adoption
**Effort**: 2-3 hours

---

## Issue #2: [HIGH] Fix README architecture documentation claims

**Labels**: `priority: high`, `type: documentation`, `accuracy`

### Problem
README.md claims to use "Clean Architecture" with "Repository Pattern" and "Factory Pattern", but the actual implementation uses simplified direct Supabase queries.

### Current Claims (Misleading)
```markdown
### 6. **Clean Architecture** ⭐
- Repository pattern
- Factory pattern for swapping implementations
- Clear separation of concerns
```

### Actual Implementation
- **NO** `core/` domain layer exists
- **NO** repository interfaces
- **NO** factory pattern
- **YES** direct Supabase queries in `lib/api/*.ts`
- **YES** feature-based organization (good)
- **YES** type safety (good)

### Solution Options

**Option A: Update README to reflect reality (RECOMMENDED - 1 hour)**
- Remove "Clean Architecture" section
- Update to "Simplified Architecture" or "Feature-Based Organization"
- Remove repository/factory pattern claims
- Show actual data flow: `Component → lib/api helpers → Supabase`

**Option B: Implement actual Clean Architecture (2-3 days)**
- Follow MASTER_PLAN.md to implement proper clean architecture

### Recommendation
**Option A** - The current architecture is fine for a starterkit. Just be honest about it.

### Acceptance Criteria (Option A)
- [ ] Remove "Clean Architecture" claims from README
- [ ] Update architecture section to reflect actual patterns
- [ ] Show real data flow diagram
- [ ] Remove misleading ARCHITECTURE.md references
- [ ] Keep focus on actual strengths (auth, RLS, admin panel)

**Priority**: HIGH - Prevents misleading users
**Effort**: Option A: 1 hour | Option B: 2-3 days

---

## Issue #3: [HIGH] Update SETUP.md with correct paths and references

**Labels**: `priority: high`, `type: documentation`

### Problem
`docs/SETUP.md` still contains references to old project names and incorrect paths.

### Issues Found
- Line 36: `cd griyaflora_babulu` → should be `cd nextjs-supabase-starterkit`
- References to old organization names
- Outdated folder structure references

### Solution
1. Update all paths to reflect new repository structure
2. Replace organization-specific instructions with generic ones
3. Update clone URLs to point to new repo
4. Verify all commands work with current structure

### Acceptance Criteria
- [ ] No references to `griyaflora_babulu`
- [ ] All file paths are correct
- [ ] Clone instructions point to correct repo
- [ ] All commands in setup guide work

**Priority**: HIGH - First user experience
**Effort**: 30 minutes

---

## Issue #4: [HIGH] Phase 1: Extract configuration from constants

**Labels**: `priority: high`, `type: refactor`, `master-plan`

### Problem
Configuration is scattered across the codebase. Following MASTER_PLAN.md Phase 1, we need to extract configuration into dedicated config files.

### Implementation
Follow detailed plan in `docs/MASTER_PLAN.md` Phase 1 (lines 102-190)

### Files to CREATE
- `config/site.config.ts` - Site info (name, email, phone, address, social)
- `config/domain.config.ts` - Categories, divisions, gallery categories
- `config/navigation.config.ts` - Routes, admin navigation

### Files to UPDATE
- `src/lib/constants.ts` - Split into above 3 files
- `tsconfig.json` - Add `@/config/*` path alias
- **14 files** importing from constants need import updates:
  - 5 public pages
  - 3 feature components
  - 6 shared components

### Acceptance Criteria
- [ ] All 3 config files created
- [ ] Constants.ts split correctly
- [ ] All 14+ importing files updated
- [ ] Path alias added to tsconfig
- [ ] `npm run build` → success
- [ ] `npm run lint` → no errors
- [ ] No broken imports
- [ ] Site still works

**Priority**: HIGH - Master plan execution
**Effort**: 2 hours

---

## Issue #5: [MEDIUM] Phase 2: Clean up unused imports

**Labels**: `priority: medium`, `type: refactor`, `master-plan`

### Problem
Codebase has unused imports and inconsistent import ordering. This reduces code quality and readability.

### Implementation
Follow `docs/MASTER_PLAN.md` Phase 2 (lines 193-244)

### Tasks
1. Run `npm run lint` to find unused imports
2. Remove all unused imports
3. Remove unused variables (2 found in Phase 0 inventory)
4. Standardize import order: React → External libs → Internal

### Files Affected
Run to find all files:
```bash
npm run lint 2>&1 | grep "unused" | cut -d':' -f1 | sort -u
```

### Acceptance Criteria
- [ ] `npm run lint` → 0 warnings about unused imports
- [ ] All imports follow consistent order
- [ ] No unused variables
- [ ] `npm run build` → success

**Priority**: MEDIUM - Code quality
**Effort**: 1-1.5 hours

---

## Issue #6: [MEDIUM] Phase 3: Add critical inline documentation

**Labels**: `priority: medium`, `type: documentation`, `master-plan`

### Problem
Complex code (auth, RLS policies, repositories) lacks inline documentation and JSDoc comments.

### Implementation
Follow `docs/MASTER_PLAN.md` Phase 3 (lines 246-353)

### Files Needing Documentation

**High Priority:**
- `src/lib/auth/AuthContext.tsx` - Complex auth flow, race conditions
- `supabase/migrations/20240122000000_initial_schema.sql` - RLS policies

**Medium Priority:**
- `src/lib/supabase/client.ts` - Client-side setup
- `src/lib/supabase/server.ts` - Server-side setup
- All files in `lib/api/*.ts` - Data fetching patterns

### Documentation Standards
- JSDoc for all public functions and interfaces
- Explain WHY, not just WHAT
- Document security implications
- Note performance considerations

### Acceptance Criteria
- [ ] All critical files have JSDoc comments
- [ ] RLS policies explained line-by-line
- [ ] Auth context flow documented
- [ ] No typos in comments
- [ ] `npm run build` → success (comments don't affect build)

**Priority**: MEDIUM - Helps users understand the code
**Effort**: 2-2.5 hours

---

## Issue #7: [MEDIUM] Create unified DataTable component

**Labels**: `priority: medium`, `type: enhancement`, `DX improvement`

### Problem
Admin pages have ~300 lines of duplicate table/pagination code across 4+ pages.

### Duplicate Code Found
**Repeated in:**
- `/src/app/admin/articles/page.tsx`
- `/src/app/admin/events/page.tsx`
- `/src/app/admin/members/page.tsx`
- `/src/app/admin/leadership/page.tsx`

**What's duplicated:**
- Table structure (thead/tbody/tr/td)
- Pagination controls (Previous/Next buttons)
- Loading spinner
- Empty state message
- Search input UI

### Solution
Create a single reusable `<AdminTable>` component that accepts:
- Column configuration
- Data array
- Custom row renderer
- Pagination props
- Loading state
- Empty state message

### Existing Work
- `AdminDataTable` component partially exists
- `useAdminTable` hook handles data fetching
- Just need to standardize usage across all pages

### Acceptance Criteria
- [ ] Single DataTable component created
- [ ] All admin list pages use the component
- [ ] ~200-300 lines of code eliminated
- [ ] Consistent UI across all CRUD pages
- [ ] Documentation for using the component

**Priority**: MEDIUM - Reduces duplication
**Effort**: 3-4 hours

---

## Issue #8: [MEDIUM] Standardize error handling patterns

**Labels**: `priority: medium`, `type: enhancement`

### Problem
Error handling is inconsistent across the codebase:
- Articles API: `console.error` + throws Error
- Admin pages: `toast.error()`
- Auth context: `setError()` state
- Some API routes: No try-catch at all

### Files with Error Handling (32 total)
- 12 admin pages
- 8 API routes
- 5 infrastructure repositories
- 7 other files

See `docs/PHASE_0_INVENTORY.md` for complete list.

### Solution
1. Create unified error handling utility (expand `lib/utils/error-handler.ts`)
2. Add error boundaries for React components
3. Standardize API error responses
4. Consistent toast notifications
5. Proper error logging (use existing logger.ts)

### Error Handling Standards
- All API routes: try-catch with proper error responses
- All client components: toast.error() for user feedback
- All mutations: Optimistic updates + rollback on error
- Production: Use logger.ts (not console.log)

### Acceptance Criteria
- [ ] Unified error utility implemented
- [ ] React Error Boundary components added
- [ ] All API routes have try-catch
- [ ] Consistent error messages to users
- [ ] Production logger used (not console)
- [ ] Error handling documented

**Priority**: MEDIUM - Better UX and debugging
**Effort**: 2-3 hours

---

## Issue #9: [MEDIUM] Remove duplicate component directories

**Labels**: `priority: medium`, `type: refactor`

### Problem
Two component directories exist with overlap:
- `/src/components/ui/` (4 files) - Legacy
- `/src/shared/components/ui/` (13 files) - Current

This creates confusion about which to use and potential import conflicts.

### Files in Both Locations
- Button.tsx
- Card.tsx
- StatusBadge.tsx
- Others...

### Solution
1. Audit both directories for duplicates
2. Keep only `/src/shared/components/` (more organized)
3. Remove `/src/components/` directory
4. Update all imports to use `/src/shared/components/`
5. Run build to catch any missed imports

### Search for imports:
```bash
grep -r "from '@/components/ui'" src/ --include="*.tsx" --include="*.ts"
```

### Acceptance Criteria
- [ ] Only `/src/shared/components/` exists
- [ ] All imports updated
- [ ] No duplicate components
- [ ] `npm run build` → success
- [ ] All pages render correctly

**Priority**: MEDIUM - Reduces confusion
**Effort**: 1-2 hours

---

## Issue #10: [MEDIUM] Enable TypeScript strict mode

**Labels**: `priority: medium`, `type: improvement`

### Problem
`tsconfig.json` has `"strict": false`, allowing `any` types and loose type checking.

### Current State
```json
{
  "compilerOptions": {
    "strict": false  // ⚠️
  }
}
```

### Solution
1. Enable strict mode: `"strict": true`
2. Fix all type errors that appear
3. Replace `any` with proper types
4. Add missing type annotations

### Common Issues to Fix
- Implicit `any` in function parameters
- Unsafe property access
- Nullable value handling
- Event handler types

### Acceptance Criteria
- [ ] `"strict": true` in tsconfig.json
- [ ] Zero TypeScript errors
- [ ] No `any` types (except where truly necessary)
- [ ] `npm run build` → success
- [ ] Proper null/undefined handling

**Priority**: MEDIUM - Code quality and safety
**Effort**: 2-3 hours (depending on errors)

---

## Issue #11: [LOW] Add comprehensive testing setup

**Labels**: `priority: low`, `type: infrastructure`

### Problem
Zero tests exist. No testing framework configured.

### Current State
- No test files
- No Jest/Vitest setup
- No Playwright/Cypress for E2E
- No test scripts in package.json

### Solution

**Unit Testing:**
- Install Vitest (faster than Jest for Vite-based projects)
- Configure for TypeScript + React
- Add test utilities for Supabase mocking

**E2E Testing:**
- Install Playwright
- Add basic auth flow tests
- Add CRUD operation tests

**Integration Testing:**
- Test API routes
- Test database queries
- Test RLS policies

### Tests to Write (Phase 1)
1. Auth context tests
2. Permission helper tests
3. API route tests
4. Critical component tests (RichTextEditor, etc.)
5. E2E: Login → Create article → Publish

### Acceptance Criteria
- [ ] Vitest configured
- [ ] Playwright configured
- [ ] Test scripts in package.json
- [ ] 20+ unit tests written
- [ ] 5+ E2E tests written
- [ ] Tests pass in CI

**Priority**: LOW - Important but not blocking
**Effort**: 1-2 days

---

## Issue #12: [LOW] Add CI/CD workflow with GitHub Actions

**Labels**: `priority: low`, `type: infrastructure`

### Problem
No automated checks. No CI/CD pipeline.

### Current State
- No `.github/workflows/`
- No pre-commit hooks
- No automated linting
- No automated testing
- No automated deployment

### Solution

**Create `.github/workflows/ci.yml`:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    - Install dependencies
    - Run TypeScript checks
    - Run ESLint
    - Run tests (when #11 is done)
    - Build project
```

**Pre-commit Hooks:**
- Install husky + lint-staged
- Run ESLint on staged files
- Run TypeScript check
- Format with Prettier

**Deployment:**
- Auto-deploy to Vercel on main branch
- Preview deployments for PRs

### Files to Create
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `.husky/pre-commit`
- `.lintstagedrc.json`

### Acceptance Criteria
- [ ] CI runs on every push
- [ ] Pre-commit hooks prevent bad commits
- [ ] Auto-deploy to Vercel configured
- [ ] Build status badge in README
- [ ] All checks pass

**Priority**: LOW - Professional polish
**Effort**: 2-3 hours

---

## Summary

**Total Issues**: 12
**Priority Breakdown**:
- CRITICAL: 1 issue (starterkit blocker)
- HIGH: 3 issues (master plan + docs)
- MEDIUM: 6 issues (code quality)
- LOW: 2 issues (infrastructure)

**Recommended Order**:
1. Issue #1 (Remove org references) - **START HERE**
2. Issue #2 (Fix README claims)
3. Issue #3 (Update SETUP.md)
4. Issue #4 (Extract config - Phase 1)
5. Issues #5-10 (Quality improvements)
6. Issues #11-12 (Infrastructure)

**Total Effort Estimate**: 20-25 hours across all issues

---

## How to Create These Issues

### Option 1: GitHub Web UI
1. Go to https://github.com/efisiendev/nextjs-supabase-starterkit/issues/new
2. Copy-paste each issue title and body
3. Add labels manually

### Option 2: GitHub CLI
```bash
# Install gh CLI if needed
# Then for each issue:
gh issue create --title "Issue title" --body "Issue body" --label "priority: high"
```

### Option 3: Automated Script
See `scripts/create-issues.sh` (if we create one)

---

**Generated**: 2026-01-24
**Based on**: Comprehensive codebase audit + docs review
**Next**: Create Issue #1 and start executing!
