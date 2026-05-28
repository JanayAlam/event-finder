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

## Demo Videos

### Feature 1: Smart Trip Generation for Hosts

**Video**: Host Searching for Events with AI-Generated Suggestions

When a host searches for available trips and the system cannot find any matching existing events, the AI agent intelligently generates a new trip tailored to the host's location and preferences. The system creates a complete event plan with destination details, dates, pricing, and capacity, then presents it for the host to publish.

**Key Interaction Flow**:

- Host initiates a natural language search (e.g., "I want to organize a trip to Cox's Bazar next month")
- **Search Agent** analyzes the request and queries existing events
- When no suitable events are found, **Event Creator Agent** automatically generates a new event
- Event is presented with complete details ready for publication

**Watch**: [ai-workplace-for-host.mp4](./assets/ai-workplace-for-host.mp4)

---

### Feature 2: Intelligent Trip Discovery for Users

**Video**: User Finding Similar Trips with AI Recommendations

When a user is interested in visiting a specific location, the AI-powered search finds similar existing trips and intelligently recommends the best matches based on destination, dates, budget, and travel style. This helps users discover relevant events they can join.

**Key Interaction Flow**:

- User expresses travel intent (e.g., "I want to explore the beaches in Bangladesh this summer")
- **Search Agent** extracts location, dates, budget, and preferences
- System queries all available events and filters matches
- Personalized recommendations are returned with matching trip suggestions

**Watch**: [ai-workplace-for-user.mp4](./assets/ai-workplace-for-user.mp4)

---

Below are embedded demo videos. GitHub supports HTML5 video tags in README; use the controls to play.

<details>
<summary><strong>Host demo — Smart Trip Generation (click to expand)</strong></summary>

<p>
<video controls width="720" preload="none" poster="./assets/ai-workplace-for-host.mp4">
  <source src="./assets/ai-workplace-for-host.mp4" type="video/mp4">
  Your browser does not support the video tag. You can <a href="./assets/ai-workplace-for-host.mp4">download or open the video</a> directly.
</video>
</p>

Host flow: when a host searches and no matching trips exist, the system hands off to the Event Creator Agent which generates a complete, form-ready trip proposal for the host to publish.

</details>

<details>
<summary><strong>Traveler demo — Intelligent Trip Discovery (click to expand)</strong></summary>

<p>
<video controls width="720" preload="none" poster="./assets/ai-workplace-for-user.mp4">
  <source src="./assets/ai-workplace-for-user.mp4" type="video/mp4">
  Your browser does not support the video tag. You can <a href="./assets/ai-workplace-for-user.mp4">download or open the video</a> directly.
</video>
</p>

Traveler flow: users submit natural language queries; the Search Agent finds similar trips and returns personalized recommendations.

</details>

## AI Agent Architecture

Event Finder uses an **agentic AI system** powered by OpenAI's Agents SDK, enabling dynamic decision-making and intelligent tool usage:

### Core Components

#### 1. **Search Agent** (`search.agent.ts`)

- **Purpose**: Discovers and recommends existing trips based on user queries
- **Capabilities**:
  - Parses natural language travel descriptions
  - Extracts key parameters: location, dates, budget, group size, preferences (tags)
  - Queries the event database using structured filters
  - Returns personalized trip recommendations with explanations
- **Tools Used**:
  - `get_events_tool`: Retrieves events matching search criteria
  - `get_event_tags_tool`: Maps user preferences to event categories

#### 2. **Event Creator Agent** (`event-creator.agent.ts`)

- **Purpose**: Generates complete trip plans when no existing events match user needs
- **Capabilities**:
  - Parses trip requirements from natural language input
  - Validates user eligibility to create events (role-based)
  - Calculates trip duration and dates
  - Generates comprehensive event details including title, description, pricing, and capacity
  - Produces one complete, form-ready event object ready for database insertion
