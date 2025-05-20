# Settleease

Settleease is a web application for managing user accounts, favorites, locations, and reviews, built with Node.js (Express) and MySQL, and designed to run in a Dockerized environment for easy setup and deployment.

## How to get it working
- run docker-compose -f docker-compose.db.yml up --build
- run node server.js
- Browse to https://sturdy-journey-95q4757gqp73p95x-3020.app.github.dev/login
- Create a user by using the signup option
- Login as that user using the username and password created
- You can use the app and test it as necessary

## Features
- A searchable map with categorized locations (schools, stores, worship, etc.)
- Personalized recommendations powered by AI (OpenAI GPT)
- User authentication (sign up, login, logout)
- Favorites system tied to each user
- Interactive chat assistant
- Responsive, modern UI
- User signup and login
- Manage favorites, locations, and reviews
- RESTful API endpoints
- MySQL database with phpMyAdmin for easy DB management

## Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

## Quick Start

1. **Clone the repository:**
   ```sh
   git clone https://github.com/TheMomentMan/SettleEasePlatform2
   cd SettleEasePlatform2
   ```

2. **Copy the environment file (if needed):** This should already be in the folder if cloned
   - The default `.env` is set up for Docker Compose. If you need to change DB credentials, edit `.env` accordingly.

3. **Build and start all services:**
   ```sh
   docker-compose up --build
   ```
   This will start:
   - The Node.js app (on port 8082)
   - MySQL database (on port 3306)
   - phpMyAdmin (on port 8081)

4. **Access the application:**
   - **Web app:** [http://localhost:8082]
   - Easier with the codespaces forwarded port: https://sturdy-journey-95q4757gqp73p95x-8082.app.github.dev/
   - **phpMyAdmin:** [http://localhost:8081](http://localhost:8081)
     - Server: `db`
     - Username: `settleease`
     - Password: `settleease_password`

5. **Initialize the database schema (if needed):**
   If you see errors about missing tables, import the schema:
   ```sh
   docker cp ./init.sql settleeaseplatform2-db-1:/init.sql
   docker exec -it settleeaseplatform2-db-1 bash
   mysql -u settleease -psettleease_password settleease_db < /init.sql
   exit
   ```

## 3rd Party Libraries
- **Node.js/Express**: Installed via `npm install` in the Docker build
- **MySQL**: Official Docker image
- **phpMyAdmin**: Official Docker image
- **mysql2**: Node.js MySQL client
- **bcrypt**: For password hashing
- **express-session**: For session management
- **cors**: For CORS support
- **Leaflet:** Interactive maps.
- **Font Awesome:** Icons.
- **jQuery & DataTables:** Enhanced tables and UI.
- **leaflet-color-markers:** Custom colored map markers.

All Node.js dependencies are listed in `package.json` and installed automatically during the Docker build.

## Usage
- Visit `/signup` to create a new account.
- Log in at `/login`.
- Use the sidebar to search for locations and get recommendations.
- Click the star icon to add locations to your favorites.
- Use the chat assistant for help or questions.
- Log out using the button in the top right.

## Troubleshooting
- **Port conflicts:** If you see Apache or another app on your chosen port, change the `ports` mapping in `docker-compose.yml` (e.g., use `8888:3000`).
- **Database errors:** If you see `Table 'settleease_db.users' doesn't exist`, re-import the schema as shown above.
- **Signup errors about email:** Either provide an email in the signup form, or make the `email` column nullable in MySQL.
- **App not updating:** Rebuild with `docker-compose up --build` after code changes.

## Development Notes
- All app code is in the root and `public/` directories.
- The backend is Node.js/Express
- The app service in Docker Compose uses the Node.js Dockerfile.

## License
MIT or your chosen license. 