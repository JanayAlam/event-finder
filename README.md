# Event Finder

An intelligent event and trip discovery platform powered by agentic AI. Search, plan, and create events effortlessly with AI-assisted recommendations, real-time collaboration, and seamless booking management.

## Overview

Event Finder is a full-stack application that combines AI-powered intelligent search and trip planning with a modern web platform for event discovery and management. Users can leverage AI agents to ask natural language questions about events and trips, receive personalized recommendations, generate complete itineraries, and create bookable events with multi-stage workflows.

## Key Features

- **AI-Powered Search**: Natural language queries to discover events and trips
- **Intelligent Trip Planning**: Generate complete event plans and itineraries with AI assistance
- **Event Creation & Management**: Draft, publish, and manage events with multi-stage workflows
- **Real-Time Collaboration**: Live discussions and notifications with WebSocket support
- **Host & Attendee Profiles**: Comprehensive user profiles with verification systems
- **Payment Processing**: Built-in payment management for bookings
- **Profile Reviews**: Community-driven feedback system
- **Rate Limiting**: Smart API rate limiting for fair usage

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS, ShadcnUI
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose
- **AI**: OpenAI Agents SDK
- **Real-Time**: Socket.io
- **Authentication**: JWT with JWKS-RSA
- **Task Scheduling**: Node Cron
- **Image Processing**: Sharp
- **Validation**: Zod
- **State Management**: Zustand

## Project Structure

```
event-finder/
├── server/                 # Backend Express server
│   ├── api/               # API routes and controllers
│   ├── ai/                # AI agents and tools
│   ├── db/                # Database connection
│   ├── models/            # MongoDB schemas
│   ├── middlewares/       # Express middlewares
│   ├── libs/              # Utilities and use-cases
│   ├── enums/             # Constants and enumerations
│   └── settings/          # Configuration files
├── src/                    # Frontend Next.js app
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── repositories/      # API client classes
│   ├── stores/            # Zustand stores
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript types
├── common/                 # Shared code
│   ├── types/             # Shared type definitions
│   └── validation-schemas/# Zod validation schemas
└── package.json           # Dependencies

```

## Prerequisites