- **Tools Used**:
  - `check_if_eligible_to_create_event_tool`: Validates host permissions
  - `calculate_event_duration_tool`: Computes accurate trip dates and duration
  - `get_event_tags_tool`: Assigns relevant event categories

#### 3. **Workspace Agent** (`workspace.agent.ts`)

- **Purpose**: Main orchestrator agent for general workspace interactions
- **Capabilities**:
  - Routes user queries to appropriate sub-agents
  - Maintains conversation context across multiple interactions
  - Provides intelligent fallback handling when specific agents cannot fulfill requests

### Conversation Memory System

- **Short-Term Memory**: `ChatConversationShortMemory` - Maintains recent conversation history (last 5 interactions)
- **Context Preservation**: Each agent receives previous conversation context to maintain continuity
- **Stateful Reasoning**: Agents reference prior exchanges to make coherent, context-aware decisions

### Agent Execution Flow

1. User sends natural language query to `/api/v1/ai` or `/api/v1/ai/generate-event` endpoint
2. Query is enriched with conversation history and user context
3. Appropriate agent is invoked based on intent:
   - Search queries → **Search Agent**
   - Event creation → **Event Creator Agent**
   - General questions → **Workspace Agent**
4. Agent uses available tools to gather information and make decisions
5. Agent returns structured output with message and data payload
6. Response is cached in short-term memory for context continuity

### Tool-Augmented Intelligence

Each agent is equipped with specific tools that enable real-time interaction with the application:

- **Database Query Tools**: Access events, tags, user eligibility
- **Calculation Tools**: Duration computation, date validation
- **Validation Tools**: Input guardrails, permission checks

This architecture ensures **reliable**, **contextual**, and **intelligent** responses while maintaining full traceability of agent decisions.

## Project Structure

