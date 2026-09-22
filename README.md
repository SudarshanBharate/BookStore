# 📚 BookStore — Responsive eCommerce Frontend

A fully responsive eCommerce bookstore built with **React 18**, **Tailwind CSS 3**, and **React Router v6**. Supports dark/light theme, persistent cart, protected routes, and a complete 8-screen purchase flow.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Build Tool | Vite 5 |
| Database | PostgreSQL *(backend)* |
| API | OpenAPI Spec (IBM Bob–generated) |
| AI IDE | IBM Bob / AWS Kiro |
| Testing | ICA Agent (React Test Case Generator) |
| Version Control | GitHub (feature branch + Pull Request) |

---

## Features

- 🌗 **Dark / Light theme** — auto-detects system preference, persisted to `localStorage`
- 🛒 **Persistent cart** — survives page refresh via `localStorage`
- 🔐 **Protected routes** — Checkout, Payment, and Order Confirmation require sign-in
- 🔍 **URL-driven catalogue** — category, search, and sort are query-param–based (shareable/bookmarkable)
- 📱 **Fully responsive** — mobile-first layout with hamburger menu
- ♿ **Accessible** — semantic HTML, ARIA labels, focus rings on all interactive elements

---

## Screens

| # | Route | Description |
|---|---|---|
| 1 | `/login` | Email + password sign-in with client-side validation |
| 2 | `/` | Landing page — hero, featured books, genre chips, new arrivals |
| 3 | `/catalogue` | Browse & filter by category, sort, grid/list toggle |
| 4 | `/books/:id` | Book detail — cover, rating, qty stepper, add to cart / buy now |
| 5 | `/cart` | Cart summary with quantity stepper and order total |
| 6 | `/checkout` | Delivery address selection (saved + new address form) |
| 7 | `/payment` | Card / PayPal / Apple Pay with masked input formatting |
| 8 | `/order-confirmation` | Order number, delivery timeline, next steps |

---

## Reusable Components

| Component | Location | Description |
|---|---|---|
| `Navbar` | `src/components/Navbar.jsx` | Sticky header, search, cart badge, theme toggle, mobile menu |
| `Footer` | `src/components/Footer.jsx` | Three-column link grid |
| `Button` | `src/components/Button.jsx` | Polymorphic — primary / secondary / ghost / danger, sm/md/lg, loading state |
| `BookCard` | `src/components/BookCard.jsx` | Grid and list view, star rating, discount badge, add-to-cart |
| `CartItem` | `src/components/CartItem.jsx` | Quantity stepper, line total, remove action |

---

## Project Structure

```
bookstore/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                   # React root
    ├── App.jsx                    # Router + context providers
    ├── index.css                  # Tailwind layers + utility classes
    ├── context/
    │   └── AppContext.jsx         # CartContext, ThemeContext, AuthContext
    ├── data/
    │   └── books.js               # Mock book data (replace with API)
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── Button.jsx
    │   ├── BookCard.jsx
    │   └── CartItem.jsx
    └── pages/
        ├── LoginPage.jsx
        ├── HomePage.jsx
        ├── CataloguePage.jsx
        ├── BookDetailPage.jsx
        ├── CartPage.jsx
        ├── CheckoutPage.jsx
        ├── PaymentPage.jsx
        └── OrderConfirmationPage.jsx
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Clone the repo
git clone <your-repo-url>
cd bookstore

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://127.0.0.1:5173
```

### Build for Production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

---

## Demo Login

The frontend ships with a mock auth context. Use **any** syntactically valid email and a password of **8+ characters** to sign in.

```
Email:    you@example.com
Password: password123
```

> Replace the `setTimeout` mock in `src/pages/LoginPage.jsx` with your real OpenAPI authentication call when the backend is connected.

---

## Connecting the Backend

1. **Auth** — swap the mock `login()` call in [`LoginPage.jsx`](src/pages/LoginPage.jsx) with a `POST /auth/login` request.
2. **Books** — replace the static `src/data/books.js` import in each page with `GET /books` and `GET /books/:id` API calls.
3. **Cart** — replace `localStorage` persistence in `AppContext.jsx` with `POST /cart` sync if a server-side cart is needed.
4. **Orders** — wire `PaymentPage.jsx` to `POST /orders` and redirect on success.

---

## Environment Variables

Create a `.env.local` file at the project root (never committed — already in `.gitignore`):

```env
VITE_API_BASE_URL=https://your-backend-api.example.com
```

Access it in code via `import.meta.env.VITE_API_BASE_URL`.

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m "feat: describe your change"`
3. Push and open a Pull Request against `main`

---

## License

MIT
