# Food Delivery Management System

A food delivery backend built with Node.js, Express, MySQL and Docker Compose. The application is split into five services that communicate over a Docker bridge network and use a shared MySQL database.

---

## Architecture

| Service | Default host port | Responsibility |
| --- | ---: | --- |
| Auth Service | `5001` | Registration, login, token refresh and user deletion |
| Restaurant Service | `5002` | Restaurant and menu management |
| Order Service | `5003` | Order creation, retrieval and status updates |
| Delivery Service | `5004` | Delivery creation, rider assignment and delivery status |
| Customer Service | `5005` | Customer profiles and delivery addresses |
| MySQL | `3307` (container port `3306`) | Shared database, initialized from `init.sql` |

The host ports can be changed in the root `.env` file. Inside Docker, the services use their container ports (`5001`–`5005`) and connect to MySQL using the Compose service name `app-db`.

---

## Project Structure

```text
LaunchPad_Assignment/
├── Service/
│   ├── authService/
│   ├── restaurantService/
│   ├── orderService/
│   ├── deliveryService/
│   └── customerService/
├── Evidence Screenshots/
│   ├── API Screenshots/
│   ├── Docker Screenshots/
│   └── Project Root Folder.jpeg
├── docker-compose.yml
├── init.sql
├── .env.example
└── README.md
```

Each service contains its own routes, controllers, middleware, database configuration and supporting code.

---

## Prerequisites

- Docker Desktop with Docker Compose
- Postman, `curl` or another API client for endpoint testing
- Node.js 20 or later, only if running a service outside Docker

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

   Compose starts six containers: MySQL and the five application services. MySQL has a health check; the application services wait for it to become healthy before starting.

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