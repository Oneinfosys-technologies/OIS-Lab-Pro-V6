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

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy
- **AI Integration**: OpenAI API for test result analysis
- **Styling**: Tailwind CSS with shadcn/ui components

## Deployment Guide

### Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL database server
- OpenAI API key (for AI insights feature)
- Git

### Step 1: Get the Code

```bash
# Clone the repository
git clone <repository-url> ois-labpro
cd ois-labpro
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DATABASE_URL=postgresql://username:password@hostname:port/database
PGHOST=hostname
PGUSER=username
PGPASSWORD=password
PGDATABASE=database
PGPORT=port

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key

# Session Secret
SESSION_SECRET=your_secure_session_secret
```

Replace the placeholders with your actual values.

### Step 4: Database Setup

```bash
# Set up database schema and initial data
npm run db:push
```

This will create all necessary tables and relationships in the database.

### Step 5: Building the Application

```bash
# For production build
npm run build
```

### Step 6: Running the Application

#### Development Mode

```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

## Deployment Options

### Option 1: Traditional Server (e.g., VPS)

1. Set up a Node.js environment on your server
2. Install PostgreSQL
3. Clone the repository and follow steps 2-6
4. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/server/index.js --name "ois-labpro"
   ```
5. Set up Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. Secure with SSL using Let's Encrypt

### Option 2: Docker Deployment

1. Create a `Dockerfile` in the root directory:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

2. Create a `docker-compose.yml` file:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/ois_labpro
      - PGHOST=db
      - PGUSER=postgres
      - PGPASSWORD=postgres
      - PGDATABASE=ois_labpro
      - PGPORT=5432
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - SESSION_SECRET=${SESSION_SECRET}
  
  db:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=ois_labpro
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

3. Run with Docker Compose:

```bash
docker-compose up -d
```

### Option 3: Cloud Platforms

#### AWS Elastic Beanstalk

1. Install the EB CLI and initialize your project:
   ```bash
   pip install awsebcli
   eb init
   ```

2. Create an environment and deploy:
   ```bash
   eb create ois-labpro-env
   eb deploy
   ```

#### Heroku

1. Install Heroku CLI and login:
   ```bash
   npm install -g heroku
   heroku login
   ```

2. Create Heroku app:
   ```bash
   heroku create ois-labpro
   ```

3. Add PostgreSQL:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. Set environment variables:
   ```bash
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   heroku config:set SESSION_SECRET=your_secure_session_secret
   ```

5. Deploy:
   ```bash
   git push heroku main
   ```

## Initial Admin Access

After deployment, you can access the admin dashboard with:
- Username: admin
- Password: admin123

## API Documentation

The OIS LabPro API endpoints are organized into these categories:

1. **Authentication**:
   - POST `/api/login`: Log in with username and password
   - POST `/api/register`: Create a new user account
   - GET `/api/user`: Get current authenticated user
   - POST `/api/logout`: Log out current user

2. **Test Categories**:
   - GET `/api/test-categories`: List all test categories
   - GET `/api/test-categories/:id`: Get a specific test category

3. **Tests**:
   - GET `/api/tests`: List all tests
   - GET `/api/tests/:id`: Get a specific test
   - GET `/api/tests/category/:categoryId`: Get tests by category

4. **Bookings**:
   - GET `/api/bookings`: Get user's bookings
   - GET `/api/bookings/:id`: Get booking details
   - POST `/api/bookings`: Create a new booking

5. **Reports**:
   - GET `/api/reports`: Get user's reports
   - GET `/api/reports/:id`: Get report details
   - GET `/api/reports/download/:reportId`: Get report by report ID (public)
   - POST `/api/reports/generate-insights`: Generate AI insights for test results

6. **Admin Endpoints**:
   - GET `/api/admin/bookings`: Get all bookings (admin only)
   - PATCH `/api/admin/bookings/:id/status`: Update booking status (admin only)
   - POST `/api/admin/reports`: Create a report for a booking (admin only)

## System Requirements

- Minimum 1 CPU core
- 1GB RAM
- 10GB storage
- PostgreSQL 14+
- Node.js 18+

## Troubleshooting

1. **Database Connection Issues**: 
   - Ensure the PostgreSQL server is running
   - Check the DATABASE_URL and other PG* environment variables
   - Verify network connectivity and firewall settings

2. **API Insight Features Not Working**:
   - Validate the OPENAI_API_KEY is correctly set
   - Check OpenAI API quota and limits

3. **Session Management Issues**:
   - Ensure SESSION_SECRET is properly set
   - Check cookie settings in auth.ts for production environments

## Security Considerations

1. Always use HTTPS in production
2. Set secure cookie flags when in production
3. Implement rate limiting for API endpoints
4. Regularly update dependencies
5. Back up the database regularly

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For further assistance, please contact the development team.