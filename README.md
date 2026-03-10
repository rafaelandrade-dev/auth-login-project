# Auth + Dashboard Frontend Scaffold

This is a Vite + React + TypeScript frontend application configured with Tailwind CSS v3, React Router v6, Axios, React Query (TanStack Query v5), Zod, React Hook Form, Lucide React, and Sonner.

## Architectural Decisions
- **Vite & React**: Chosen for fast development server, HMR, and optimized production builds.
- **TypeScript**: Used strictly to catch errors at compile-time and improve developer experience.
- **Tailwind CSS v3**: Utility-first CSS framework for rapid and maintainable styling.
- **React Router DOM v6**: Used for declarative routing including protected routes.
- **TanStack Query v5**: Utilized for remote data fetching, caching, and synchronization.
- **Zod & React Hook Form**: Combined for robust, type-safe client-side form validation.
- **Axios**: Handled HTTP requests with interceptors configuration for sending JWT tokens and managing 401 Unauthorized responses.
- **Sonner & Lucide React**: Chosen for accessible toast notifications and consistent iconography.

## Getting Started

### Prerequisites
Make sure you have Node.js and npm installed.

### Installation

1. Clone this repository and navigate to the project directory:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:
   Copy `.env.example` to `.env` and configure your variables:
   ```bash
   cp .env.example .env
   ```
   *Required variables:*
   - `VITE_API_URL`: The base URL for the mock JSON server API.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Folder Structure
- `src/api/` - Axios instance and interceptors.
- `src/components/` - Generic UI components and Layout components.
- `src/contexts/` - Global state contexts (e.g. AuthContext).
- `src/hooks/` - Custom React hooks.
- `src/lib/` - Utility functions like `cn` for Tailwind classes.
- `src/pages/` - React page components corresponding to routes.
- `src/routes/` - Application routing definition.
- `src/types/` - TypeScript interface definitions for application entities and payloads.
