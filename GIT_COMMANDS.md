# 🚀 Git Commands Quick Reference

## 📋 Initial Setup (First Time Only)

```bash
# Navigate to project folder
cd c:\Users\Yusuf\Desktop\Cursor\erasmus-map-v3

# Initialize git repository
git init

# Configure your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Check configuration
git config --list
```

## 📦 First Push to GitHub

```bash
# 1. Add all files
git add .

# 2. Create first commit
git commit -m "Initial commit: Erasmus Helper v1.0.0"

# 3. Add remote repository (replace with your GitHub username)
git remote add origin https://github.com/YOURUSERNAME/erasmus-helper.git

# 4. Verify remote
git remote -v

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

## 🔄 Daily Workflow

```bash
# 1. Check what changed
git status

# 2. Add specific files
git add filename.tsx
# OR add all changes
git add .

# 3. Commit with message
git commit -m "feat: add new feature"

# 4. Push to GitHub
git push
```

## 📝 Commit Message Examples

```bash
# New feature
git commit -m "feat: add university comparison feature"

# Bug fix
git commit -m "fix: resolve map marker positioning issue"

# Documentation
git commit -m "docs: update README with installation steps"

# Style changes
git commit -m "style: format code with prettier"

# Refactoring
git commit -m "refactor: optimize database queries"

# Performance
git commit -m "perf: improve map rendering speed"

# Tests
git commit -m "test: add unit tests for search function"

# Chore
git commit -m "chore: update dependencies"
```

## 🌿 Branch Management

```bash
# Create new branch
git checkout -b feature/new-feature

# List all branches
git branch

# Switch to branch
git checkout main

# Delete branch
git branch -d feature/old-feature

# Push branch to GitHub
git push -u origin feature/new-feature
```

## 🔍 Checking Status

```bash
# Check current status
git status

# View commit history
git log

# View compact history
git log --oneline

# View last 5 commits
git log -5

# View changes
git diff

# View staged changes
git diff --staged
```

## ⏪ Undoing Changes

```bash
# Undo changes in working directory
git checkout -- filename.tsx

# Unstage file (keep changes)
git reset HEAD filename.tsx

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a commit (creates new commit)
git revert commit-hash
```

## 🔄 Syncing with GitHub

```bash
# Pull latest changes
git pull

# Pull with rebase
git pull --rebase

# Fetch without merging
git fetch

# View remote branches
git branch -r
```

## 🏷️ Tags (Versions)

```bash
# Create tag
git tag v1.0.0

# Create annotated tag
git tag -a v1.0.0 -m "Version 1.0.0"

# List tags
git tag

# Push tag to GitHub
git push origin v1.0.0

# Push all tags
git push --tags

# Delete tag
git tag -d v1.0.0
```

## 🔧 Useful Commands

```bash
# View remote URL
git remote -v

# Change remote URL
git remote set-url origin https://github.com/newuser/erasmus-helper.git

# Clone repository
git clone https://github.com/username/erasmus-helper.git

# View file history
git log --follow filename.tsx

# Search commits
git log --grep="search term"

# Show specific commit
git show commit-hash

# Clean untracked files (dry run)
git clean -n

# Clean untracked files (execute)
git clean -f
```

## 🚨 Emergency Commands

```bash
# Stash changes temporarily
git stash

# List stashes
git stash list

# Apply stashed changes
git stash apply

# Apply and remove stash
git stash pop

# Discard all local changes
git reset --hard HEAD

# Abort merge
git merge --abort

# Abort rebase
git rebase --abort
```

## 📊 GitHub Specific

```bash
# Create Pull Request (use GitHub web interface)
# 1. Push your branch
git push -u origin feature/new-feature

# 2. Go to GitHub repository
# 3. Click "Compare & pull request"
# 4. Fill in details and create PR

# Update fork from original
git remote add upstream https://github.com/original/repo.git
git fetch upstream
git merge upstream/main
```

## 🎯 Common Workflows

### Feature Development
```bash
# 1. Create feature branch
git checkout -b feature/add-search

# 2. Make changes and commit
git add .
git commit -m "feat: add search functionality"

# 3. Push to GitHub
git push -u origin feature/add-search

# 4. Create Pull Request on GitHub
# 5. After merge, delete branch
git checkout main
git pull
git branch -d feature/add-search
```

### Bug Fix
```bash
# 1. Create fix branch
git checkout -b fix/map-bug

# 2. Fix and commit
git add .
git commit -m "fix: resolve map rendering issue"

# 3. Push and create PR
git push -u origin fix/map-bug
```

### Quick Update
```bash
# Update README
git add README.md
git commit -m "docs: update installation instructions"
git push
```

## 🔐 Authentication

### Personal Access Token
```bash
# When prompted for password, use Personal Access Token
# GitHub → Settings → Developer settings → Personal access tokens
# Generate new token with 'repo' scope
```

### SSH (Alternative)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub
# GitHub → Settings → SSH and GPG keys → New SSH key
# Paste contents of ~/.ssh/id_ed25519.pub

# Change remote to SSH
git remote set-url origin git@github.com:username/erasmus-helper.git
```

## 📚 Help Commands

```bash
# General help
git help

# Command-specific help
git help commit
git help push
git help branch

# Quick reference
git command --help
```

## ✅ Pre-Push Checklist

- [ ] `git status` - Check what's changed
- [ ] `git add .` - Stage all changes
- [ ] `git commit -m "message"` - Commit with clear message
- [ ] `npm run lint` - Check for errors
- [ ] `npm run build` - Ensure builds successfully
- [ ] `git push` - Push to GitHub

---

## 🎯 Quick Copy-Paste Commands

### First Time Setup
```bash
git init
git add .
git commit -m "Initial commit: Erasmus Helper v1.0.0"
git remote add origin https://github.com/YOURUSERNAME/erasmus-helper.git
git push -u origin main
```

### Regular Updates
```bash
git add .
git commit -m "your message here"
git push
```

### Check Everything
```bash
git status
git log --oneline -5
git remote -v
```

---

**💡 Tip**: Always commit with meaningful messages and push regularly!

**🚀 Ready to push to GitHub!**