- **Node.js**: >= 22.x
- **Yarn**: >= 1.17.x
- **MongoDB**: Local instance or MongoDB Atlas connection
- **Environment Variables**: See [Environment Setup](#environment-setup)

## Installation

### 1. Install Node & Yarn

Ensure you have Node.js >= 22.x installed. Install Yarn globally:

```bash
npm install -g yarn
```

### 2. Clone the Repository

```bash
git clone <repository-url>
cd event-finder
```

### 3. Install Dependencies

```bash
yarn install
```

## Environment Setup

Copy the `.env.example` in the root directory to `.env` and fill in the values as needed:

```env
NODE_ENV=development
PORT=5000

DB_URL=mongodb+srv://<db_username>:<db_password>@<cluster_name>.ahemwpn.mongodb.net/tripmate-dev

# kinde
KINDE_SITE_URL=http://localhost:5000

KINDE_DOMAIN=
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_REDIRECT_URI=
KINDE_LOGOUT_REDIRECT_URI=

ACCESS_TOKEN_EXPIRY_SEC=86400
REFRESH_TOKEN_EXPIRY_SEC=1296000

# The domain it's running on
PUBLIC_SERVER_URL=http://localhost:5000
NEXT_LOCAL_SERVER_URL=http://localhost:5000

NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Google Map
GOOGLE_MAP_API_KEY=

# Facebook App
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# SSLCommerz
SSL_COMMERZ_STORE_ID=
SSL_COMMERZ_PASSWORD=
```

## Development Setup

### 1. Start MongoDB

For local development, ensure MongoDB is running:

```bash
# Using MongoDB Community Server
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Run Development Server

The development server runs both Frontend (Next.js) and Backend (Express) concurrently:

```bash
yarn dev
```

This will:

- Start Next.js frontend on `http://localhost:5000`
- Start Express backend on `http://localhost:5000/api/v1`

## Available Scripts

### Development

```bash
yarn dev
```

Runs both frontend and backend in development mode with hot reloading using Nodemon.

### Building

```bash
yarn build
```

Builds both the TypeScript server and Next.js frontend for production.

```bash
yarn build:next
```

Builds only the Next.js frontend.

```bash
yarn build:server
```

Compiles TypeScript server to JavaScript.

### Linting & Formatting

```bash
yarn lint
```

Run ESLint to check for code quality issues.

```bash
yarn format
```

Format code using Prettier.

### Database

To create admin user, register a normal account via the application, after that manually update the user's role in the database. (users collection)

```bash
yarn seed:events
```

Seeds the database with sample event data for testing. But make sure you have created accounts before running this seed. This seed script only create events, it requires at least one host account.

### Utilities

```bash
yarn clean
```

Removes build artifacts (`.next`, `dist`, `tsconfig.tsbuildinfo`).

## Running in Production

### Build

```bash
yarn build
```

### Start

```bash
yarn start
```

This will start the Express server which serves the Next.js build.

## API Endpoints

### Status

- `GET /api/v1/status/health` - Health check

### Authentication

- `GET /api/v1/auth/login` - Start login
- `GET /api/v1/auth/callback` - Auth callback
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Current user
- `GET /api/v1/auth/my-profile` - Current user profile

### Users

- `GET /api/v1/users/:id/profile` - User profile by user ID
- `GET /api/v1/users` - List users (admin)
- `PATCH /api/v1/users/:id/block` - Block user (admin)
- `PATCH /api/v1/users/:id/unblock` - Unblock user (admin)

### Profiles

- `GET /api/v1/profiles/:id` - Profile details
- `GET /api/v1/profiles/:id/trips-status` - Trips status summary
- `PATCH /api/v1/profiles/:id/personal-info` - Update personal info
- `POST /api/v1/profiles/:id/profile-image` - Upload profile image
- `DELETE /api/v1/profiles/:id/profile-image` - Remove profile image

### Profile Reviews

- `GET /api/v1/profile-reviews/profiles/:id` - List reviews for profile
- `POST /api/v1/profile-reviews` - Create review
- `PATCH /api/v1/profile-reviews/:id` - Update review

### Account Verifications

- `GET /api/v1/account-verifications/status` - Verification status
- `PUT /api/v1/account-verifications` - Submit verification
- `GET /api/v1/account-verifications/pending-reviews` - Pending reviews (admin)
- `PATCH /api/v1/account-verifications/:accountVerificationId/accept` - Accept (admin)
- `PATCH /api/v1/account-verifications/:accountVerificationId/decline` - Decline (admin)

### Admin

- `GET /api/v1/admins/facebook/callback` - Facebook OAuth callback
- `GET /api/v1/admins/statistics` - Dashboard stats
- `GET /api/v1/admins/events` - Event list (admin)
- `PATCH /api/v1/admins/events/:id/block` - Block event (admin)
- `GET /api/v1/admins/payments/stats` - Payment stats (admin)
- `GET /api/v1/admins/payments` - Payment list (admin)
- `GET /api/v1/admins/facebook-token` - Facebook token
- `POST /api/v1/admins/facebook-token` - Update Facebook token
- `DELETE /api/v1/admins/facebook-token` - Disconnect Facebook
- `GET /api/v1/admins/facebook/auth-url` - Facebook auth URL
- `GET /api/v1/admins/facebook/pages` - Managed pages

### Promotion Requests

- `POST /api/v1/promotion-requests` - Request host promotion
- `GET /api/v1/promotion-requests` - List pending requests (admin)
- `PATCH /api/v1/promotion-requests/:promotionRequestId/accept` - Accept request (admin)
- `PATCH /api/v1/promotion-requests/:promotionRequestId/reject` - Reject request (admin)

### Events

- `POST /api/v1/events` - Create event
- `POST /api/v1/events/upload/cover` - Upload cover photo
- `POST /api/v1/events/upload/additional` - Upload additional photo
- `POST /api/v1/events/remove-photo` - Remove photo
- `GET /api/v1/events/admin/all` - List all events (admin)
- `GET /api/v1/events/upcoming` - Upcoming events
- `GET /api/v1/events` - List events
- `POST /api/v1/events/search` - Search events
- `GET /api/v1/events/recent/hosted/:id` - Recent hosted events
- `GET /api/v1/events/recent/joined/:id` - Recent joined events
- `POST /api/v1/events/:id/publish/facebook` - Publish to Facebook
- `GET /api/v1/events/:id` - Event details
- `PATCH /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete event
- `PATCH /api/v1/events/:id/status` - Toggle status
- `PATCH /api/v1/events/:id/block` - Toggle block (admin)
- `POST /api/v1/events/:id/join` - Join event
- `GET /api/v1/events/:id/payments` - Event payments (host)
- `GET /api/v1/events/:id/payment/success` - Payment success callback
- `POST /api/v1/events/:id/payment/success` - Payment success callback
- `GET /api/v1/events/:id/payment/fail` - Payment fail callback
- `POST /api/v1/events/:id/payment/fail` - Payment fail callback
- `GET /api/v1/events/:id/payment/cancel` - Payment cancel callback
- `POST /api/v1/events/:id/payment/cancel` - Payment cancel callback

### Event Drafts

- `POST /api/v1/event-drafts` - Create draft
- `GET /api/v1/event-drafts` - List drafts
- `GET /api/v1/event-drafts/:id` - Draft details
- `PATCH /api/v1/event-drafts/:id` - Update draft
- `DELETE /api/v1/event-drafts/:id` - Delete draft

### Discussions (Event)

- `POST /api/v1/events/:id/discussions/upload-photo` - Upload discussion photo
- `POST /api/v1/events/:id/discussions/remove-photo` - Remove discussion photo
- `GET /api/v1/events/:id/discussions` - List discussions
- `POST /api/v1/events/:id/discussions` - Create discussion
- `POST /api/v1/events/:id/discussions/:discussionId/comments` - Add comment
- `PATCH /api/v1/events/:id/discussions/:discussionId/upvote` - Toggle upvote
- `PATCH /api/v1/events/:id/discussions/:discussionId/downvote` - Toggle downvote
- `DELETE /api/v1/events/:id/discussions/:discussionId` - Delete discussion

### Payments

- `GET /api/v1/payments/me` - My payments

### AI

- `POST /api/v1/ai` - Execute AI search query (rate limited)
- `POST /api/v1/ai/generate-event` - Generate event plan

### Notifications

- `GET /api/v1/notifications` - My notifications
- `PATCH /api/v1/notifications/mark-as-read` - Mark all as read
- `PATCH /api/v1/notifications/:id/mark-as-read` - Mark one as read

## Error Handling

The application includes comprehensive error handling:

- **Rate Limiting (429)**: Shows user-friendly toast and in-app error messages
- **Validation Errors**: Zod schemas validate input with clear error messages
- **Authentication Errors**: JWT expiration and refresh token handling
- **Server Errors**: Winston logging for server-side debugging
- **Client Errors**: Suppressed in console for handled errors, displayed in UI

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Failed

- Ensure MongoDB is running
- Check `DB_URL` in `.env`
- Verify connection string format

## License

This project is private. All rights reserved. See the [LICENSE](LICENSE) file.

---

**Last Updated**: March 18, 2026
