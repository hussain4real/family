# Copilot Instructions

## Core Commands

### Development
- `composer dev` - Start full development stack (Laravel server, queue listener, logs, Vite)
- `composer dev:ssr` - Start development with SSR enabled
- `npm run dev` - Vite development server only
- `php artisan serve` - Laravel development server only

### Build & Asset Management
- `npm run build` - Build frontend assets for production
- `npm run build:ssr` - Build with SSR support

### Testing
- `composer test` - Run full PHP test suite (clears config first)
- `php artisan test` - Run tests directly with Artisan
- `vendor/bin/pest` - Run Pest tests directly
- `vendor/bin/pest --filter=TestName` - Run specific test

### Code Quality
- `npm run lint` - ESLint with auto-fix
- `npm run format` - Prettier formatting
- `npm run format:check` - Check formatting without changes
- `npm run types` - TypeScript type checking (no emit)
- `vendor/bin/pint` - PHP CS Fixer (Laravel Pint)

### Database
- `php artisan migrate` - Run database migrations
- `php artisan migrate:fresh` - Drop all tables and re-run migrations
- `php artisan db:seed` - Run database seeders
- `php artisan migrate:fresh --seed` - Fresh migration with seeding

## Architecture

### Tech Stack
- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 19 + TypeScript + Inertia.js
- **Database**: SQLite (default), MySQL supported
- **Build Tool**: Vite 6 with Laravel plugin
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS 4 with CSS variables
- **Testing**: Pest PHP testing framework
- **Queue System**: Laravel queues (configurable driver)

### Key Packages
- **Inertia.js**: Full-stack React without API layer
- **Ziggy**: Laravel route generation for frontend
- **shadcn/ui**: Modern React component library
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management
- **Laravel Pint**: PHP code style fixer
- **Laravel Sail**: Docker development environment

### Project Structure
- `app/` - Laravel application logic (Controllers, Models, etc.)
- `resources/js/` - React frontend code (Inertia 2 + React 19 + Tailwind 4)
  - `components/` - Reusable React components
  - `components/ui/` - shadcn/ui components
  - `hooks/` - Custom React hooks
  - `layouts/` - Application layouts
  - `lib/` - Utility functions and configuration
  - `pages/` - Inertia.js page components
  - `types/` - TypeScript definitions
- `routes/` - Laravel route definitions
- `database/` - Migrations, seeders, factories
- `tests/` - Pest test files (Feature/Unit)

### Data Layer
- **Primary DB**: SQLite (`database/database.sqlite`)
- **Cache**: Configurable (array/redis/memcached)
- **Session**: Configurable storage driver
- **Queue**: Sync (default), supports Redis/database

## Style Rules

### General Code Guidelines
- No obvious code comments above methods/blocks - only comment complex logic that needs explanation
- Don't comment out old code when making changes (assume Git history preservation)

### Laravel-Specific Rules
- Use `php artisan make:*` commands instead of manual folder creation
- For Service/Action classes: `php artisan make:class`
- Pivot table migrations: alphabetical order (`create_project_role_table`, not `create_role_project_table`)
- **Migration updates**: In development, edit existing migration files directly instead of creating new ones
- **Prefer Actions over Services** for business logic
- **Service injection**: 
  - Single method usage: inject directly into method with type-hinting
  - Multiple method usage: initialize in constructor
  - Use PHP 8 constructor property promotion
- **Eloquent Resources**: Always transform models using Resources before passing to Inertia
  - Single models: `new UserResource($user)` or `$user->toResource()`
  - Collections: `UserResource::collection($users)` or `$users->toResourceCollection()`
  - Generate with: `php artisan make:resource UserResource`
  - Collections with: `php artisan make:resource UserCollection`
- **Laravel 11+ Structure**:
  - Only AppServiceProvider exists (register new ones in `bootstrap/providers.php` if absolutely necessary)
  - Event Listeners auto-discover with proper type-hinting
  - Console scheduling in `routes/console.php` (not `app/Console/Kernel.php`)
  - Middleware registration in `bootstrap/app.php` (not `app/Http/Kernel.php`)
  - Use `fake()` helper in Factories (not `$this->faker`)
  - Policies auto-discover (no manual registration needed)

### TypeScript/React
- Use TypeScript strict mode
- React 19 with automatic JSX transform (`jsx: "react-jsx"`)
- Import organization via `prettier-plugin-organize-imports`
- Path aliases: `@/*` for `resources/js/*`
- Component props: No prop-types (TypeScript handles this)
- Hooks: Follow exhaustive-deps rule

### PHP/Laravel
- PSR-4 autoloading: `App\\` namespace
- Laravel conventions for naming (Controllers, Models, etc.)
- Use Pest for testing with Feature/Unit separation
- Artisan command structure for custom commands

### Code Formatting
- **Prettier**: Format JS/TS/TSX files in `resources/`
- **Laravel Pint**: PHP CS Fixer for backend code
- **ESLint**: React-specific rules + TypeScript
- **Tailwind**: Plugin for class sorting

### Component Architecture
- shadcn/ui components in `@/components/ui`
- Custom components use `class-variance-authority` for variants
- Consistent import structure: React hooks first, then libraries, then local

### File Naming
- React components: PascalCase (`.tsx`)
- Pages: kebab-case for Inertia routing
- Laravel: Laravel naming conventions (Controllers, Models, etc.)
- Tests: `*Test.php` suffix, descriptive names

### Error Handling
- Frontend: React error boundaries where appropriate
- Backend: Laravel exception handling
- Testing: Pest expectations with descriptive assertions

## Development Workflow

### Adding Features
1. Create Laravel route in appropriate route file
2. Create controller method with Inertia::render()
3. Create Resource classes for data transformation (`php artisan make:resource`)
4. Transform Eloquent models with Resources before passing to Inertia
5. Create React page component in `resources/js/pages/`
6. Add necessary UI components using shadcn/ui patterns
7. Write tests in appropriate test directory
8. Use Actions for business logic (prefer over Services)
9. Leverage Laravel 11+ auto-discovery features

### SSR Considerations
- SSR enabled by default (Inertia config)
- Build SSR assets with `npm run build:ssr`
- SSR server runs on port 13714
- Consider SSR compatibility when using browser-only APIs

### Database Changes
- Always create migrations for schema changes
- Use model factories for test data
- Seed important data in DatabaseSeeder
- Consider foreign key constraints (enabled by default)

### Performance
- Vite handles asset optimization and code splitting
- Laravel config caching for production
- Queue system available for background tasks
- Consider database indexing for performance-critical queries
