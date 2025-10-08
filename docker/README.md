# 🐳 Receiptor Docker Testing Environment

**Bleeding-edge development stack for GUI testing**

Everything you need to see the Receiptor app in action - mobile and web!

---

## 🚀 Quick Start (5 seconds!)

```bash
npm run test:gui
```

Then open:

- **Web App:** http://localhost:3000
- **Mobile App:** http://localhost:19006

That's it! 🎉

---

## 📦 What's Included

### Complete Supabase Backend Stack (Latest Versions)

- ✨ **PostgreSQL 15.1** - Supabase-optimized database
- 🔐 **GoTrue v2.132** - Complete authentication (email, OAuth, magic links)
- 🔌 **PostgREST v11.2** - Auto-generated REST API
- ⚡ **Realtime v2.25** - WebSocket subscriptions (database changes)
- 📦 **Storage API v0.43** - File storage with transformations
- 🎨 **Supabase Studio** - Visual database editor & admin UI
- 🖼️ **ImgProxy v3.8** - On-the-fly image transformations
- 📧 **Inbucket** - Email testing server (catches all emails)
- 🌉 **Kong 2.8** - API Gateway (routes all requests)

### Receiptor Apps (Hot Reload ✅)

- 🌐 **Next.js 14** - Web app with Turbo mode & App Router
- 📱 **React Native (Expo)** - Mobile app (coming soon)
- 🔄 **Auto-reload** - Changes reflect instantly
- 🔥 **Hot Module Replacement** - No manual refreshes

---

## 🎯 Service URLs

| Service             | URL                   | Purpose                | Credentials               |
| ------------------- | --------------------- | ---------------------- | ------------------------- |
| **Web App**         | http://localhost:3000 | Next.js web interface  | Sign up to create account |
| **Supabase Studio** | http://localhost:3030 | Database admin UI      | No login required (dev)   |
| **Email Inbox**     | http://localhost:9000 | Test emails (Inbucket) | No login required         |
| **API Gateway**     | http://localhost:8000 | Supabase API endpoint  | Use anon key in app       |
| **Database**        | localhost:5432        | PostgreSQL             | postgres/postgres         |

---

## 📋 Commands

### Start & Stop

```bash
# Start everything
npm run docker:up

# Stop everything
npm run docker:down

# View logs (live)
npm run docker:logs

# Rebuild and restart
npm run docker:rebuild

# Nuclear option: delete everything
npm run docker:clean
```

### Direct Script Access

```bash
# From project root
./docker/scripts/start.sh    # Start with nice output
./docker/scripts/stop.sh     # Stop
./docker/scripts/logs.sh     # View logs
./docker/scripts/clean.sh    # Clean everything (asks for confirmation)
```

---

## 🧪 Testing Workflows

### 1. Test User Sign Up

1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill in email/password
4. Check http://localhost:9000 for confirmation email
5. Click link in email to confirm
6. You're logged in! 🎉

### 2. View Database

1. Open http://localhost:3001 (Supabase Studio)
2. Click "Table Editor"
3. See all your data in real-time

### 3. Test Hot Reload

**Web App:**

1. Edit `/web/src/app/page.tsx`
2. Save file
3. Browser auto-refreshes instantly ⚡

**Mobile App:**

1. Edit `/mobile/src/screens/DashboardScreen.tsx`
2. Save file
3. Expo reloads automatically ⚡

### 4. Test Email Flow

1. Trigger password reset in app
2. Open http://localhost:9000
3. See email appear immediately
4. Click reset link

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           Your Browser                      │
│   http://localhost:3000  (Web)              │
│   http://localhost:19006 (Mobile)           │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│     Docker Network (receiptor-network)      │
│                                              │
│  ┌──────────┐    ┌──────────┐              │
│  │   Web    │    │  Mobile  │              │
│  │ Next.js  │    │   Expo   │              │
│  └─────┬────┘    └────┬─────┘              │
│        │              │                      │
│        └──────┬───────┘                      │
│               ▼                              │
│        ┌─────────────┐                       │
│        │    Kong     │  (API Gateway)       │
│        └──────┬──────┘                       │
│               │                              │
│      ┌────────┼────────┐                    │
│      ▼        ▼        ▼                    │
│  ┌──────┐ ┌──────┐ ┌──────┐                │
│  │ Auth │ │ REST │ │Storage│               │
│  └───┬──┘ └───┬──┘ └───┬──┘                │
│      └────────┼────────┘                     │
│               ▼                              │
│         ┌──────────┐                         │
│         │PostgreSQL│                         │
│         └──────────┘                         │
└─────────────────────────────────────────────┘
```

---

## 🔑 Development Credentials

### API Keys (Already configured in env files)

**Anon Key** (public, safe for frontend):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

**Service Role Key** (secret, server-side only):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

**JWT Secret:**

```
super-secret-jwt-token-with-at-least-32-characters-long
```

### Database

```
Host: localhost
Port: 5432
Database: postgres
Username: postgres
Password: postgres
```

**Direct connection:**

```bash
docker-compose -f docker/docker-compose.yml exec postgres psql -U postgres
```

⚠️ **These are development-only credentials. Never use in production!**

---

## 🔧 Troubleshooting

### Services won't start

```bash
# Check what's using the ports
lsof -i :3000
lsof -i :8000
lsof -i :19006

