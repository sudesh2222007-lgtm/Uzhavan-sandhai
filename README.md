# 🌾 உழவன் சந்தை (Uzhavan Sandhai)

A full-stack marketplace connecting local farmers directly with customers — no middlemen.

Stack: **React + Vite + Tailwind** (frontend) · **Node.js + Express + MongoDB/Mongoose** (backend) · **JWT + Phone OTP** auth.

---

## 0. What's real vs. what's stubbed (please read first)

Everything below is fully working end-to-end: registration/login, farmer product CRUD, browsing/search/filters, placing & managing orders, geolocation-based "nearby farmers," favourites, reviews, admin approval workflow, and the Farmer/Customer info hubs.

A few pieces need a paid third-party API key to go fully live, so they're implemented as clearly-labelled stand-ins you can swap in later without changing the surrounding code:

| Feature | Current behaviour | To go live |
|---|---|---|
| OTP SMS | **Live**: sends a real SMS to the buyer's phone via Fast2SMS's free `otp` route. Falls back to printing in the **backend terminal** only if `FAST2SMS_API_KEY` isn't set | Sign up free at [fast2sms.com](https://www.fast2sms.com), paste your key into `backend/.env` as `FAST2SMS_API_KEY`, set `OTP_DEV_MODE=false` |
| Weather | Returns a labelled mock forecast (`isMock: true`) | Add an OpenWeatherMap (or similar) key and edit `backend/controllers/infoController.js` |
| Product images | Saved to local disk, served from `/uploads` | Swap `backend/middleware/uploadMiddleware.js` for a Cloudinary storage engine |
| "Get Directions" | Deep-links out to Google Maps (free, no key needed) | Optional: add `GOOGLE_MAPS_API_KEY` for an embedded map |
| Nearby-farmer distance | Calculated locally with the Haversine formula (free, no key) | — no change needed, this avoids paid Distance Matrix calls entirely |
| Voice search (Tamil), AI price suggestions, UPI payment gateway, push notifications, PWA | Not wired up | These need dedicated third-party SDKs/gateways; the data model (e.g. `paymentMethod: "upi"`, `MarketPrice` collection) already has the fields ready for you to build on |

---

## 1. Prerequisites