```
event-finder/
├── server/                    # Backend Express server
│   ├── api/
│   │   └── v1/
│   │       ├── routers/       # API route handlers
│   │       │   ├── ai.router.ts              # AI agent execution endpoints
│   │       │   ├── auth.router.ts            # Authentication flow
│   │       │   ├── event.router.ts           # Event CRUD & management
│   │       │   ├── event-draft.router.ts     # Draft event persistence
│   │       │   ├── discussion.router.ts      # Real-time event discussions
│   │       │   ├── profile.router.ts         # User profile management
│   │       │   ├── payment.router.ts         # Payment processing
│   │       │   └── [other resource routes]
│   │       └── controllers/   # Business logic & API handlers
│   ├── ai/                    # 🤖 AI Agent System
│   │   ├── run.ts             # Agent orchestration & execution
│   │   ├── agents/            # Specialized AI agents
│   │   │   ├── search.agent.ts        # Trip discovery agent
│   │   │   ├── event-creator.agent.ts # Event generation agent
│   │   │   └── workspace.agent.ts     # General workspace agent
│   │   ├── tools/             # Tool definitions for agents
│   │   │   ├── search.tools.ts        # Event search & filtering
│   │   │   ├── common.tools.ts        # Shared tools
│   │   │   └── event-creator.tools.ts # Event creation validators
│   │   └── memory/            # Conversation management
│   │       └── chat-conversation-short-memory.ts
│   ├── db/                    # Database
│   │   └── connect-mongodb.ts # MongoDB connection setup
│   ├── models/                # MongoDB schemas & models
│   ├── middlewares/           # Express middlewares
│   ├── libs/                  # Utilities & use-cases
│   │   └── external-services/ # Third-party integrations
│   ├── enums/                 # Constants & enumerations
│   └── settings/              # Configuration management
├── src/                       # Frontend Next.js application
│   ├── app/                   # Next.js app directory structure
│   ├── components/            # React components
│   │   ├── shared/            # Reusable components
│   │   ├── ui/                # ShadcnUI components
│   │   └── providers/         # Context & state providers
│   ├── repositories/          # API client classes
│   ├── stores/                # Zustand state management
│   ├── types/                 # Frontend TypeScript types
│   └── utils/                 # Utility functions
├── common/                    # Shared code (Frontend + Backend)
│   ├── types/                 # Shared type definitions
│   │   ├── ai.types.ts        # AI agent type contracts
│   │   ├── event.types.ts
│   │   ├── payment.types.ts
│   │   └── [other domain types]
│   └── validation-schemas/    # Zod validation schemas
│       ├── ai.schemas.ts      # AI input/output validation
│       ├── event.schemas.ts
│       ├── auth.schemas.ts
│       └── [other domain schemas]
└── assets/                    # Static assets
    ├── ai-workplace-for-host.mp4    # Demo: Host trip generation
    └── ai-workplace-for-user.mp4    # Demo: User trip discovery
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

DB_URL=mongodb+srv://<db_username>:<db_password>@<cluster_name>.ahemwpn.mongodb.net/<db_name>

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

- `GET /api/v1/status/health` - Health check endpoint

### Authentication

- `GET /api/v1/auth/login` - Initiate login flow
- `GET /api/v1/auth/callback` - OAuth callback handler
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current authenticated user
- `GET /api/v1/auth/my-profile` - Get current user's full profile

### Users

- `GET /api/v1/users/:id/profile` - Retrieve user profile by ID
- `GET /api/v1/users` - List all users (admin only)
- `PATCH /api/v1/users/:id/block` - Block user account (admin only)
- `PATCH /api/v1/users/:id/unblock` - Unblock user account (admin only)

### Profiles

- `GET /api/v1/profiles/:id` - Get profile details
- `GET /api/v1/profiles/:id/trips-status` - Get trip participation summary
- `PATCH /api/v1/profiles/:id/personal-info` - Update personal information
- `POST /api/v1/profiles/:id/profile-image` - Upload profile photo
- `DELETE /api/v1/profiles/:id/profile-image` - Remove profile photo

### Profile Reviews

- `GET /api/v1/profile-reviews/profiles/:id` - List all reviews for a profile
- `POST /api/v1/profile-reviews` - Create new profile review
- `PATCH /api/v1/profile-reviews/:id` - Update existing review

### Account Verifications

- `GET /api/v1/account-verifications/status` - Check verification status
- `PUT /api/v1/account-verifications` - Submit verification documents
- `GET /api/v1/account-verifications/pending-reviews` - List pending verifications (admin)
- `PATCH /api/v1/account-verifications/:accountVerificationId/accept` - Approve verification (admin)
- `PATCH /api/v1/account-verifications/:accountVerificationId/decline` - Reject verification (admin)

### Admin Operations

- `GET /api/v1/admins/facebook/callback` - Facebook OAuth callback
- `GET /api/v1/admins/statistics` - Dashboard statistics
- `GET /api/v1/admins/events` - List all events (admin viewable)
- `PATCH /api/v1/admins/events/:id/block` - Block/unblock event (admin)
- `GET /api/v1/admins/payments/stats` - Payment statistics (admin)
- `GET /api/v1/admins/payments` - List all payments (admin)
- `GET /api/v1/admins/facebook-token` - Get stored Facebook token
- `POST /api/v1/admins/facebook-token` - Update Facebook token
- `DELETE /api/v1/admins/facebook-token` - Disconnect Facebook account
- `GET /api/v1/admins/facebook/auth-url` - Get Facebook OAuth URL
- `GET /api/v1/admins/facebook/pages` - Fetch managed Facebook pages

### Promotion Requests

- `POST /api/v1/promotion-requests` - Submit request to become host
- `GET /api/v1/promotion-requests` - List pending requests (admin)
- `PATCH /api/v1/promotion-requests/:promotionRequestId/accept` - Approve promotion (admin)
- `PATCH /api/v1/promotion-requests/:promotionRequestId/reject` - Reject promotion (admin)

### Events

- `POST /api/v1/events` - Create new event
- `POST /api/v1/events/upload/cover` - Upload event cover photo
- `POST /api/v1/events/upload/additional` - Upload additional photos
- `POST /api/v1/events/remove-photo` - Remove photo from event
- `GET /api/v1/events/admin/all` - List all events (admin)
- `GET /api/v1/events/upcoming` - Get upcoming events
- `GET /api/v1/events` - List events with pagination
- `POST /api/v1/events/search` - Search events with filters
- `GET /api/v1/events/recent/hosted/:id` - Recent events hosted by user
- `GET /api/v1/events/recent/joined/:id` - Recent events joined by user
- `POST /api/v1/events/:id/publish/facebook` - Publish event to Facebook
- `GET /api/v1/events/:id` - Get event details
- `PATCH /api/v1/events/:id` - Update event information
- `DELETE /api/v1/events/:id` - Delete event
- `PATCH /api/v1/events/:id/status` - Toggle event visibility
- `PATCH /api/v1/events/:id/block` - Block/unblock event (admin)
- `POST /api/v1/events/:id/join` - Join (register for) event
- `GET /api/v1/events/:id/payments` - Get event payments (host only)
- `GET /api/v1/events/:id/payment/success` - Payment success callback (GET)
- `POST /api/v1/events/:id/payment/success` - Payment success callback (POST)
- `GET /api/v1/events/:id/payment/fail` - Payment failure callback (GET)
- `POST /api/v1/events/:id/payment/fail` - Payment failure callback (POST)
- `GET /api/v1/events/:id/payment/cancel` - Payment cancellation callback (GET)
- `POST /api/v1/events/:id/payment/cancel` - Payment cancellation callback (POST)

### Event Drafts

- `POST /api/v1/event-drafts` - Create event draft
- `GET /api/v1/event-drafts` - List user's draft events
- `GET /api/v1/event-drafts/:id` - Get draft details
- `PATCH /api/v1/event-drafts/:id` - Update draft event
- `DELETE /api/v1/event-drafts/:id` - Delete draft event

### Discussions (Event Conversations)

- `POST /api/v1/events/:id/discussions/upload-photo` - Upload discussion photo
- `POST /api/v1/events/:id/discussions/remove-photo` - Remove discussion photo
- `GET /api/v1/events/:id/discussions` - Get all discussions for event
- `POST /api/v1/events/:id/discussions` - Create discussion topic
- `POST /api/v1/events/:id/discussions/:discussionId/comments` - Add comment to discussion
- `PATCH /api/v1/events/:id/discussions/:discussionId/upvote` - Upvote discussion
- `PATCH /api/v1/events/:id/discussions/:discussionId/downvote` - Downvote discussion
- `DELETE /api/v1/events/:id/discussions/:discussionId` - Delete discussion

### Payments

- `GET /api/v1/payments/me` - Get current user's payment history

### 🤖 AI Agents (Rate Limited)

- `POST /api/v1/ai` - **Search & Discovery Agent**
  - Accepts natural language queries about events and trips
  - Returns matching events or trip recommendations
  - **Request Body**: `{ query: string, userContext?: { userId, userRole } }`
  - **Use Case**: "I want to find a beach trip next month" / "Show me hiking events in Sylhet"
- `POST /api/v1/ai/generate-event` - **Event Creator Agent**
  - Generates complete trip plans based on user requirements
  - Returns form-ready event object ready to publish
  - **Request Body**: `{ query: string, conversationHistory?: TAIConversationContextItemDto[] }`
  - **Use Case**: "Create a 3-day trip to Cox's Bazar for 15 people" / "Plan a mountain trek next weekend"

### Notifications

- `GET /api/v1/notifications` - Get user's notifications
- `PATCH /api/v1/notifications/mark-as-read` - Mark all notifications as read
- `PATCH /api/v1/notifications/:id/mark-as-read` - Mark single notification as read

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
