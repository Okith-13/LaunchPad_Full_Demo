# Food Delivery Management System

A full-stack food delivery application built with React, Vite, Node.js, Express, MySQL and Docker Compose. The frontend communicates with five backend services, which share a MySQL database.

---

## Architecture

| Service | Default host port | Responsibility |
| --- | ---: | --- |
| Auth Service | `5001` | Registration, login, token refresh and user deletion |
| Restaurant Service | `5002` | Restaurant and menu management |
| Order Service | `5003` | Order creation, retrieval and status updates |
| Delivery Service | `5004` | Delivery creation, rider assignment and delivery status |
| Customer Service | `5005` | Customer profiles and delivery addresses |
| React Frontend | `3000` | Customer, restaurant-admin and delivery-person web application |
| MySQL | `3307` (container port `3306`) | Shared database, initialized from `init.sql` |

The host ports can be changed in the root `.env` file. Inside Docker, the backend services use their container ports (`5001`–`5005`) and connect to MySQL using the Compose service name `app-db`. The frontend is served on port `3000`.

---

## Project Structure

```text
LaunchPad_Assignment/
├── Service/
│   ├── authService/             # Authentication, registration and user management
│   ├── restaurantService/       # Restaurants and menu items
│   ├── orderService/            # Orders and order status
│   ├── deliveryService/         # Deliveries and rider assignments
│   └── customerService/         # Customer profiles and addresses
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Reusable buttons, panels, fields and status UI
│   │   │   └── layout/          # Application shell, navigation and footer
│   │   ├── context/             # Authentication and cart state
│   │   ├── pages/
│   │   │   ├── auth/            # Login and registration
│   │   │   ├── customer/        # Restaurant browsing, cart, orders and profile
│   │   │   ├── restaurant/      # Restaurant profile, menu and incoming orders
│   │   │   └── delivery/        # Delivery-person assignments
│   │   ├── routes/              # Role-protected route handling
│   │   ├── services/            # API client and backend service calls
│   │   ├── utils/               # Formatting and validation helpers
│   │   ├── App.jsx              # Route definitions
│   │   ├── index.css            # Tailwind CSS entry point
│   │   └── main.jsx             # React application entry point
│   ├── .env.example             # Frontend API URL configuration
│   ├── Dockerfile               # Vite build and Nginx runtime image
│   ├── nginx.conf               # Static hosting and SPA routing
│   ├── package.json
│   └── vite.config.js
├── Evidence Screenshot/
│   ├── API Screenshots/
│   ├── Docker Screenshots/
│   └── Project Root Folder.jpeg
├── docker-compose.yml
├── init.sql
├── .env.example
└── README.md
```

Each backend service contains its own routes, controllers, middleware, repositories, services, database configuration and supporting code. The frontend uses React Router for navigation, context providers for authentication and cart state, and service modules to call the backend APIs.

---

## Prerequisites

- Docker Desktop with Docker Compose
- Postman, `curl` or another API client for endpoint testing
- Node.js 20 or later and npm, if running the frontend or a service outside Docker

---

## Setup and Run

1. Create a root `.env` file from the supplied template:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Set `DB_PASSWORD` and replace the JWT secret placeholders in `.env` with your own values. The same `DB_PASSWORD` is used for the MySQL root password and by the services to connect to the database.

3. Build and start the containers from the project root:

   ```powershell
   docker compose up --build -d
   ```

4. Check container status:

   ```powershell
   docker compose ps
   ```

   Compose starts seven containers: MySQL, five backend services and the frontend. MySQL has a health check; the backend services wait for it to become healthy before starting. Open the frontend at [http://localhost:3000](http://localhost:3000).

### Run the frontend locally

To run the Vite development server instead of the containerized frontend, start the backend services and MySQL first, then run these commands from the project root:

```powershell
Set-Location frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Vite serves the app at [http://localhost:3000](http://localhost:3000). The frontend `.env` file contains the API base URLs for the five backend services; update these values if your local service ports differ. The Vite variables are embedded into the client during development or build, so do not put secrets in them.

To create a production frontend bundle, run `npm run build` from the `frontend` directory. The generated files are written to `frontend/dist/`.

---

## API Endpoints

All URLs below use the default host ports. If you changed a service port in `.env`, use that port instead. Endpoints marked **Protected** require the access token in the HTTP Authorization header. Role-restricted endpoints also require a token for an allowed role.

### Auth Service — `http://localhost:5001`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a user |
| `POST` | `/api/auth/login` | Public | Authenticate and obtain tokens |
| `POST` | `/api/auth/refresh` | Public, refresh token required | Refresh the access token |
| `DELETE` | `/api/auth/users/:id` | Protected — `ADMIN` | Delete a user |

### Restaurant Service — `http://localhost:5002`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/restaurants` | Public | List restaurants |
| `GET` | `/api/restaurants/:id` | Public | Get a restaurant |
| `POST` | `/api/restaurants` | Protected — `ADMIN` or `RESTAURANT_ADMIN` | Create a restaurant |
| `PATCH` | `/api/restaurants/:id/status` | Protected — `ADMIN` or `RESTAURANT_ADMIN` | Update restaurant status |
| `DELETE` | `/api/restaurants/:id` | Protected — `ADMIN` | Delete a restaurant |
| `GET` | `/api/menu/restaurant/:restaurantId` | Public | Get a restaurant's menu |
| `POST` | `/api/menu` | Protected — `ADMIN` or `RESTAURANT_ADMIN` | Create a menu item |
| `PATCH` | `/api/menu/:id/availability` | Protected — `ADMIN` or `RESTAURANT_ADMIN` | Update menu item availability |

### Order Service — `http://localhost:5003`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/orders` | Protected | Create an order |
| `GET` | `/api/orders/my-orders` | Protected | List the current user's orders |
| `GET` | `/api/orders/:id` | Protected | Get an order |
| `GET` | `/api/orders/restaurant/:restaurantId` | Protected | List orders for a restaurant |
| `PATCH` | `/api/orders/:id/status` | Protected | Update order status |

### Delivery Service — `http://localhost:5004`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/deliveries` | Protected — `ADMIN` or `RESTAURANT_ADMIN` | Create a delivery |
| `PATCH` | `/api/deliveries/:id/assign` | Protected — `ADMIN` | Assign a rider |
| `PATCH` | `/api/deliveries/:id/status` | Protected — `ADMIN` or `DELIVERY_PERSON` | Update delivery status |
| `GET` | `/api/deliveries/my-assignments` | Protected — `DELIVERY_PERSON` | List the current rider's assignments |
| `GET` | `/api/deliveries/:id` | Protected | Get a delivery |

### Customer Service — `http://localhost:5005`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/customers/profile` | Protected | Create the current user's customer profile |
| `GET` | `/api/customers/profile` | Protected | Get the current user's customer profile |
| `PUT` | `/api/customers/profile` | Protected | Update the current user's customer profile |
| `POST` | `/api/customers/addresses` | Protected | Add an address |
| `GET` | `/api/customers/addresses` | Protected | List the current user's addresses |
| `DELETE` | `/api/customers/addresses/:id` | Protected | Delete an address |

Replace `:id` and `:restaurantId` path parameters with actual IDs. Endpoints that create or update resources expect a JSON request body; the required fields depend on the operation.

---

## Stop the System

Stop the containers without deleting the database volume:

```powershell
docker compose down
```

Stop the containers and delete the database volume (this permanently removes the stored database data):

```powershell
docker compose down -v
```

---