- **Node.js** v18+ and npm — [nodejs.org](https://nodejs.org)
- **MongoDB Community Server** running locally, and **MongoDB Compass** to view it — [mongodb.com/try/download](https://www.mongodb.com/try/download/community)
  - After installing, MongoDB usually runs automatically on `mongodb://127.0.0.1:27017`
  - Open Compass and connect to that same URI just to confirm it's running — you don't need to create anything manually, the app creates its own database and collections on first run.

---

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and check/edit:

```
MONGO_URI=mongodb://127.0.0.1:27017/uzhavan_sandhai   # matches your local MongoDB
JWT_SECRET=replace_this_with_a_long_random_secret_key   # change this to any random string
```

Start the server:

```bash
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: 127.0.0.1
```

Visit `http://localhost:5000/api/health` in your browser — you should see a JSON success message.

### Load demo content (optional but recommended)
Populates market prices, agriculture news, and a government scheme so the Farmer Information Center isn't empty:
```bash
npm run seed
```

### Create an admin account (optional)
The public Register page only offers Farmer/Customer. To get an Admin login:
```bash
npm run create-admin -- "Admin Name" 9876543210
```
Then log in normally from the website with that phone number (OTP will print in this same terminal, unless you've set up real SMS below).

### Send real OTP SMS to the buyer's phone (free)
By default OTPs just print to this terminal so you can test with zero setup. To actually deliver them by SMS:
1. Sign up free at **[fast2sms.com](https://www.fast2sms.com)** (free credits on signup; works for Indian 10-digit numbers).
2. In the dashboard, go to **Dev API** and copy your API key.
3. In `backend/.env`, set:
   ```
   FAST2SMS_API_KEY=your_key_here
   OTP_DEV_MODE=false
   ```
4. Restart the backend. OTPs will now arrive as a real SMS on the buyer's phone; if the gateway ever fails (e.g. no balance), it automatically falls back to printing in this terminal so testing never breaks.

---

## 3. Frontend setup

Open a **second terminal** (keep the backend running in the first):

```bash
cd frontend
npm install
npm run dev
```

Open the URL it prints — usually **http://localhost:5173**

The frontend is pre-configured (`vite.config.js`) to proxy `/api` and `/uploads` requests to `http://localhost:5000`, so no extra config is needed for local development.

---

## 4. Try it out

1. Go to `http://localhost:5173` → **Register** → choose **Farmer**, fill in name/phone/village, tap **📍 Detect My Location** (allow the browser location permission), send OTP.
2. Check your **backend terminal** for the `[DEV OTP] Phone: ... Code: ...` line and enter that 4-digit code.
3. You're now on the Farmer Dashboard → **புதிய பொருள்** tab → add a product with a harvest date, photos, price, and delivery options.
4. Open an incognito window (or log out), register a **Customer** account the same way.
5. Browse **பொருட்கள்**, filter by distance/category, open a product, place an order.
6. Switch back to the farmer account → **ஆர்டர் விசாரணைகள்** tab → accept or reject the order.
7. Log in as **Admin** (see step 2) to approve farmers and view analytics at `/admin`.

---

## 5. Project structure

```
uzhavan-sandhai/
├── backend/
│   ├── config/db.js               MongoDB connection
│   ├── models/                    User, Product, Order, Review, Notification,
│   │                               Otp, MarketPrice, AgricultureNews, GovernmentScheme
│   ├── controllers/                business logic per resource
│   ├── routes/                     Express routers, mounted in server.js
│   ├── middleware/                 auth (JWT), error handling, image upload
│   ├── utils/                      token/OTP/distance helpers + seed & create-admin scripts
│   ├── uploads/                    product images (served statically)
│   └── server.js                   app entrypoint
└── frontend/
    └── src/
        ├── api/axios.js            pre-configured axios instance (adds JWT header)
        ├── context/AuthContext.jsx global auth state
        ├── hooks/useGeolocation.js browser GPS wrapper
        ├── components/             Navbar, Footer, ProductCard, FarmerCard, InfoCard, ProtectedRoute
        └── pages/                  Home, Login, Register, Products, ProductDetails,
                                     NearbyFarmers, FarmerProfile, FarmerDashboard,
                                     FarmerInfoCenter, CustomerInfo, CustomerOrders,
                                     Favourites, AdminPanel
```

---

## 6. Key API endpoints (for reference)

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/send-otp` | Request an OTP for a phone number |
| POST | `/api/auth/register` | Register (name, phone, otp, role, location) |
| POST | `/api/auth/login` | Login (phone, otp) |
| GET | `/api/products?search=&category=&lat=&lng=&radiusKm=` | Browse/filter products |
| POST | `/api/products` | Create product (farmer, multipart form with `images`) |
| GET | `/api/products/nearby-farmers?lat=&lng=&radiusKm=` | Nearby farmers |
| POST | `/api/orders` | Place an order (customer) |
| PATCH | `/api/orders/:id/respond` | Accept/reject order (farmer) |
| GET | `/api/info/market-prices` / `/news` / `/schemes` / `/weather` | Info Center content |
| GET | `/api/admin/analytics` | Admin dashboard stats |

Full route list is in `backend/routes/`.

---

## 7. Deployment notes

- Set `NODE_ENV=production` and a strong `JWT_SECRET` in production.
- Point `MONGO_URI` at a MongoDB Atlas cluster instead of localhost.
- Build the frontend with `npm run build` (outputs to `frontend/dist`) and serve it from any static host (Vercel, Netlify) or from Express itself.
- Set `VITE_API_URL` in the frontend's `.env` to your deployed backend URL if frontend and backend are hosted separately (CORS is already enabled on the backend).
- Swap local `/uploads` storage for Cloudinary before deploying anywhere without persistent disk (e.g. most serverless hosts).

---

## 8. Troubleshooting

- **"MongoDB connection error"** → make sure MongoDB is running locally, or that `MONGO_URI` points to a reachable database.
- **OTP never arrives on the phone** → check `backend/.env`: if `FAST2SMS_API_KEY` is empty or `OTP_DEV_MODE=true`, the OTP only prints to the **backend terminal** (dev mode). Add a free Fast2SMS key and set `OTP_DEV_MODE=false` to actually send SMS — see section 0 above.
- **Fast2SMS OTP request fails / no balance** → check the backend terminal for a `[Fast2SMS] OTP send failed: ...` line with the gateway's reason; it automatically falls back to printing the OTP so you're never locked out while debugging.
- **Location permission denied** → the browser needs HTTPS or `localhost` to allow geolocation; `localhost:5173` works fine for local dev.
- **CORS errors in production** → confirm the frontend's `VITE_API_URL` matches your deployed backend's actual URL.
