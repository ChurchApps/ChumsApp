# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CHUMS (CHUrch Management Software) is a React-based church management application that provides comprehensive member management, attendance tracking, donation management, and ministry planning capabilities. The app uses TypeScript and Material-UI components, with authentication handled through the @churchapps/apphelper library.

## Development Commands

```bash
# Setup and installation
npm install
npm run postinstall  # Copy locales and CSS from apphelper

# Development
npm start  # Start development server
npm run build  # Build for production
npm test  # Run tests

# Code quality
npm run lint:only  # Check linting (TypeScript/JavaScript files)
npm run lint:fix  # Fix linting issues automatically

# Deployment (requires AWS CLI)
npm run deploy-demo     # Deploy to demo environment
npm run deploy-staging  # Deploy to staging environment
npm run deploy-prod     # Deploy to production environment
```

## Architecture Overview

### Application Structure
- **App.tsx**: Root component with theme, routing, and context providers
- **ControlPanel.tsx**: Main application controller handling authentication flow
- **Authenticated.tsx**: Main authenticated routes and layout structure
- **UserContext.tsx**: Global state management for user, church, and person data

### Key Architectural Patterns

1. **Context-Based State Management**: Uses React Context (UserContext) for global state including user authentication, church selection, and person data.

2. **Route-Based Module Organization**: Features are organized by functional areas (people, groups, donations, forms, plans, etc.) with dedicated page components and sub-components.

3. **Wrapper Architecture**: All authenticated routes use a common Wrapper component that provides the header and navigation structure.

4. **API Integration**: Uses @churchapps/apphelper for API calls with multiple service endpoints (MembershipApi, GivingApi, AttendanceApi, etc.).

5. **Environment-Based Configuration**: EnvironmentHelper manages different configurations for dev/staging/prod environments.

### Module Structure
Each feature module follows a consistent pattern:
- `[Feature]Page.tsx` - Main page component
- `components/` - Feature-specific components
- `index.ts` - Export declarations

Key modules:
- **people/**: Member and visitor management
- **groups/**: Group management and sessions
- **donations/**: Financial tracking and reporting
- **forms/**: Custom form creation and submissions
- **plans/**: Ministry planning and scheduling
- **attendance/**: Check-in and attendance tracking
- **tasks/**: Task management and automations

### Dependencies
- **@churchapps/apphelper**: Core authentication, API, and UI helpers
- **@mui/material**: Material-UI components and theming
- **react-router-dom**: Client-side routing
- **react-dnd**: Drag-and-drop functionality
- **axios**: HTTP client (via apphelper)

## Environment Setup

1. Copy `dotenv.sample.txt` to `.env`
2. Update `.env` with appropriate API URLs for your environment
3. Run `npm install` and `npm run postinstall`
4. Use `npm start` to launch development server

## Code Conventions

- TypeScript is used throughout with strict type checking (except null checks disabled)
- Material-UI components and theming
- Functional components with React hooks
- Interfaces defined in `helpers/Interfaces.ts` and component-specific files
- Environment-specific configuration in `EnvironmentHelper.ts`
- Consistent file naming: PascalCase for components, camelCase for utilities