# Vidlink

**Interactive video cards platform** - Add clickable cards to your videos at specific timecodes.

## Features

- **Video Upload** - Upload videos or link from YouTube, Vimeo, Dailymotion
- **Interactive Cards** - Add cards with links that appear at specific moments
- **Vertical Video Support** - Automatic detection of portrait/landscape orientation
- **Creator Dashboard** - Track views, likes, card clicks, and engagement
- **TikTok-style Watch** - Fullscreen video experience with cards overlay

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Player
- Jotai (state management)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- AWS S3 (video storage)
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- AWS S3 bucket (for video uploads)

### Environment Variables

**Backend** (`backend/.env`):
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_region
CORS_ORIGIN=http://localhost:3001
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_BASE_URL=http://localhost:5001
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Installation

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
yarn install
yarn dev
```

### URLs
- Frontend: http://localhost:3001
- Backend: http://localhost:5001

## Project Structure

```
vidlink.it/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Auth middleware
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Helper functions
│   │   └── provider/      # Context providers
│   └── package.json
└── README.md
```

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Redirects to /watch |
| `/watch` | Random video with cards |
| `/videos` | Browse all videos |
| `/upload` | Create new video with cards |
| `/dashboard` | Creator analytics |
| `/profile` | User profile |
| `/videos/[id]` | Watch specific video |

## API Endpoints

### Videos
- `GET /express/video/getrandomvideo` - Random video for landing
- `GET /express/video/getvideo?videoId=` - Get specific video
- `POST /express/video/publish` - Publish video with cards
- `POST /express/video/storevideofile` - Upload video file to S3

### Data
- `GET /express/data/getdatacreator` - Creator dashboard stats
- `GET /express/data/getdataviewer` - Viewer stats
- `GET /express/data/getdataadmin` - Admin stats

## License

Private - All rights reserved.

---

Built with [Claude Code](https://claude.ai/claude-code)
