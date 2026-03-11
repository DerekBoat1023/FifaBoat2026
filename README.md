# FIFA 2026 Sales Hub

A real-time ticket market intelligence and portfolio management application for tracking World Cup 2026 secondary market opportunities.

## Features

- **Portfolio Overview**: Real-time summary of inventory, sales, and P&L
- **Team Path Tracker**: Filter matches by group and analyze advancement pathways
- **Venue Scout**: Filter and analyze matches by location
- **Price Hunter**: Dynamic price range filtering for market opportunities
- **CSV Integration**: Upload and merge Discovery, Inventory, and Event-by-Event data
- **Interactive Sorting**: Click column headers to sort by any field
- **Sentiment Scoring**: Track team interest levels (1-10 scale)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/DerekBoat1023/Fifa-Boat-2026.git
cd Fifa-Boat-2026
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

1. Push code to GitHub
2. Connect your repo to Vercel at [vercel.com](https://vercel.com)
3. Vercel will auto-detect it as a React app and deploy automatically
4. Your app will be live at a URL like `fifa-boat-2026.vercel.app`

## CSV Upload Format

### Discovery CSV
- Match #
- Event Name
- Price Min, Price P25, Price P50
- Ticket Qty, Visits L7D, Trans L7D

### Inventory CSV
- Match #
- Event Name
- Total Qty, Sold Qty, P&L, Unsold Cost Basis

### Event-by-Event CSV
- Match #, Sale ID
- Qty, Unit Cost, Unit Proceeds
- Marketplace, Category

## Tournament Data

- **48 Teams** across 12 groups (A-L)
- **104 Total Matches** (72 group stage + 32 knockout)
- **16 Venues** across USA, Mexico, Canada
- **3/10/2026 Market Pricing** with real inventory and sales data

## Technology Stack

- React 18
- Tailwind CSS
- PapaParse (CSV handling)
- Lucide React (Icons)
- Node.js / Vercel (Hosting)

## Support

For questions or issues, contact the FIFA Sales Hub team.
