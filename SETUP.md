# Setup Guide - Erasmus Map v3

This guide will help you set up and run the Erasmus Map application on your Windows system.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

Since you're on Windows with PowerShell execution policy restrictions, you can try one of these methods:

**Option A: Using npm directly (recommended)**
```bash
npm install
```

**Option B: If you encounter PowerShell issues**
```bash
# Run PowerShell as Administrator and execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run:
npm install
```

**Option C: Use Command Prompt instead of PowerShell**
Open Command Prompt (cmd.exe) and run:
```bash
npm install
```

### 2. Setup Environment Variables

Copy the example environment file:
```bash
copy .env.example .env
```

The `.env` file should contain:
```
DATABASE_URL="file:./dev.db"
```

### 3. Initialize Prisma Database

Generate Prisma Client:
```bash
npx prisma generate
```

Push the schema to the database:
```bash
npx prisma db push
```

### 4. Seed the Database

Populate the database with sample data:
```bash
npm run seed
```

You should see output like:
```
🌱 Starting seed process...
📚 Verifying university data...
✅ Found 10 Turkish universities
✅ Total departments: 22
✅ Total European partner universities: 36
```

### 5. Run the Development Server

Start the Next.js development server:
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Verification

Once running, you should be able to:

1. ✅ View the home page at `/`
2. ✅ Navigate to the Map page at `/map`
3. ✅ Navigate to the Compare page at `/compare`
4. ✅ See the Navbar and Footer on all pages

## Troubleshooting

### PowerShell Script Execution Issues

If you see: `running scripts is disabled on this system`

**Solution 1: Use Command Prompt (cmd.exe)**
- This is the easiest solution - just use cmd instead of PowerShell

**Solution 2: Change PowerShell Execution Policy**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use

If port 3000 is already in use:
```bash
# Specify a different port
npm run dev -- -p 3001
```

### Prisma Issues

If you encounter Prisma errors:
```bash
# Delete the database and start fresh
del prisma\dev.db
npx prisma db push
npm run seed
```

### Module Not Found Errors

If you see module import errors:
```bash
# Clear Next.js cache and reinstall
rmdir /s .next
del package-lock.json
rmdir /s node_modules
npm install
```

## Project Structure Overview

```
erasmus-map-v3/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── map/page.tsx       # Map page
│   └── compare/page.tsx   # Compare page
├── components/            # Reusable components
│   ├── layout/           # Navbar, Footer
│   └── ui/               # UI components (Button, Card)
├── data/                  # Static data
│   └── universities.json  # University data
├── lib/                   # Utilities
│   ├── data.ts           # Data functions
│   ├── prisma.ts         # Prisma client
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
├── prisma/               # Database
│   └── schema.prisma     # Database schema
└── scripts/              # Scripts
    └── seed.ts           # Database seeding
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database |
| `npx prisma studio` | Open Prisma Studio (Database GUI) |

## Next Steps

After successful setup:

1. **Explore the Data**: Check `data/universities.json` to see the university structure
2. **View Comments**: Run `npx prisma studio` to see seeded comments
3. **Customize**: Modify the university data to add more institutions
4. **Develop**: Start implementing the interactive map and comparison features

## Database Management

### View Database Contents
```bash
npx prisma studio
```
This opens a GUI at http://localhost:5555

### Reset Database
```bash
del prisma\dev.db
npx prisma db push
npm run seed
```

## Getting Help

- Check the main README.md for project overview
- Review the code comments for implementation details
- Check Next.js 14 documentation: https://nextjs.org/docs
- Check Prisma documentation: https://www.prisma.io/docs

## Development Tips

1. **Hot Reload**: Changes to files will automatically reload in the browser
2. **TypeScript**: Use strict typing - the project is configured for strict mode
3. **Styling**: Use Tailwind CSS classes - custom CSS should be minimal
4. **Components**: Keep components small and reusable
5. **Server vs Client**: Most components should be Server Components by default

Happy coding! 🚀

