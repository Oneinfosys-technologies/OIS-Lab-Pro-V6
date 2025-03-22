# OIS LabPro - AI-Powered Lab Management Platform

OIS LabPro is a comprehensive laboratory management platform built with modern web technologies. It offers test booking, tracking, and smart reporting capabilities enhanced with AI-powered insights.

![OIS LabPro Logo](generated-icon.png)

## Features

- **User Authentication**: Secure login and registration system
- **Test Management**: Browse and book diagnostic tests
- **Sample Collection Options**: Choose between lab visit or home collection
- **Real-time Status Tracking**: Monitor the progress of your tests
- **AI-Powered Insights**: Get intelligent analysis of your test results
- **Secure Report Access**: View and download test reports with personalized recommendations
- **Administrative Dashboard**: Manage tests, bookings, and generate reports

## Technology Stack

- **Frontend**: React.js with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy
- **AI Integration**: OpenAI API for test result analysis
- **UI Components**: shadcn/ui components

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL database server
- OpenAI API key (for AI insights feature)

### Installation

1. Clone the repository and install dependencies:
```bash
git clone <repository-url> ois-labpro
cd ois-labpro
npm install
```

2. Set up environment variables in `.env`:
```
DATABASE_URL=postgresql://username:password@hostname:port/database
PGHOST=hostname
PGUSER=username
PGPASSWORD=password
PGDATABASE=database
PGPORT=port
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_secure_session_secret
```

3. Initialize the database:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

### Authentication Endpoints
- POST `/api/login`: Log in with username and password
- POST `/api/register`: Create a new user account
- GET `/api/user`: Get current authenticated user
- POST `/api/logout`: Log out current user

### Test Management
- GET `/api/test-categories`: List all test categories
- GET `/api/test-categories/:id`: Get a specific test category
- GET `/api/tests`: List all tests
- GET `/api/tests/:id`: Get a specific test
- GET `/api/tests/category/:categoryId`: Get tests by category

### Bookings
- GET `/api/bookings`: Get user's bookings
- GET `/api/bookings/:id`: Get booking details
- POST `/api/bookings`: Create a new booking

### Reports
- GET `/api/reports`: Get user's reports
- GET `/api/reports/:id`: Get report details
- GET `/api/reports/download/:reportId`: Get report by report ID
- POST `/api/reports/generate-insights`: Generate AI insights for test results

### Admin Endpoints
- GET `/api/admin/bookings`: Get all bookings (admin only)
- PATCH `/api/admin/bookings/:id/status`: Update booking status
- POST `/api/admin/reports`: Create a report for a booking

## Initial Admin Access

After deployment, you can access the admin dashboard with:
- Username: admin
- Password: admin123

## Troubleshooting

1. **Database Connection Issues**: 
   - Ensure PostgreSQL server is running
   - Check environment variables
   - Verify network connectivity

2. **AI Insights Not Working**:
   - Validate OpenAI API key
   - Check API quota and limits

3. **Session Issues**:
   - Verify SESSION_SECRET is set
   - Check cookie settings in auth configuration

## License

This project is licensed under the MIT License.

## Contact

For further assistance, please contact the development team.