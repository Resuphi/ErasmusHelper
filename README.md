# Erasmus Helper 🎓

An interactive web application that helps students explore Erasmus agreements between Turkish and European universities. Built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-5-2d3748)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

- **🏠 Home Page**: Search and filter universities with advanced options
- **🗺️ Interactive Map**: Visualize all partnerships on one comprehensive map
- **🎓 University Details**: Detailed pages with maps and partnership information
- **💬 Comment System**: Share Erasmus experiences with validation
- **🔄 Comparison Tool**: Compare up to 3 universities side-by-side
- **📱 Responsive Design**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with shadcn/ui patterns
- **Database**: SQLite with Prisma ORM
- **Map**: React Leaflet + OpenStreetMap
- **Validation**: Zod
- **Icons**: Lucide React

## 📦 Installation

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
# .env file is already configured for SQLite

# 3. Initialize database
npx prisma generate
npx prisma db push

# 4. Seed sample data
npm run seed

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Alternative (Windows PowerShell Issues)

If you encounter PowerShell execution policy errors, use Command Prompt (cmd.exe):

```cmd
cmd
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

## 📁 Project Structure

```
erasmus-map-v3/
├── app/                      # Next.js App Router
│   ├── actions/             # Server actions
│   ├── compare/             # Comparison page
│   ├── map/                 # Interactive map page
│   ├── university/[id]/     # Dynamic university pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── comments/           # Comment system
│   ├── compare/            # Comparison components
│   ├── home/               # Home page components
│   ├── layout/             # Navbar & Footer
│   ├── map/                # Map components
│   └── ui/                 # UI primitives
├── data/                    # Static data
│   └── universities.json   # University database
├── lib/                     # Utilities
│   ├── validations/        # Zod schemas
│   ├── data.ts            # Data functions
│   ├── prisma.ts          # Prisma client
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Helpers
├── prisma/                 # Database
│   └── schema.prisma      # DB schema
└── scripts/               # Utility scripts
    └── seed.ts            # Database seeding
```

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with sample data |
| `npx prisma studio` | Open database GUI (port 5555) |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Push schema to database |

## 📊 Data Overview

### Universities: 5 Turkish Institutions
1. **Ondokuz Mayıs University** - Samsun (54 partners)
2. **Anadolu University** - Eskişehir (149 partners)
3. **Istanbul University** - Istanbul (268 partners)
4. **Atatürk University** - Erzurum (118 partners)
5. **Fırat University** - Elazığ (94 partners)

### Partnerships:
- **683 European Partner Universities**
- **50+ Academic Departments**
- **20+ Partner Countries**: Austria, Belgium, Bulgaria, Croatia, Czechia, Denmark, Estonia, Finland, France, Germany, Greece, Holland, Hungary, Italy, Latvia, Lithuania, Norway, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden, Switzerland

## 🎯 Main Features

### 1. Home Page (/)
- **Search**: Find universities by name or city
- **Filter**: By department or partner country
- **Statistics**: Real-time dashboard
- **University Cards**: Responsive grid with details
- **Navigation**: Direct links to university pages

### 2. Interactive Map (/map)
- **All Universities**: View all 5 Turkish universities and 683 European partners
- **Connection Lines**: Visualize partnerships
- **Filters**:
  - Focus on specific university
  - Filter by city
  - Toggle connection lines
- **Interactive Markers**: Click to zoom and view details
- **Real-time Statistics**: Updates based on filters
- **Legend & Instructions**: Clear visual guides

### 3. University Detail (/university/[id])
- **Split Layout**: Details on left, map on right
- **Partnership Overview**: Statistics and metrics
- **Interactive Map**: Specific to that university
- **Departments & Partners**: Detailed breakdown
- **Comments**: User reviews with validation
- **Submit Comments**: Zod-validated form

### 4. Comparison Tool (/compare)
- **Select Universities**: Up to 3 at once
- **Side-by-side Table**: Compare metrics
- **Metrics**:
  - Total partner universities
  - Number of departments
  - Partner countries
  - Available departments
- **Quick Links**: Navigate to detail pages

### 5. Comment System
- **Validation**: Zod schema with Turkish character support
- **Database**: Persistent storage with Prisma
- **Server Actions**: Type-safe form submissions
- **Display**: User avatars, formatted dates
- **Real-time**: Page revalidation after submission

## 🎨 Design Features

### Color Scheme
- **Primary**: Blue (#3b82f6)
- **Turkish Universities**: Red markers
- **Partner Universities**: Blue markers
- **Selected**: Green markers
- **Connections**: Dashed lines

### Typography
- **Font**: Inter (Google Fonts)
- **Clear Hierarchy**: h1-h4 with proper sizing
- **Readable**: Optimal line height and spacing

### Components
- **shadcn/ui patterns**: Consistent design system
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Professional iconography
- **Responsive**: Mobile-first approach

## 📱 Responsive Breakpoints

```css
Mobile:   < 768px  (1 column)
Tablet:   768-1024px (2 columns)
Desktop:  > 1024px (3 columns)
```

## 🔐 Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="file:./dev.db"
```

