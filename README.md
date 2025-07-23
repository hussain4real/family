# Family Contribution Tracker

A comprehensive web application for managing monthly family contributions across different member categories. Built with Laravel 12, Inertia.js, React 19, and TypeScript.

## 🎯 Features

### For Family Members (Contributors)
- **Personal Dashboard**: View your contribution status, outstanding balance, and payment history
- **Balance Tracking**: Real-time calculation of outstanding amounts based on membership category
- **Payment History**: Complete record of all your contributions with dates and amounts
- **Category-based Fees**: Different monthly rates for Married, Single, and Student members

### For Financial Secretary (Admin)
- **Admin Dashboard**: Comprehensive overview of all family contributions
- **Payment Recording**: Record contributions for any family member
- **Member Management**: Track which members are behind on payments
- **Reporting**: View summaries by category and time period
- **Audit Trail**: Track who recorded each payment and when

### Security & Permissions
- **Role-based Access Control**: Uses Spatie Laravel Permission package
- **Two User Roles**: 
  - `contributor`: Can view own contributions only
  - `financial-secretary`: Full admin access to all data
- **Protected Routes**: All endpoints secured with appropriate middleware
- **Data Isolation**: Contributors can only access their own data

## 🛠 Tech Stack

- **Backend**: Laravel 12 with PHP 8.2+
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4.0 with shadcn/ui components
- **Database**: SQLite (configurable for other databases)
- **Authentication**: Laravel Breeze with Inertia.js
- **Authorization**: Spatie Laravel Permission
- **Testing**: Pest PHP
- **Build Tools**: Vite 6

## 📋 Requirements

- PHP 8.2 or higher
- Node.js 18+ and npm
- Composer
- SQLite (or your preferred database)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd family
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database Setup**
   ```bash
   # Create SQLite database
   touch database/database.sqlite
   
   # Run migrations and seed data
   php artisan migrate --seed
   ```

6. **Build Assets**
   ```bash
   npm run build
   ```

## 🏃‍♂️ Development

### Start Development Server
```bash
# Start all services (Laravel server, queue worker, logs, and Vite)
composer run dev
```

This will start:
- Laravel development server on `http://localhost:8000`
- Queue worker for background jobs
- Laravel Pail for real-time logs
- Vite development server for hot module replacement

### Alternative Commands
```bash
# Just Laravel server
php artisan serve

# Just frontend development
npm run dev

# Run with SSR support
composer run dev:ssr
```

## 🧪 Testing

```bash
# Run all tests
composer run test

# Run tests with coverage
php artisan test --coverage

# Run specific test file
php artisan test tests/Feature/ContributionControllerTest.php
```

## 📁 Project Structure

```
app/
├── Actions/                    # Business logic actions
│   ├── CalculateUserBalanceAction.php
│   ├── CreateContributionAction.php
│   └── GetContributionSummaryAction.php
├── Http/
│   ├── Controllers/           # Request handlers
│   ├── Requests/             # Form request validation
│   └── Resources/            # API resource transformers
├── Models/                   # Eloquent models
│   ├── User.php
│   ├── Contribution.php
│   └── Category.php
└── Policies/                 # Authorization policies

resources/js/
├── components/               # Reusable React components
│   ├── contributions/       # Contribution-specific components
│   ├── dashboard/           # Dashboard components
│   └── ui/                  # Shared UI components (shadcn/ui)
├── pages/                   # Inertia.js page components
├── layouts/                 # Layout components
└── types/                   # TypeScript type definitions

database/
├── migrations/              # Database schema
├── seeders/                # Database seeders
└── factories/              # Model factories for testing
```

## 🗄 Database Schema

### Users Table
- `id`, `name`, `email`, `password`
- `category_id` - Foreign key to categories table
- `email_verified_at`, `remember_token`, timestamps

### Categories Table
- `id`, `name` (married, single, student)
- `monthly_fee` - Decimal amount for monthly contribution
- timestamps

### Contributions Table
- `id`, `user_id` (FK), `amount`, `date`
- `recorded_by_id` (FK to users) - Audit trail
- `notes` - Optional notes
- timestamps

### Spatie Permission Tables
- `roles`, `permissions`, `model_has_roles`, etc.
- Handles role-based access control

## 🔐 User Roles & Permissions

### Roles
- **contributor**: Regular family members
- **financial-secretary**: Administrative role

### Permissions
- `view-own-contributions`: View personal contribution data
- `view-all-contributions`: View all family contributions
- `create-contributions`: Record new contributions
- `update-contributions`: Modify existing contributions
- `delete-contributions`: Remove contributions

## 💰 Contribution Categories

| Category | Monthly Fee |
|----------|-------------|
| Married  | $50.00      |
| Single   | $30.00      |
| Student  | $15.00      |

*Fees are configurable through the database seeders*

## 🚦 Routes

### Public Routes
- `/` - Welcome page
- `/login` - Authentication
- `/register` - User registration

### Protected Routes (Contributor)
- `/dashboard` - Personal dashboard
- `/contributions` - Personal contribution history

### Admin Routes (Financial Secretary)
- `/contributions/admin` - Admin dashboard
- `/contributions/create` - Record new contribution
- `/contributions/{id}` - View/edit specific contribution

## 🔧 Configuration

### Environment Variables
```env
APP_NAME="Family Contribution Tracker"
APP_ENV=local
APP_KEY=base64:...
APP_URL=http://localhost

DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite

# Add other standard Laravel configurations
```

### Customization
- **Monthly Fees**: Update through `CategorySeeder.php`
- **User Categories**: Modify the categories table and related seeders
- **Permissions**: Extend through `RolePermissionSeeder.php`

## 📝 Code Style

The project uses:
- **Laravel Pint** for PHP code formatting
- **ESLint** and **Prettier** for JavaScript/TypeScript
- **PSR-4** autoloading standards

```bash
# Format PHP code
./vendor/bin/pint

# Format frontend code
npm run format

# Lint frontend code
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Write or update tests as needed
5. Run the test suite to ensure everything passes
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📖 Documentation

### For Users
- Family members can view their personal dashboard showing contribution status
- Financial secretary has admin access to manage all contributions
- All payments are tracked with dates and recorded by whom

### For Developers
- Follow Laravel conventions and the existing project structure
- Use the Actions pattern for business logic
- Write Pest tests for new features
- Use TypeScript interfaces for type safety
- Follow the existing component patterns in React

## 🐛 Troubleshooting

### Common Issues

1. **Database not found**: Ensure SQLite file exists and path is correct in `.env`
2. **Permission denied**: Check file permissions on database and storage directories
3. **Assets not loading**: Run `npm run build` and ensure Vite is properly configured
4. **Authentication issues**: Clear cache with `php artisan config:clear`

### Getting Help
- Check the Laravel documentation for framework-specific issues
- Review Inertia.js docs for frontend integration questions
- Consult Spatie Permission docs for authorization problems

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 👥 Authors

Built with ❤️ for family contribution management.

---

For more information about the Laravel framework, visit the [Laravel documentation](https://laravel.com/docs).
