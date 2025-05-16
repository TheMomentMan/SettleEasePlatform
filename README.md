# Settleease

Settleease is a web application designed to help newcomers find essential services, locations, and community resources in a new city. It features:
- A searchable map with categorized locations (schools, stores, worship, etc.)
- Personalized recommendations powered by AI (OpenAI GPT)
- User authentication (sign up, login, logout)
- Favorites system tied to each user
- Interactive chat assistant
- Responsive, modern UI

---

## Features

- **Interactive Map:** Find and explore locations in your city.
- **AI Recommendations:** Get personalized suggestions using OpenAI GPT.
- **User Accounts:** Sign up, log in, and manage your favorites.
- **Favorites:** Save and manage your favorite locations.
- **Chat Assistant:** Ask questions and get instant help.
- **Mobile-Friendly:** Responsive design for all devices.

---

## Installation

### 1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/settleease.git
cd settleease
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Set Up the Database**
- Make sure you have MySQL installed.
- Create a database (e.g., `settleease`).
- Run the provided `init.sql` script to create tables:
  ```bash
  mysql -u youruser -p settleease < init.sql
  ```
- Update your database credentials in `.env` or `config/database.js` as needed.

### 4. **Configure Environment Variables**
Create a `.env` file in the root directory with:
```
SESSION_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_api_key
DB_HOST=localhost
DB_USER=youruser
DB_PASSWORD=yourpassword
DB_NAME=settleease
```

### 5. **Run the Server**
```bash
npm start
```
or
```bash
node server.js
```

- The app will be available at [http://localhost:3000](http://localhost:3000)

---

## Third-Party Libraries & APIs

- **Node.js & Express:** Web server and routing.
- **MySQL2:** Database driver for MySQL.
- **express-session:** Session management.
- **bcrypt:** Password hashing.
- **OpenAI API:** For AI-powered recommendations and chat.
- **Leaflet:** Interactive maps.
- **Font Awesome:** Icons.
- **jQuery & DataTables:** Enhanced tables and UI.
- **leaflet-color-markers:** Custom colored map markers.

**All Node.js dependencies are installed via `npm install`.**
- For OpenAI, you must obtain an API key from [OpenAI](https://platform.openai.com/).
- No manual download is needed for Leaflet, Font Awesome, or marker icons—they are loaded via CDN.

---

## Usage

- Visit `/signup` to create a new account.
- Log in at `/login`.
- Use the sidebar to search for locations and get recommendations.
- Click the star icon to add locations to your favorites.
- Use the chat assistant for help or questions.
- Log out using the button in the top right.

---

## Development

- Frontend files are in `/public`.
- Backend code is in `server.js` and `/routes`.
- Database config is in `/config/database.js`.

---

## License

MIT License (or your chosen license) 