## 🗄️ Database Schema

```prisma
model Comment {
  id           String   @id @default(cuid())
  universityId String
  name         String
  surname      String
  email        String
  content      String
  createdAt    DateTime @default(now())

  @@index([universityId])
}
```

## 🧪 Testing

### Manual Testing
1. **Home Page**:
   - Search for "Istanbul" → See 4 universities
   - Filter by "Computer Engineering"
   - Click "View Agreements"

2. **Map Page**:
   - View all universities and partners
   - Select specific university
   - Toggle connection lines
   - Click markers to zoom

3. **University Detail**:
   - See split layout (desktop)
   - Click map markers
   - Submit a comment
   - View all comments

4. **Comparison**:
   - Select 3 universities
   - Compare metrics
   - Navigate to details

### Database Verification
```bash
npx prisma studio
# Open http://localhost:5555
# Check Comment table
```

## 🚧 Troubleshooting

### PowerShell Execution Error
**Solution**: Use Command Prompt (cmd.exe) instead

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### Prisma Errors
```bash
del prisma\dev.db
npx prisma db push
npm run seed
```

### Map Not Loading
- Verify Leaflet CSS is imported
- Check browser console for errors
- Ensure dynamic import has `ssr: false`

## 📚 Documentation

Comprehensive documentation available:
- `SETUP.md` - Detailed setup guide
- `QUICKSTART.md` - Quick reference
- `COMPLETE_GUIDE.md` - Full testing guide
- `FEATURE_HOME_PAGE.md` - Home page features
- `FINAL_FEATURES.md` - Advanced features
- `MAP_PAGE_IMPLEMENTATION.md` - Map page guide
- `IMPLEMENTATION_SUMMARY.md` - Complete summary

## 🎓 Learning Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [React Leaflet](https://react-leaflet.js.org/)
- [Prisma](https://www.prisma.io/docs)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## ✨ Key Technologies

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS 3
- React Leaflet
- Lucide React

### Backend
- Next.js Server Actions
- Prisma ORM
- SQLite Database
- Zod Validation

### Map
- Leaflet
- OpenStreetMap (free tiles)
- Custom colored markers
- Polyline connections

## 🎯 Best Practices

- ✅ **Type Safety**: Full TypeScript, no `any` types
- ✅ **Validation**: Zod schemas for all forms
- ✅ **Server Components**: Default for data fetching
- ✅ **Client Components**: Only where needed
- ✅ **Responsive**: Mobile-first design
- ✅ **Accessibility**: ARIA labels, semantic HTML
- ✅ **SEO**: Metadata, static generation
- ✅ **Performance**: Dynamic imports, memoization

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- University data for demonstration purposes
- Map tiles by OpenStreetMap contributors
- Icons by Lucide
- UI patterns inspired by shadcn/ui

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

## 🎉 Quick Links

- **Live Demo**: Run `npm run dev` after installation
- **Database GUI**: `npx prisma studio`
- **Seed Data**: `npm run seed`
- **Documentation**: See `/docs` or markdown files in root

---

**Built with ❤️ using Next.js 14, TypeScript, and React Leaflet**

*Version: 3.0.0*  
*Last Updated: December 6, 2025*  
*Status: Production Ready* 🚀
