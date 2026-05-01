# UFC_Apuesta_Papa

## Project Overview

UFC_Apuesta_Papa is a real-time UFC betting tracker and points management system designed for family friendly competition. The application allows Papá and Hijo to place bets on UFC fights, track their picks, and compete for points throughout fight nights.

**Purpose:** Track fight predictions and manage points in a secure, user-friendly application.

---

## Security Fixes Applied

### API Key Protection
- **Before:** API keys were exposed in frontend code
- **After:** All API keys moved to Vercel backend environment

### Environment Variables Management
- SUPABASE_URL and SUPABASE_KEY now stored securely in Vercel
- Frontend communicates only through `/api/*` routes
- No sensitive credentials exposed to client-side code

### Authentication Flow
- Request → Vercel Edge Function → Supabase → Response
- Client never directly accesses Supabase

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                       │
│              (React Components, UI State)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                    API Requests
                    /api/fights
                    /api/bets
                    /api/points
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Vercel Backend (Edge Functions)                │
│           Environment Variables Loaded Securely             │
└────────────────────────┬────────────────────────────────────┘
                         │
                  Authenticated Requests
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Supabase PostgreSQL                        │
│          (Fights, Bets, Users, Points Data)                 │
└─────────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. User interacts with frontend
2. Frontend sends request to `/api/*` endpoint
3. Backend loads environment variables securely
4. Backend queries Supabase with authenticated credentials
5. Results returned to frontend

---

## Environment Variables Setup

### Required Variables

Store these in **Vercel Project Settings → Environment Variables**:

```
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_KEY=[your-anon-key]
```

### Where to Find These

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Settings → API
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **Anon Public Key** → `SUPABASE_KEY`

### Security Note
Never commit `.env.local` or hardcoded keys to GitHub. Vercel handles environment variable encryption at rest.

---

## File Structure

```
UFC_Apuesta_Papa/
├── claude.md                    # This file
├── .env.local.example           # Example env file (no secrets)
├── .gitignore                   # Git configuration
├── package.json                 # Dependencies
├── next.config.js               # Next.js configuration
│
├── pages/
│   ├── index.js                 # Home/Dashboard
│   ├── fights.js                # Fight card display
│   ├── bets.js                  # Betting interface
│   ├── leaderboard.js           # Points leaderboard
│   └── _app.js                  # App wrapper
│
├── api/
│   ├── fights.js                # GET /api/fights
│   ├── bets.js                  # POST/GET /api/bets
│   ├── points.js                # GET /api/points
│   └── users.js                 # POST/GET /api/users
│
├── components/
│   ├── FightCard.js             # Fight display component
│   ├── BetForm.js               # Betting form
│   ├── Leaderboard.js           # Points display
│   ├── Navigation.js             # Header/Nav
│   └── Footer.js                # Footer
│
├── styles/
│   ├── globals.css              # Global styles
│   └── components.css           # Component styles
│
├── utils/
│   ├── supabase.js              # Supabase client config
│   └── helpers.js               # Utility functions
│
└── public/
    ├── favicon.ico
    └── ufc-logo.png
```

---

## How to Deploy

### Initial Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel automatically detects Next.js
   - Click Deploy

3. **Set Environment Variables in Vercel**
   - Project Settings → Environment Variables
   - Add `SUPABASE_URL` and `SUPABASE_KEY`
   - Re-deploy

### Subsequent Deployments

After the initial setup, deployments are **automatic**:

```bash
git push origin main  # Vercel auto-deploys within 1-2 minutes
```

### Manual Redeployment

If needed, you can manually trigger deployment:
- Vercel Dashboard → Select Project → Deployments → Redeploy

---

## How to Add/Update Environment Variables in Vercel

### Add New Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select **UFC_Apuesta_Papa** project
3. Settings → Environment Variables
4. Click "Add New"
5. Enter Key and Value
6. Select environments (Production, Preview, Development)
7. Save

### Update Existing Variables

1. Find the variable in Environment Variables list
2. Click the edit icon
3. Update the value
4. Save

### Deploy Changes

Variables take effect **immediately** on new deployments:
```bash
git push origin main  # Triggers redeploy with updated vars
```

Or manually redeploy from Vercel Dashboard if needed.

---

## Technical Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 13+ | React framework with API routes |
| **UI** | React | Component-based UI |
| **Styling** | CSS/Tailwind | Responsive design |
| **Backend** | Vercel Edge Functions | Serverless backend |
| **Database** | Supabase PostgreSQL | Data persistence |
| **Auth** | Supabase Auth | User authentication |
| **Hosting** | Vercel | Deployment & hosting |
| **Version Control** | GitHub | Code repository |
| **Package Manager** | npm/yarn | Dependency management |