# Stop conflicting services or edit docker-compose.yml ports
```

### Supabase not connecting

```bash
# Check if all services are healthy
docker-compose -f docker/docker-compose.yml ps

# Restart Supabase services
docker-compose -f docker/docker-compose.yml restart kong auth rest

# View logs
npm run docker:logs
```

### Hot reload not working

```bash
# Rebuild containers
npm run docker:rebuild

# Check if volumes are mounted
docker-compose -f docker/docker-compose.yml exec web ls -la /app/web
docker-compose -f docker/docker-compose.yml exec mobile ls -la /app/mobile
```

### "Out of memory" errors

```bash
# Increase Docker memory in Docker Desktop settings
# Recommended: 4GB minimum, 8GB ideal
```

### Start fresh

```bash
# Nuclear option: delete everything and start over
npm run docker:clean

# Then start again
npm run docker:up
```

---

## 📁 File Structure

```
docker/
├── docker-compose.yml      # Main orchestration file
├── scripts/
│   ├── start.sh           # Start with nice output
│   ├── stop.sh            # Stop all services
│   ├── logs.sh            # View logs
│   └── clean.sh           # Clean everything
├── mobile/
│   └── Dockerfile.dev     # Mobile app container
├── web/
│   └── Dockerfile.dev     # Web app container
└── supabase/
    └── kong.yml           # API Gateway config
```

---

## 🎓 Best Practices

### DO ✅

- Use `npm run docker:up` from project root
- Check logs with `npm run docker:logs`
- Access apps through browser (not containers)
- Edit code in your IDE (auto-reloads in Docker)
- Use Supabase Studio to view/edit database

### DON'T ❌

- Don't commit .env.local files with real credentials
- Don't expose Docker ports to internet
- Don't use development keys in production
- Don't run `docker-compose` without `-f docker/docker-compose.yml`
- Don't edit files inside containers (edit locally instead)

---

## 💡 Pro Tips

### Speed up builds

```bash
# Pre-pull latest images
docker-compose -f docker/docker-compose.yml pull

# Build in parallel
docker-compose -f docker/docker-compose.yml build --parallel
```

### Watch specific service

```bash
# Only web app logs
docker-compose -f docker/docker-compose.yml logs -f web

# Only Supabase auth
docker-compose -f docker/docker-compose.yml logs -f auth
```

### Restart single service

```bash
# Restart just the web app
docker-compose -f docker/docker-compose.yml restart web

# Restart just the database
docker-compose -f docker/docker-compose.yml restart postgres
```

### Run commands in containers

```bash
# Install new npm package in web app
docker-compose -f docker/docker-compose.yml exec web npm install react-icons

# Run TypeScript check
docker-compose -f docker/docker-compose.yml exec web npm run type-check

# Access database shell
docker-compose -f docker/docker-compose.yml exec postgres psql -U postgres
```

---

## 🆘 Getting Help

1. **Check logs first:** `npm run docker:logs`
2. **Check service health:** `docker-compose -f docker/docker-compose.yml ps`
3. **Try restarting:** `npm run docker:down && npm run docker:up`
4. **Still stuck?** `npm run docker:clean` and start fresh

---

## 🌟 Why This Setup Rocks

✅ **Bleeding Edge** - Always latest versions  
✅ **Hot Reload** - Instant feedback on changes  
✅ **Complete Stack** - Everything you need  
✅ **One Command** - Start with `npm run test:gui`  
✅ **Production-Like** - Tests real user experience  
✅ **Easy Cleanup** - `npm run docker:clean`  
✅ **Well Organized** - Everything in `docker/` folder

---

**Happy Testing! 🚀**

Questions? Check the main [README.md](../README.md) or open an issue.
