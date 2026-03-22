# 🧾 VendTrack

**Intelligent vending spend tracker** — a mobile-first web application to log, monitor, and control daily inventory micro-expenses in real time.

🌐 **Live Demo:** [vendtrack-149b7.web.app](https://vendtrack-149b7.web.app)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Custom Auth** | Phone number + 4-digit passkey login system backed by Firestore |
| ➕ **Add Spend** | Log transactions with amount, category selection (Chips, Drinks, Biscuits, Chocolates, Others), and auto-dated timestamps |
| 📊 **Dashboard** | Real-time daily & monthly spend metrics with animated progress bars and recent activity feed |
| 📜 **History** | Chronologically grouped transactions (Today / Yesterday / Older) with delete support |
| ⚙️ **Settings** | Digital identity card, inline budget limit editing, toggle notification preferences, and sign out |
| 🔄 **Real-time Sync** | All data updates instantly across tabs via Firestore `onSnapshot` listeners |
| 🚨 **Over-budget Alerts** | Visual warnings when monthly spending exceeds configured limits |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Firebase](https://firebase.google.com/) (Firestore, Hosting)
- **Icons:** [Material Symbols](https://fonts.google.com/icons)
- **Fonts:** Google Sans / DM Sans
- **Design:** Vendi Minimal theme (warm orange palette, glassmorphic navbars)

---

## 📁 Project Structure

```
vendtrack/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with AuthProvider
│   │   ├── page.tsx            # Dashboard (real-time metrics)
│   │   ├── add/page.tsx        # Add Spend form
│   │   ├── history/page.tsx    # Transaction history
│   │   ├── settings/page.tsx   # Profile, limits, preferences
│   │   ├── login/page.tsx      # Login page
│   │   ├── signup/page.tsx     # Registration page
│   │   └── globals.css         # Design tokens & Tailwind config
│   ├── components/
│   │   └── layout/
│   │       ├── TopNavBar.tsx    # Glassmorphic header
│   │       └── BottomNavBar.tsx # Mobile tab bar
│   ├── context/
│   │   └── AuthContext.tsx      # Auth state management
│   └── lib/
│       └── firebase/
│           └── config.ts        # Firebase initialization
├── firebase.json                # Firebase Hosting config
├── firestore.rules              # Security rules
├── firestore.indexes.json       # Composite indexes
└── package.json
```

---

## 🗄️ Firestore Data Model

### `users` Collection
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Full name |
| `phone` | string | Phone number (Document ID) |
| `cardLast4` | string | Last 4 digits of card |
| `passkey` | string | 4-digit authentication passkey |
| `dailyLimit` | number | Daily spend limit (₹) |
| `monthlyLimit` | number | Monthly spend limit (₹) |
| `createdAt` | timestamp | Account creation date |

### `transactions` Collection
| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Phone number of the user |
| `amount` | number | Transaction amount (₹) |
| `category` | string | chips, drinks, biscuits, chocolates, others |
| `timestamp` | timestamp | Transaction date/time |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- Firebase CLI (`npm i -g firebase-tools`)

### Installation

```bash
# Clone the repository
git clone https://github.com/dhyanivj/vendtrack.git
cd vendtrack

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Cloud Firestore**
3. Update `src/lib/firebase/config.ts` with your Firebase config
4. Deploy Firestore rules and indexes:

```bash
firebase login
firebase use --add  # Select your project
firebase deploy --only firestore
```

### Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

---

## 📱 Screenshots

### Authentication Flow
Split-screen login with vibrant orange gradient header and clean white card form.

### Dashboard
Real-time daily/monthly spending metrics with animated progress bars and recent activity feed.

### Add Spend
Large numeric input, bento-grid category selector, and auto-dated transaction logging.

### History
Chronologically organized transaction feed with delete-on-hover and over-budget warnings.

### Settings
Digital identity card, inline budget editing, notification toggles, and secure sign out.

---

## 🎨 Design System

The app uses a custom **Vendi Minimal** design language:

- **Primary:** `#a73a00` (Deep Orange)
- **Primary Container:** `#ff5c00` (Bright Orange)
- **Surface:** `#fffbf5` (Warm White)
- **Typography:** Google Sans / DM Sans
- **Layout:** Mobile-first, max-width centered container
- **Effects:** Glassmorphic header/footer with `backdrop-blur-xl`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js and Firebase.
