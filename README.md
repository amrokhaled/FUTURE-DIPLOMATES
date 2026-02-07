# International Diplomacy & Leadership Conference Platform

A high-converting, professional website for managing international summits, developed with Next.js 14 and Tailwind CSS.

## Getting Started

### 1. Install Dependencies

Since this project was built without initial `npm install`, you must run:

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the root directory and add your keys (see `.env.example`).

```bash
cp .env.example .env.local
```

### 3. Setup Database

This project is configured for **Supabase**.
1. Copy the contents of `supabase/migrations/001_initial_schema.sql` and run it in your Supabase SQL Editor.
2. Update `.env.local` with your Supabase URL and Keys.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features Implemented

- **Public Pages**:
  - Home (Hero, Stats, Summits Preview)
  - Destinations Grid (`/summits`)
  - Single Destination with Itinerary (`/summits/[slug]`)
  - Scholarship Application (`/scholarship`)
  - Media Center (`/gallery`)
  - Visa Information (`/visa-assistance`)
  - About Us (`/mission`)
- **Core Features**:
  - **Multi-step Registration Form** with Delegate/VIP packages.
  - **Visa Letter Generation Logic** (Puppeteer).
  - **Responsive Design** with mobile navigation.
  - **Database Schema** for Users, Events, Bookings, Payments.

## Database Schema

See `supabase/migrations/001_initial_schema.sql` for the full PostgeSQL structure.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Validation**: Zod + React Hook Form (Code logic implemented)
- **Backend Logic**: Supabase (ready for integration)
