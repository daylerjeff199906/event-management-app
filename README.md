# 🌍 Tourism & Culture Platform (VamoYa)

A comprehensive web platform for creating, managing, and promoting tourism and cultural events. This platform connects event organizers, institutions, and tourists to discover and participate in cultural experiences, manage events, and explore tourist destinations.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Usage Instructions](#-usage-instructions)
- [Features by Role](#-features-by-role)
- [Screenshots & Prototypes](#-screenshots--prototypes)
- [Contributing](#contributing)
- [License](#license)

## Overview

VamoYa is the leading platform for creating, managing, and promoting successful events. Empower your brand, connect with your audience, and take your experiences to the next level. The platform offers:

- **User Authentication**: Secure login and registration with OAuth support (Google, Facebook)
- **Event Management**: Create, edit, and manage events with detailed information
- **Institutional Accounts**: Organizations can manage multiple events and team members
- **Tourist Places Management**: Showcase and discover cultural and tourist destinations
- **Advanced Search & Filtering**: Find events by category, location, date, and more
- **User Onboarding**: Guided profile setup for personalized experiences

## 🛠 Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Motion](https://motion.dev/)** - Animation library

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service (Authentication, Database, Storage)
- **PostgreSQL** - Relational database (via Supabase)
- **[Next Auth v5](https://next-auth.js.org/)** - Authentication for Next.js

### Form Handling & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Form state management
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### State Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management

### UI/UX Libraries
- **[React Day Picker](https://react-day-picker.js.org/)** - Date picker component
- **[React Toastify](https://fkhadra.github.io/react-toastify/)** - Toast notifications
- **[React Multi Carousel](https://www.npmjs.com/package/react-multi-carousel)** - Carousel component

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **npm** - Package manager

## ✨ Key Features

- ✅ User authentication with email/password and OAuth (Google, Facebook)
- ✅ Comprehensive event management system
- ✅ Role-based access control (Guest, User, Institution Owner, Admin)
- ✅ Institutional account management
- ✅ Event categories and filtering
- ✅ User profile management with interests
- ✅ Event registration and ticketing
- ✅ Admin panel for platform management
- ✅ Responsive design for all devices
- ✅ Real-time notifications
- ✅ Image upload and management

## 📂 Project Structure

```
event-management-app/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (auth)/                   # Authentication pages (login, signup, forgot-password)
│   │   ├── (dashboard)/              # Protected dashboard pages
│   │   │   ├── admin/                # Admin panel pages
│   │   │   ├── dashboard/            # User dashboard
│   │   │   └── organizations/        # Institution management
│   │   ├── (portal)/                 # Public portal pages
│   │   │   ├── events/               # Public events listing
│   │   │   └── onboarding/           # User onboarding flow
│   │   ├── api/                      # API routes
│   │   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── avatar/               # Avatar upload
│   │   │   └── images/               # Image management
│   │   ├── auth/callback/            # OAuth callback handler
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # React components
│   │   ├── app/                      # Application-specific components
│   │   │   ├── auth/                 # Authentication components
│   │   │   ├── miscellaneous/        # Utility components
│   │   │   ├── navbar-custom/        # Navigation components
│   │   │   └── panel-admin/          # Admin panel components
│   │   ├── ui/                       # Reusable UI components (buttons, forms, etc.)
│   │   ├── animate-ui/               # Animation components
│   │   └── magicui/                  # Special UI effects
│   │
│   ├── modules/                      # Feature modules
│   │   ├── admin/                    # Admin module (components, pages, schemas)
│   │   ├── dashboard/                # Dashboard module
│   │   ├── events/                   # Events module
│   │   ├── portal/                   # Portal module
│   │   └── core/                     # Core shared module
│   │
│   ├── services/                     # API services and data fetching
│   │   ├── core.supabase.ts          # Supabase client initialization
│   │   ├── events.services.ts        # Event-related services
│   │   ├── user.services.ts          # User-related services
│   │   ├── institution.services.ts   # Institution services
│   │   └── *.services.ts             # Other service files
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── auth/                     # Authentication types
│   │   ├── core/                     # Core types (user, institution, etc.)
│   │   ├── events/                   # Event-related types
│   │   └── miscellaneous/            # Utility types
│   │
│   ├── data/                         # Configuration and static data
│   │   ├── config.app.ts             # App configuration
│   │   ├── config-app-url.ts         # URL routing configuration
│   │   ├── config.images.ts          # Image configurations
│   │   └── config.meta.ts            # SEO metadata
│   │
│   ├── hooks/                        # Custom React hooks
│   ├── lib/                          # Utility functions and helpers
│   ├── utils/                        # Utility functions
│   │   └── supabase/                 # Supabase utility functions
│   ├── assets/                       # Static assets (images, logos, backgrounds)
│   ├── auth.ts                       # NextAuth configuration
│   └── middleware.ts                 # Next.js middleware
│
├── public/                           # Static files served directly
├── .vscode/                          # VS Code configuration
├── components.json                   # Shadcn/UI components config
├── eslint.config.mjs                 # ESLint configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # This file
```

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun**
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/daylerjeff199906/event-management-app.git
cd event-management-app
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth Configuration
AUTH_SECRET=your_nextauth_secret
AUTH_GOOGLE_ID=your_google_oauth_client_id
AUTH_GOOGLE_SECRET=your_google_oauth_client_secret
AUTH_FACEBOOK_ID=your_facebook_app_id
AUTH_FACEBOOK_SECRET=your_facebook_app_secret

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Vercel Blob Storage (Optional - for image uploads)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

**How to obtain these values:**

1. **Supabase**: Create a project at [supabase.com](https://supabase.com) and get your URL and keys from Project Settings > API
2. **NextAuth Secret**: Generate using `openssl rand -base64 32`
3. **Google OAuth**: Create credentials at [Google Cloud Console](https://console.cloud.google.com)
4. **Facebook OAuth**: Create an app at [Facebook Developers](https://developers.facebook.com)

### Step 4: Set Up Database

If you're using Supabase, the database schema should be set up automatically. However, you may need to:

1. Run any pending migrations in your Supabase project
2. Set up database tables according to your schema
3. Configure Row Level Security (RLS) policies if needed

### Step 5: Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 💻 Usage Instructions

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

### Starting Production Server

After building, start the production server:

```bash
npm run start
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

### Deployment

#### Deploy to Vercel (Recommended)

1. Push your code to a GitHub repository
2. Visit [vercel.com](https://vercel.com) and import your repository
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push to main branch

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/daylerjeff199906/event-management-app)

#### Deploy to Other Platforms

The application can also be deployed to:
- **AWS Amplify**: Follow the [Next.js deployment guide](https://docs.amplify.aws/guides/hosting/nextjs/)
- **Netlify**: Use the [Next.js runtime](https://docs.netlify.com/integrations/frameworks/next-js/)
- **Render**: Deploy as a [Next.js application](https://render.com/docs/deploy-nextjs-app)
- **Railway**: Follow [Railway deployment docs](https://docs.railway.app/guides/nextjs)

## 👥 Features by Role

### 🌐 Guest Users (Non-authenticated)

- Browse public events and cultural activities
- Search and filter events by category, location, and date
- View event details and descriptions
- View institution profiles
- Access public tourist place information
- Register for an account

### 👤 Authenticated Users

- All guest features, plus:
- Personalized event recommendations based on interests
- Save favorite events and institutions
- Register for events and purchase tickets
- Manage personal profile and preferences
- Receive notifications about events
- Track event registrations and attendance history
- Complete guided onboarding process

### 🏢 Institution Owners

- All authenticated user features, plus:
- Create and manage institutional accounts
- Create, edit, and delete events
- Manage event schedules and sessions
- Configure ticketing and registration
- View event analytics and attendance
- Manage team members and roles
- Upload and manage institution branding
- Respond to event inquiries

### 👑 Platform Administrators

- All features from previous roles, plus:
- Review and approve institution registration requests
- Manage all users and institutions
- Access platform-wide analytics
- Configure platform settings
- Moderate content and events
- Manage event categories and tags
- System-wide user management

## 📸 Screenshots & Prototypes

### Design Resources

**Figma Prototypes**
- [Main Platform Design](#) - *Add your Figma link here*
- [Mobile App Design](#) - *Add your Figma link here*

**Stitch IA Prototypes**
- [User Flow Diagrams](#) - *Add your Stitch IA link here*

### Application Screenshots

*Screenshots will be added here as the application develops*

#### Homepage
![Homepage](docs/screenshots/homepage.png)
*Coming soon*

#### Event Listing
![Event Listing](docs/screenshots/events.png)
*Coming soon*

#### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Coming soon*

#### Admin Panel
![Admin Panel](docs/screenshots/admin.png)
*Coming soon*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

---

**Built with ❤️ using Next.js and modern web technologies**

For more information or support, please contact the development team.