---

## Current Status

✅ **Fully Functional & Secure**

- [x] Security fixes applied (API keys in backend)
- [x] Environment variables configured in Vercel
- [x] Frontend → Backend → Supabase integration working
- [x] User authentication functional
- [x] Fight tracking operational
- [x] Betting system live
- [x] Points calculation active
- [x] Leaderboard displaying correctly
- [x] Auto-deployment enabled
- [x] SSL/HTTPS secured

**Last Updated:** 2026-04-26  
**Production URL:** `https://ufc-apuesta-papa.vercel.app`

---

## Fighting Card

The application tracks UFC fights with the following structure:

### Active Fights (Event ID: UFC_001)

| Fight ID | Fighter 1 | Fighter 2 | Weight Class | Status |
|----------|-----------|-----------|--------------|--------|
| F001 | Fighter A | Fighter B | Heavyweight | Scheduled |
| F002 | Fighter C | Fighter D | Light Heavyweight | Scheduled |
| F003 | Fighter E | Fighter F | Middleweight | Scheduled |
| F004 | Fighter G | Fighter H | Welterweight | Scheduled |
| F005 | Fighter I | Fighter J | Lightweight | Scheduled |
| F006 | Fighter K | Fighter L | Featherweight | Scheduled |

**Database Schema:**
```sql
fights (
  id: UUID,
  event_id: STRING,
  fight_number: INT,
  fighter_1: STRING,
  fighter_2: STRING,
  weight_class: STRING,
  scheduled_time: TIMESTAMP,
  status: STRING, -- 'scheduled', 'live', 'finished'
  winner: STRING,
  created_at: TIMESTAMP
)
```

---

## Points System

### Bet Types & Points

| Bet Type | Points Reward | Criteria |
|----------|---------------|----------|
| **Correct Pick** | 10 points | Predict correct winner |
| **Method of Win** | 15 points | Predict KO/TKO/Submission/Decision |
| **Round Prediction** | 20 points | Predict correct round finish |
| **Bonus (Main Event)** | +5 points | Main event accurate bet |
| **Streak Bonus** | +5 per win | 3+ consecutive correct picks |

### Leaderboard Calculation

```
Total Points = Sum of All Correct Bets + Bonuses
Ranking = Ordered by Total Points (descending)
```

### Database Schema

```sql
points (
  id: UUID,
  user_id: UUID,
  fight_id: UUID,
  points_earned: INT,
  bet_type: STRING,
  accuracy: BOOLEAN,
  created_at: TIMESTAMP
)

leaderboard (
  user_id: UUID,
  username: STRING,
  total_points: INT,
  correct_bets: INT,
  win_percentage: DECIMAL,
  last_updated: TIMESTAMP
)
```

---

## Next Steps

### Phase 1: Enhancements (Weeks 1-2)
- [ ] Add fight notifications (Telegram/Email alerts)
- [ ] Implement real-time odds integration
- [ ] Create historical fight records view
- [ ] Add stats dashboard with charts

### Phase 2: Social Features (Weeks 3-4)
- [ ] Invite other family members
- [ ] Create private betting groups
- [ ] Add head-to-head challenges
- [ ] Implement chat/comments on fights

### Phase 3: Advanced (Month 2)
- [ ] Parlay betting (multiple fights)
- [ ] Live bet updates during fights
- [ ] Automated notifications with fight results
- [ ] Export leaderboard to PDF

### Technical Debt
- [ ] Add comprehensive unit tests
- [ ] Implement error logging (Sentry)
- [ ] Set up performance monitoring
- [ ] Add API rate limiting
- [ ] Create automated backups

---

## Quick Reference Commands

```bash
# Development
npm run dev                # Start local dev server
npm run build              # Build for production
npm run start              # Start production server

# Database
npx supabase migration new [name]  # Create new migration
npx supabase migration up          # Apply migrations

# Deployment
git push origin main       # Auto-deploy to Vercel
git push origin dev        # Preview deployment

# Environment
cat .env.local.example     # View template
# Set variables in Vercel dashboard, never in git
```

---

## Support & Troubleshooting

### Issue: Environment variables not loading
**Solution:** Re-deploy after adding variables to Vercel
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

### Issue: Supabase connection errors
**Solution:** Verify `SUPABASE_URL` and `SUPABASE_KEY` in Vercel settings

### Issue: Frontend shows errors connecting to API
**Solution:** Check Vercel function logs in Dashboard → Functions → Logs

### Getting Help
- Check Vercel documentation: https://vercel.com/docs
- Supabase docs: https://supabase.com/docs
- Next.js guide: https://nextjs.org/docs

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-26  
**Maintained By:** Development Team
