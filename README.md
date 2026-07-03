# Once Upon A Furniture — Frontend

Web client for **Once Upon A Furniture**, an online marketplace for buying and
selling used furniture. Built with React.

- **Live app:** https://furniture-frontend-weld.vercel.app
- **API:** https://furniture-backend-255g.onrender.com
- **Backend repo:** https://github.com/yingyulam/furniture_backend

## Features

- Browse, search by name, and filter by category and condition
- Category navigation and sorting (price, date)
- Google OAuth sign-in
- Post, edit, and delete listings with image upload and progress feedback
- Location autocomplete and an interactive map on each listing
- Wishlist / favorites with drag-and-drop ordering
- Editable seller profile (nickname, contact, photo)
- Resilient data loading (request auto-retry + loading states)

## Tech stack

- **Framework:** React 18, React Router 6
- **UI:** React-Bootstrap, Bootstrap
- **HTTP:** axios
- **Integrations:** Google OAuth, Google Maps + Places, Cloudinary
- **Hosting:** Vercel

## Project structure

```
furniture_frontend/
├── public/                   # Static assets, index.html, SPA redirects
├── src/
│   ├── components/            # UI components
│   │   ├── FurnitureList.js   # Home / listing grid, search, filters
│   │   ├── Furniture.js       # Listing detail page (map, seller info)
│   │   ├── UploadItem.js      # Create / edit listing + image upload
│   │   ├── MyAccount.js       # Profile, wishlist, listing history
│   │   ├── Login.js / Logout.js
│   │   ├── Map.js / Location.js
│   │   └── ...
│   ├── services/              # API layer
│   │   ├── furniture.js       # Listing endpoints
│   │   ├── favorites.js       # Favorites / profile endpoints
│   │   └── http.js            # axios config (timeout + retry)
│   ├── App.js                 # Routes and layout
│   └── index.js               # Entry point
├── vercel.json                # SPA rewrites
├── package.json
└── .env.example
```

## Getting started

### Prerequisites
- Node.js 18+
- The backend API running (see the backend repo)

### Setup
```bash
npm install
cp .env.example .env    # copy the template, then fill in your values
npm start               # http://localhost:3000
```

### Environment variables

| Variable | Description |
| --- | --- |
| `REACT_APP_API_BASE_URL` | Backend base URL (no trailing slash) |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID |
| `REACT_APP_GOOGLE_MAP_API_KEY` | Google Maps JavaScript + Places API key |
| `REACT_APP_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `REACT_APP_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset |

`.env` is gitignored — never commit real secrets.

## Deployment (Vercel)

1. Import this repository into Vercel (auto-detects Create React App).
2. Add the `REACT_APP_*` environment variables.
3. Deploy. `vercel.json` rewrites all routes to `index.html` for client-side routing.

The backend is deployed separately on Render.