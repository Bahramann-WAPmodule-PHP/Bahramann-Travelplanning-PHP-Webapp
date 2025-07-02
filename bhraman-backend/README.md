# README for Bhraman Backend

## Project Overview

Bhraman Backend is a PHP-based backend system designed to support the Bhraman travel planning application. It provides a RESTful API for user authentication, destination management, and booking operations. The backend utilizes PDO for database interactions and follows a structured MVC architecture.

## Project Structure

```
bhraman-backend
├── config
│   ├── database.php         # Database connection settings
│   └── config.php           # Application configuration constants
├── src
│   ├── controllers          # Controllers for handling requests
│   │   ├── AuthController.php
│   │   ├── DestinationController.php
│   │   └── BookingController.php
│   ├── models               # Models representing database entities
│   │   ├── User.php
│   │   ├── Destination.php
│   │   └── Booking.php
│   ├── middleware           # Middleware for authentication
│   │   └── AuthMiddleware.php
│   └── utils                # Utility classes for database and response handling
│       ├── Database.php
│       └── Response.php
├── api                      # API endpoints
│   ├── auth
│   │   ├── login.php
│   │   ├── signup.php
│   │   └── logout.php
│   ├── destinations
│   │   ├── index.php
│   │   └── details.php
│   └── bookings
│       ├── create.php
│       └── list.php
├── public                   # Publicly accessible files
│   └── index.php
├── sql                      # SQL schema for database tables
│   └── schema.sql
├── .htaccess                # URL rewriting configuration
├── composer.json            # Composer dependencies and autoloading
└── README.md                # Project documentation
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd bhraman-backend
   ```

2. **Install Dependencies**
   Ensure you have Composer installed, then run:
   ```bash
   composer install
   ```

3. **Configure Database**
   Update the `config/config.php` file with your database credentials.

4. **Create Database Schema**
   Execute the SQL commands in `sql/schema.sql` to set up the necessary tables in your database.

5. **Run the Application**
   Use a local server (like XAMPP or MAMP) to serve the `public` directory or configure your web server to point to it.

## Usage

- **Authentication**
  - **Login**: `POST /api/auth/login.php`
  - **Signup**: `POST /api/auth/signup.php`
  - **Logout**: `POST /api/auth/logout.php`

- **Destinations**
  - **List**: `GET /api/destinations/index.php`
  - **Details**: `GET /api/destinations/details.php?id={destination_id}`

- **Bookings**
  - **Create**: `POST /api/bookings/create.php`
  - **List**: `GET /api/bookings/list.php`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.