# 🚀 GitHub Setup Guide

Complete guide to push Erasmus Helper to GitHub.

## 📋 Prerequisites

- Git installed on your computer
- GitHub account created
- Project ready to push

## 🔧 Step-by-Step Setup

### 1. Initialize Git Repository (if not already done)

```bash
cd c:\Users\Yusuf\Desktop\Cursor\erasmus-map-v3
git init
```

### 2. Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Create Repository on GitHub

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `erasmus-helper`
4. Description: `Interactive web application for exploring Erasmus university partnerships`
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README (we already have one)
7. Click **"Create repository"**

### 4. Add Files to Git

```bash
# Check current status
git status

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Erasmus Helper v1.0.0"
```

### 5. Connect to GitHub

Replace `yourusername` with your actual GitHub username:

```bash
git remote add origin https://github.com/yourusername/erasmus-helper.git

# Verify remote
git remote -v
```

### 6. Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

### 7. Verify Upload

1. Go to your repository: `https://github.com/yourusername/erasmus-helper`
2. Check that all files are uploaded
3. Verify README.md displays correctly

## 📝 Update Repository URL in package.json

After creating the repository, update `package.json`:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/YOURUSERNAME/erasmus-helper.git"
}
```

Replace `YOURUSERNAME` with your actual GitHub username.

## 🔄 Future Updates

### Making Changes

```bash
# 1. Make your changes in code

# 2. Check what changed
git status

# 3. Add changes
git add .

# 4. Commit with message
git commit -m "feat: add new feature"

# 5. Push to GitHub
git push
```

### Common Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Pull latest changes
git pull

# View differences
git diff
```

## 🌿 Branching Strategy

### Recommended Branches

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes

### Example Workflow

```bash
# Create feature branch
git checkout -b feature/add-favorites

# Make changes and commit
git add .
git commit -m "feat: add favorites feature"

# Push feature branch
git push -u origin feature/add-favorites

# Create Pull Request on GitHub
# After review, merge to main
```

## 📦 .gitignore Checklist

Make sure these are in `.gitignore`:

- ✅ `/node_modules` - Dependencies
- ✅ `.env` - Environment variables
- ✅ `/prisma/*.db` - Database files
- ✅ `/.next` - Build files
- ✅ `.DS_Store` - OS files

## 🔐 Environment Variables

**IMPORTANT**: Never commit `.env` file!

1. `.env` is in `.gitignore` ✅
2. `.env.example` is committed ✅
3. Users copy `.env.example` to `.env`

## 📋 Repository Settings

### After Pushing to GitHub

1. **Add Topics** (Settings → Topics):
   - `erasmus`
   - `nextjs`
   - `typescript`
   - `react`
   - `prisma`
   - `leaflet`
   - `university`
   - `turkey`

2. **Add Description**:
   ```
   Interactive web application for exploring Erasmus university partnerships between Turkish and European universities
   ```

3. **Enable GitHub Pages** (Optional):
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: main

4. **Add Website** (Optional):
   - If deployed to Vercel/Netlify
   - Add deployment URL

## 🎯 Quick Commands Reference

```bash
# Initial setup (one time)
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/erasmus-helper.git
git push -u origin main

# Daily workflow
git add .
git commit -m "your message"
git push

# Check everything
git status
git log --oneline
git remote -v
```

## ⚠️ Troubleshooting

### Authentication Issues

If you get authentication errors:

1. **Use Personal Access Token**:
   - GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Use token as password when pushing

2. **Or use SSH**:
   ```bash
   git remote set-url origin git@github.com:yourusername/erasmus-helper.git
   ```

### Large Files Warning

If you get warnings about large files:

```bash
# Remove from git cache
git rm --cached path/to/large/file

# Add to .gitignore
echo "path/to/large/file" >> .gitignore

# Commit changes
git commit -m "Remove large file"
```

### Undo Last Commit

```bash
# Keep changes
git reset --soft HEAD~1

# Discard changes
git reset --hard HEAD~1
```

## 🎉 Success Checklist

- ✅ Repository created on GitHub
- ✅ All files pushed successfully
- ✅ README.md displays correctly
- ✅ .env file NOT in repository
- ✅ .gitignore working properly
- ✅ Repository description added
- ✅ Topics/tags added
- ✅ License file included

## 📞 Need Help?

- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Community](https://github.community)

---

**Happy Coding! 🚀**
