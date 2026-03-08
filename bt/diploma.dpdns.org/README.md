# Global Horizon University

A modern educational platform for Global Horizon University built with React, Express, MongoDB, and Node.js.

## Features

- Responsive homepage with navigation and hero section
- Certificate application form with validation
- Certificate verification system
- PDF certificate generation
- Payment processing with Stripe
- Comprehensive test suite

## Tech Stack

### Frontend

- React 18
- React Router v6
- Tailwind CSS for styling
- Jest and React Testing Library for testing

### Backend

- Node.js with Express
- MongoDB with Mongoose
- PDFKit for certificate generation
- Stripe for payment processing

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or cloud instance)
- Stripe account for payment processing

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/global-horizon-university.git
cd global-horizon-university
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp env.example .env
```

Edit the `.env` file and add your MongoDB connection string and Stripe API keys.

4. Start the development server

```bash
npm run dev
```

This will start both the React frontend (port 3000) and Express backend (port 5000).

## Project Structure

```
/
├── public/           # Static files
├── src/
│   ├── components/   # React components
│   │   ├── server/       # Express server
│   │   │   ├── certificates/ # Generated certificates
│   │   │   ├── models/   # Mongoose models
│   │   │   └── routes/   # API routes
│   │   └── tests/        # Test files
│   ├── Dockerfile        # Docker configuration
│   └── vercel.json       # Vercel deployment config
└── package.json      # Dependencies and scripts
```

## Testing and Quality Assurance

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Run end-to-end tests (requires app to be running)
npm run test:e2e
```

### Test Types

- **Unit Tests**: Testing individual components and functions in isolation
- **Integration Tests**: Testing API endpoints and database interactions
- **End-to-End Tests**: Using Cypress to test complete user flows

### Code Quality Tools

- **ESLint**: JavaScript and React linting

  ```bash
  npm run lint
  ```

- **Prettier**: Code formatting
  ```bash
  npm run format
  ```

### Continuous Integration

This project uses GitHub Actions for continuous integration. On each push or pull request to main branches, the following processes are automatically run:

- Installing dependencies
- Running linting checks
- Running all tests
- Reporting test coverage

### Pre-commit Hooks

The project uses Husky and lint-staged to run checks before commits:

- Code formatting and linting runs on staged files before commits
- Tests run before pushing changes

## Deployment

### Vercel Deployment

This project includes a `vercel.json` configuration file for easy deployment to Vercel.

### Docker Deployment

A Dockerfile is included for containerized deployments.

```bash
docker build -t global-horizon-university .
docker run -p 8080:8080 global-horizon-university
```

## License

MIT
