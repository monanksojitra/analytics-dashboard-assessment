# EV Analytics Dashboard | MapUp Assessment

> **Live Demo**: [https://ev-analytics-dashboard.vercel.app](https://ev-analytics-dashboard.vercel.app) _(Update with your deployment URL)_

Comprehensive analytics dashboard for analyzing 50,000+ electric vehicles in Washington State. Built with Next.js 14, TypeScript, and Supabase.

![Dashboard Preview](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=EV+Analytics+Dashboard)

---

## ✨ Features

### 📊 Interactive Visualizations

- **County Distribution**: Top 10 counties by EV count with color-coded bar charts
- **Manufacturer Market Share**: Pie chart showing distribution across top manufacturers
- **Adoption Timeline**: Year-over-year growth trends (BEV vs PHEV)
- **Electric Range Analysis**: Distribution of vehicles by range categories
- **CAFV Eligibility**: Clean Alternative Fuel Vehicle eligibility breakdown
- **Top Models**: Most popular electric vehicle models

### 🎯 Advanced Features

- **Dynamic Filtering**: Filter by county, year range, manufacturer, and EV type
- **Global Search**: Search across all vehicle data
- **Vehicle Explorer**: Sortable, paginated table with detailed vehicle information
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Efficient data fetching with SWR caching

### ⚡ Performance Optimizations

- **Code Splitting**: Lazy-loaded chart components for faster initial load
- **React.memo**: Prevents unnecessary re-renders
- **SWR Caching**: Optimized data fetching with deduplication
- **Skeleton Loaders**: Improved perceived performance
- **Error Boundaries**: Graceful error handling

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main dashboard page
│   ├── globals.css        # Global styles
│   ├── sitemap.ts         # SEO sitemap
│   ├── robots.ts          # Robots.txt
│   └── manifest.ts        # PWA manifest
├── components/
│   ├── charts/            # Chart components (lazy-loaded)
│   ├── dashboard/         # Dashboard components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   └── ui/                # UI primitives (shadcn/ui)
├── hooks/
│   └── useDashboardData.ts # Main data fetching hook
├── lib/
│   ├── queries.ts         # Supabase queries
│   ├── types.ts           # TypeScript types
│   ├── utils.ts           # Utility functions
│   ├── env.ts             # Environment validation
│   ├── logger.ts          # Logging utility
│   └── supabase/          # Supabase client
└── data-to-visualize/
    └── Electric_Vehicle_Population_Data.csv
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd analytics-dashboard-assessment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Import data to Supabase** (if not already done)

   ```bash
   npm run import-data
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run import-data` - Import CSV data to Supabase

---

## 🌐 Deployment

This project is optimized for deployment on Vercel. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

**Required Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

---

## 📊 Dataset

The dashboard analyzes the **Electric Vehicle Population** dataset from Washington State, containing:

- **50,000+ vehicle records**
- **Vehicle details**: Make, model, year, type (BEV/PHEV)
- **Location data**: County, city, postal code
- **Technical specs**: Electric range, CAFV eligibility
- **Registration info**: Model year, VIN

**Source**: [Kaggle - Electric Vehicle Population](https://www.kaggle.com/datasets/willianoliveiragibin/electric-vehicle-population)

---

## 🏗️ Architecture

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

### Key Design Decisions

- **App Router**: Leveraging Next.js 14 App Router for better performance
- **SWR**: Client-side data fetching with automatic caching and revalidation
- **Lazy Loading**: Chart components loaded on-demand to reduce initial bundle size
- **Error Boundaries**: Graceful error handling at component level
- **Theme Support**: System preference detection with manual override

---

## 🎨 Design System

Built with **shadcn/ui** components and **Tailwind CSS**:

- Consistent design tokens
- Accessible components (WCAG AA compliant)
- Dark/light mode support
- Responsive breakpoints
- Custom color palette optimized for data visualization

---

## 🧪 Testing

### Manual Testing Checklist

- [x] All charts render correctly
- [x] Filters update charts dynamically
- [x] Global search works across all data
- [x] Theme toggle switches correctly
- [x] Responsive design on mobile/tablet
- [x] Error states display properly
- [x] Loading states show skeleton screens

### Performance Targets

- **Lighthouse Performance**: 90+
- **Lighthouse Accessibility**: 95+
- **Lighthouse Best Practices**: 95+
- **Lighthouse SEO**: 100
- **Initial Load Time**: < 3 seconds
- **Bundle Size**: < 500KB (gzipped)

---

## 📄 License

This project is part of the MapUp assessment.

---

## 🙏 Acknowledgments

- **MapUp** for the assessment opportunity
- **shadcn/ui** for the beautiful component library
- **Vercel** for the hosting platform
- **Supabase** for the database solution

---

## 📧 Contact

For questions about this assessment, please contact:

- vedantp@mapup.ai
- ajayap@mapup.ai
- atharvd@mapup.ai

---

**Note**: This dashboard was built using AI and LLM tools as encouraged by the assessment guidelines. All implementation decisions were made with understanding and can be explained in detail.
