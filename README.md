# Family Contribution Tracker

A comprehensive family contribution management system built with Laravel 12, React 19, and TypeScript. This application helps families track monthly financial contributions from members across different categories with role-based access control.

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=flat&logo=inertia&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-Pest_PHP-8BC34A?style=flat&logo=php&logoColor=white)

> A modern, full-stack family contribution tracking system with role-based access control, real-time balance calculations, and comprehensive reporting features.

## 📸 Screenshots

### Welcome Page
![Family Contribution Tracker Welcome](https://github.com/user-attachments/assets/1e904f3d-b5de-4c39-bfa2-82954cc10287)

*Modern Laravel 12 welcome page with clean, responsive design*

---

## 🎯 Overview

The Family Contribution Tracker is designed to manage monthly financial contributions from family members. It supports different contribution categories (Married, Single, Student) with varying fee structures, tracks payment history, calculates outstanding balances, and provides role-based access for contributors and financial secretaries.

## ✨ Features

### 👥 User Management
- **Category-based Contributions**: Members are assigned to categories (Married, Single, Student) with different monthly fees
- **Role-based Access Control**: Uses Spatie Laravel Permission for robust authorization
- **User Registration & Authentication**: Built-in Laravel authentication system

### 💰 Contribution Management
- **Payment Recording**: Financial secretary can record contributions for any member
- **Balance Calculation**: Automatic calculation of outstanding balances based on membership duration
- **Payment History**: Complete contribution history tracking with audit trails
- **Monthly Tracking**: Track contributions by month with status indicators

### 📊 Dashboard Features
- **Personal Dashboard**: Members view their own contribution status and history
- **Admin Dashboard**: Financial secretary gets comprehensive overview and management tools
- **Summary Reports**: Category-wise summaries and outstanding balance reports
- **Recent Activity**: Real-time view of recent contributions and member activity

### 🔐 Security & Permissions
- **Role-based Authorization**: Separate roles for contributors and financial secretary
- **Permission System**: Granular permissions for viewing, creating, and managing contributions
- **Audit Trail**: Track who recorded each payment and when

## 🛠️ Tech Stack

### Backend
- **Laravel 12** - PHP framework with modern features
- **PHP 8.2+** - Latest PHP version support
- **SQLite/MySQL** - Flexible database support
- **Spatie Laravel Permission** - Role and permission management
- **Laravel Sanctum** - API authentication (if needed)

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Inertia.js 2** - Modern monolith approach (no separate API)
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **Lucide React** - Beautiful icon library

### Development Tools
- **Vite 6** - Fast build tool and development server
- **Laravel Pint** - PHP code style fixer
- **Pest PHP** - Modern PHP testing framework
- **ESLint & Prettier** - JavaScript/TypeScript code quality
- **Laravel Sail** - Docker development environment

## 🚀 Quick Start

### Prerequisites
- PHP 8.2 or higher
- Node.js 18 or higher
- Composer
- SQLite (default) or MySQL

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/hussain4real/family.git
cd family
```

2. **Install PHP dependencies**
```bash
composer install
```

3. **Install JavaScript dependencies**
```bash
npm install
```

4. **Environment setup**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Database setup**
```bash
# For SQLite (default)
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed initial data (optional)
php artisan db:seed
```

6. **Build frontend assets**
```bash
npm run build
```

7. **Start development server**
```bash
composer dev
# This starts Laravel server, queue listener, logs, and Vite dev server
```

Visit `http://localhost:8000` to access the application.

## 🎮 Usage

### For Family Members (Contributors)

1. **Register/Login**: Create an account or log in with existing credentials
2. **View Dashboard**: See your contribution status, outstanding balance, and recent payments
3. **Check History**: Review all your past contributions with dates and amounts
4. **Monitor Balance**: Track your outstanding balance and payment status

### For Financial Secretary (Admin)

1. **Admin Dashboard**: Access comprehensive overview of all family contributions
2. **Record Payments**: Add new contribution records for any family member
3. **View Reports**: Generate category-wise summaries and outstanding balance reports
4. **Manage Members**: View all family members and their contribution status
5. **Track Activity**: Monitor recent contributions and member activity

### Category Setup

The system supports three default categories:
- **Married**: Higher monthly contribution
- **Single**: Standard monthly contribution  
- **Student**: Reduced monthly contribution

Categories can be configured with custom monthly fees and descriptions.

## 🔧 Development

### Available Commands

```bash
# Start full development stack
composer dev

# Start with SSR enabled
composer dev:ssr

# Frontend only
npm run dev

# Build for production
npm run build
npm run build:ssr

# Code quality
npm run lint          # ESLint with auto-fix
npm run format        # Prettier formatting
npm run types         # TypeScript checking
vendor/bin/pint       # PHP code style

# Testing
composer test         # Run all PHP tests
php artisan test      # Direct Artisan testing
vendor/bin/pest       # Run Pest tests

# Database
php artisan migrate           # Run migrations
php artisan migrate:fresh     # Fresh migration
php artisan db:seed          # Run seeders
```

### Project Structure

```
├── app/
│   ├── Actions/              # Business logic actions
│   ├── Http/
│   │   ├── Controllers/      # Laravel controllers
│   │   └── Resources/        # API resources
│   └── Models/               # Eloquent models
├── database/
│   ├── migrations/           # Database migrations
│   ├── seeders/             # Database seeders
│   └── factories/           # Model factories
├── resources/
│   ├── js/
│   │   ├── components/       # React components
│   │   ├── pages/           # Inertia.js pages
│   │   ├── layouts/         # Layout components
│   │   ├── types/           # TypeScript definitions
│   │   └── lib/             # Utility functions
│   └── views/               # Blade templates
├── routes/
│   ├── web.php              # Web routes
│   ├── auth.php             # Authentication routes
│   └── settings.php         # Settings routes
└── tests/
    ├── Feature/             # Feature tests
    └── Unit/                # Unit tests
```

### Key Concepts

#### User Roles & Permissions
- **contributor**: Basic family member role
- **financial-secretary**: Admin role with full access

#### Permissions
- `view-own-contributions`: View personal contribution data
- `view-all-contributions`: View all family contributions
- `create-contributions`: Record new contributions
- `delete-contributions`: Remove contribution records

#### Business Logic
- **Balance Calculation**: `(months_since_joining × monthly_fee) - total_payments`
- **Payment Tracking**: All contributions tracked with recorder information
- **Category Management**: Flexible category system with configurable fees

## 🧪 Testing

The application includes comprehensive tests:

```bash
# Run all tests
composer test

# Run specific test suites
vendor/bin/pest --filter=Contribution
vendor/bin/pest tests/Feature/
vendor/bin/pest tests/Unit/

# Run with coverage
vendor/bin/pest --coverage
```

### Test Categories
- **Unit Tests**: Business logic, actions, and models
- **Feature Tests**: HTTP endpoints and user flows
- **Authorization Tests**: Role and permission validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Run tests and ensure they pass
5. Run code quality tools:
   ```bash
   vendor/bin/pint        # PHP formatting
   npm run lint           # JS/TS linting
   npm run format         # JS/TS formatting
   ```
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Coding Standards
- Follow PSR-12 for PHP code
- Use TypeScript strict mode for frontend
- Follow Laravel conventions for naming and structure
- Write tests for new features
- Update documentation as needed

## 📝 License

This project is open-sourced software licensed under the [MIT license](LICENSE).

## 🙏 Acknowledgments

- Built with [Laravel](https://laravel.com/)
- Frontend powered by [React](https://reactjs.org/) and [Inertia.js](https://inertiajs.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Permission management by [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission)

## 📞 Support

For support, questions, or feature requests:
- 📧 Email: [support@family-tracker.com](mailto:support@family-tracker.com)
- 🐛 Issues: [GitHub Issues](https://github.com/hussain4real/family/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/hussain4real/family/discussions)

## 🏗️ Roadmap

- [ ] Mobile app development (React Native)
- [ ] Email notifications for due payments
- [ ] Bulk payment imports (CSV/Excel)
- [ ] Advanced reporting and analytics
- [ ] Multi-currency support
- [ ] API endpoints for third-party integrations

---

**Family Contribution Tracker** - Making family financial management simple and transparent.