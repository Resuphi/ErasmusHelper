# 🚀 Erasmus Map - Quick Start Guide

## ⚡ Installation (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database
```bash
npx prisma generate
npx prisma db push
```

### Step 3: Seed Sample Data
```bash
npm run seed
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
```
http://localhost:3000
```

---

## 🎯 What You Can Do Right Now

### Home Page (/)
✅ **Search**: Type university name or city
✅ **Filter by Department**: Select from 22+ departments
✅ **Filter by Country**: Select from 13 European countries
✅ **Browse**: View 10 Turkish universities in responsive grid
✅ **Statistics**: See totals for universities, departments, partners

### University Detail (/university/[id])
✅ **View Details**: Click "View Agreements" on any card
✅ **See Partners**: Browse all partner universities by department
✅ **Statistics**: View partnership overview
✅ **Navigate**: Use back button to return home

---

## 📊 Sample Data Included

### Universities (10)
- METU (Ankara)
- Boğaziçi (Istanbul)
- ITU (Istanbul)
- Bilkent (Ankara)
- Sabancı (Istanbul)
- Koç (Istanbul)
- Hacettepe (Ankara)
- Ege (Izmir)
- Gazi (Ankara)
- Ankara University (Ankara)

### Departments (22)
Computer Engineering, Business, Architecture, Medicine, Law, Pharmacy, Agriculture, Education, and more...

### Partner Countries (13)
Germany, Netherlands, France, UK, Sweden, Italy, Denmark, Switzerland, Norway, Spain, Finland, Austria, Czech Republic

---

## 🔍 Quick Tests

### Test 1: Search
1. Type "Istanbul" in search box
2. Should see 4 universities (Boğaziçi, ITU, Sabancı, Koç)

### Test 2: Filter by Department
1. Select "Department" from filter dropdown
2. Choose "Computer Engineering"
3. Should see METU

### Test 3: Filter by Country
1. Select "Country" from filter dropdown
2. Choose "Germany"
3. Should see universities with German partners

### Test 4: View Details
1. Click "View Agreements" on any card
2. Should navigate to detail page
3. See all departments and partners

### Test 5: Navigation
1. On detail page, click "Back to Universities"
2. Should return to home page

---

## 📁 Key Files

### Pages
- `app/page.tsx` - Home page with search/filter
- `app/university/[id]/page.tsx` - University details
- `app/map/page.tsx` - Map page (placeholder)
- `app/compare/page.tsx` - Compare page (placeholder)

### Components
- `components/home/SearchFilter.tsx` - Search and filter UI
- `components/home/UniversityCard.tsx` - University card
- `components/home/UniversityList.tsx` - List with filtering
- `components/layout/Navbar.tsx` - Navigation bar
- `components/layout/Footer.tsx` - Footer

### Data
- `data/universities.json` - All university data
- `lib/data.ts` - Data utility functions
- `lib/types.ts` - TypeScript interfaces

### Database
- `prisma/schema.prisma` - Database schema
- `scripts/seed.ts` - Seed script

---

## 🛠️ Troubleshooting

### Issue: npm command not working
**Solution**: Use Command Prompt (cmd.exe) instead of PowerShell

### Issue: Port 3000 already in use
**Solution**: 
```bash
npm run dev -- -p 3001
```

### Issue: Prisma errors
**Solution**: 
```bash
del prisma\dev.db
npx prisma db push
npm run seed
```

### Issue: TypeScript errors
**Solution**: 
```bash
npm install
npx prisma generate
```

---

## 📱 Responsive Design

✅ **Mobile** (< 768px): 1 column grid
✅ **Tablet** (768-1024px): 2 column grid
✅ **Desktop** (> 1024px): 3 column grid

---

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: SQLite + Prisma
- **Map**: React Leaflet (to be implemented)

---

## ✅ What's Working

✅ Search by name/city
✅ Filter by department
✅ Filter by country
✅ University cards with stats
✅ Dynamic routing
✅ Responsive design
✅ TypeScript type safety
✅ SEO optimization
✅ Error handling (404)
✅ Navigation

---

## 🚧 Coming Next

⏳ Interactive Leaflet map
⏳ Comment system
⏳ User reviews
⏳ Comparison tool
⏳ Advanced filters

---

## 📚 Documentation

- `README.md` - Project overview
- `SETUP.md` - Detailed setup instructions
- `FEATURE_HOME_PAGE.md` - Feature documentation
- `IMPLEMENTATION_COMPLETE.md` - Complete implementation details
- `PROJECT_STATUS.md` - Current project status

---

## 💡 Tips

1. **Performance**: Data is fetched server-side, filtering is client-side
2. **SEO**: Each university page has custom metadata
3. **Type Safety**: No `any` types used - full TypeScript
4. **Accessibility**: Semantic HTML and ARIA labels
5. **Responsive**: Mobile-first design approach

---

## 🎯 Example Usage

```typescript
// Search for a university
1. Open home page
2. Type "Boğaziçi" in search
3. See results instantly

// Filter by department
1. Select "Department" filter
2. Choose "Business Administration"
3. See universities offering business programs

// View details
1. Click "View Agreements" on any card
2. See all partner universities
3. Browse by department
```

---

## 🔗 Navigation Structure

```
Home (/)
  └── University Grid
      └── Click "View Agreements"
          └── University Detail (/university/[id])
              └── Back to Home

Navbar
  ├── Home (/)
  ├── Map (/map) - placeholder
  └── Compare (/compare) - placeholder
```

---

## 🎉 You're Ready!

Run `npm run dev` and start exploring the Erasmus Map!

For detailed information, see the full documentation files.

**Happy coding! 🚀**

