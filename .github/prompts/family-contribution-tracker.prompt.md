---
mode: agent
---

# Family Contribution Tracker Implementation

Build a comprehensive family contr4. **Routing & Naviga6. **Documentation**:
   - Updated README with new features and role management
   - API documentation with permission requirements
   - User guide for both roles
   - Role and permission management documentation**:
   - Protected routes with Spatie role/permission middleware
   - Navigation menu updates with role-based visibility
   - Breadcrumb implementation

5. **Testing Suite**:
   - Feature tests for all endpoints with role/permission scenarios
   - Authorization tests using Spatie roles and permissions
   - Balance calculation tests
   - UI component tests
   - Role assignment and permission testsacking system for managing monthly contributions from family members across three categories (Married, Single, Student) with different fee structures.

## Core Requirements

### User Management & Categories
- Extend existing User model with `category` enum field (married, single, student)
- Each category has different monthly contribution amounts
- Maintain existing Laravel authentication system

### User Roles & Permissions (Spatie Laravel Permission)
- **Contributors**: View own contribution history, current balance, outstanding amounts
- **Financial Secretary**: Admin role with full access to record payments, view all contributions, generate reports
- Use Spatie Laravel Permission package for robust ACL management
- Define roles: `contributor`, `financial-secretary`
- Define permissions: `view-own-contributions`, `view-all-contributions`, `create-contributions`, `update-contributions`, `delete-contributions`

### Data Models Required
1. **Users table extension**:
   - Add `category` enum column (married, single, student)
   - Remove `is_financial_secretary` field (use Spatie roles instead)

2. **Spatie Permission Tables** (auto-generated):
   - `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions`

3. **Contributions table**:
   - `id`, `user_id` (FK), `amount` (decimal), `date` (date), `recorded_by_id` (FK to users), `timestamps`
   - Proper foreign key relationships and constraints

### Business Logic
- Monthly fee lookup by category (configurable)
- Balance calculation: (months_due × monthly_fee) - sum(payments)
- Payment recording with audit trail (who recorded the payment)
- Date-based contribution tracking

### UI Components Needed
1. **Contributor Dashboard**:
   - Current monthly fee display
   - Outstanding balance calculation
   - Payment history table (paginated)
   - Payment status indicators

2. **Financial Secretary Dashboard**:
   - Summary cards (total collected, outstanding by category)
   - Payment recording form
   - All contributions table with filters
   - Export/reporting capabilities

### Technical Implementation
- Use Laravel 12 + Inertia.js + React 19 + TypeScript stack
- Follow existing project architecture and coding standards
- Implement proper authorization policies
- Use Eloquent Resources for data transformation
- Apply shadcn/ui components for consistent styling
- Write comprehensive Pest tests

### Security & Authorization (Spatie Laravel Permission)
- Contributors can only view their own data (via `view-own-contributions` permission)
- Financial Secretary has admin privileges (via `financial-secretary` role with all contribution permissions)
- Use Spatie middleware for route protection: `role:financial-secretary`, `permission:view-all-contributions`
- Implement proper policy-based authorization with Spatie integration
- Secure API endpoints with role/permission middleware

### Database Features
- Proper indexing for performance
- Foreign key constraints
- Soft deletes if needed
- Migration rollback capability

## Expected Deliverables

1. **Package Installation & Setup**:
   - Install Spatie Laravel Permission package
   - Publish and run permission migrations
   - Configure User model with HasRoles trait
   - Create role and permission seeders

2. **Database Structure**:
   - Migration files for users table extension
   - Migration for contributions table
   - Updated model relationships
   - Database seeders with sample data and roles/permissions

3. **Backend Implementation**:
   - ContributionController with CRUD operations
   - ContributionPolicy integrated with Spatie permissions
   - ContributionResource for data transformation
   - Business logic for balance calculations
   - Middleware integration for role/permission checks

4. **Frontend Implementation**:
   - Contributor dashboard page
   - Financial Secretary admin page
   - Reusable components (ContributionList, SummaryCard, ContributionForm)
   - Proper TypeScript interfaces

4. **Routing & Navigation**:
   - Protected routes with middleware
   - Navigation menu updates
   - Breadcrumb implementation

5. **Testing Suite**:
   - Feature tests for all endpoints
   - Authorization tests
   - Balance calculation tests
   - UI component tests

6. **Documentation**:
   - Updated README with new features
   - API documentation
   - User guide for both roles

## Constraints & Guidelines

### Follow Project Standards
- Install and configure Spatie Laravel Permission package
- Use Laravel 11+ structure and conventions
- Follow PSR-4 autoloading
- Use Pest for testing (including role/permission tests)
- Apply Laravel Pint for code formatting
- Use existing Tailwind CSS configuration
- Integrate Spatie middleware and policies properly

### Performance Considerations
- Implement pagination for large datasets
- Add database indexes on frequently queried columns
- Optimize queries to prevent N+1 problems
- Consider caching for frequently accessed data

### Data Integrity
- Validate all input data
- Prevent negative contribution amounts
- Ensure date consistency
- Maintain audit trails

### User Experience
- Responsive design for mobile devices
- Clear error messages and validation feedback
- Loading states for async operations
- Intuitive navigation and workflows

## Success Criteria

1. Contributors can log in and view their contribution status (with proper role assignment)
2. Financial Secretary can record payments and view comprehensive reports (via permissions)
3. System accurately calculates balances and outstanding amounts
4. All operations are properly authorized using Spatie roles and permissions
5. Role and permission management is properly implemented and testable
6. Code passes all tests and follows project standards
7. UI is consistent with existing application design
8. Spatie Laravel Permission is properly integrated and configured
