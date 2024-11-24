# Microservices Architecture for Authentication and Email Services

This repository implements a **microservices-based architecture** with services for authentication, email management, and an API gateway. The focus is on scalability, maintainability, and robust logging to support production-grade applications.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [Services](#services)
  - [API Gateway](#api-gateway)
  - [Auth Service](#auth-service)
  - [Email Service](#email-service)
- [Logging and Monitoring](#logging-and-monitoring)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This project provides essential services:
1. **Authentication Service**: User authentication, token management, and OTP verification.
2. **Email Service**: Sends OTPs and email notifications.
3. **API Gateway**: Centralized routing and request handling for microservices.

The architecture is designed with **Docker** and **Redis**, leveraging **PostgreSQL** for data persistence and **Sequelize** as the ORM.

---

## Architecture

The project follows a **microservices architecture**, connected via an API Gateway. Key components include:

- **API Gateway**: Routes client requests to appropriate microservices.
- **Auth Service**: Handles user authentication, token generation, and database interactions.
- **Email Service**: Manages email templates, sending emails, and OTP handling.

### Technology Stack:
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, Sequelize ORM
- **Cache/Queue**: Redis
- **Logging**: Winston with Daily Rotate File
- **Containerization**: Docker, Docker Compose

---

## Features

### General
- Modular microservices for ease of scaling and management.
- Consistent structured logging with Winston.

### Authentication
- Secure JWT-based authentication.
- Refresh token rotation and revocation.
- OTP-based email verification.

### Email Service
- Dynamic email templates for OTP delivery.
- Integration with Nodemailer for SMTP-based email delivery.

### API Gateway
- Centralized routing and middleware for CORS, cookie parsing, and request logging.
- Health check endpoints for service monitoring.

---

## Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Docker](https://www.docker.com/)
- [Redis](https://redis.io/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in each service directory (`api-gateway`, `auth-service`, `email-service`).
   - See [Environment Variables](#environment-variables) for required keys.

4. Start services with Docker Compose:
   ```bash
   docker-compose up --build
   ```

5. Access services:
   - API Gateway: `http://localhost:3000`
   - Auth Service: `http://localhost:4000`
   - Email Service: `http://localhost:4001`

---

## Usage

### Health Check
```bash
GET http://localhost:3000/
```

### Auth Endpoints
- **Signup**: `POST /auth/signup`
- **Login**: `POST /auth/login`
- **Logout**: `POST /auth/logout`

### Email Endpoints
- **Send OTP**: `POST /email/send-otp`

---

## Services

### API Gateway
- Handles incoming client requests.
- Implements centralized error handling and request logging.
- Middleware includes:
  - CORS
  - Cookie parsing
  - Correlation ID propagation
  - Request-response logging

### Auth Service
- Manages user authentication and token lifecycle.
- Schema migrations and updates with Sequelize.
- Redis used for temporary OTP storage.

### Email Service
- Sends OTPs and email notifications.
- Includes reusable email templates.
- Redis integration for fetching OTPs.

---

## Logging and Monitoring

All services use **Winston** for structured logging:
- **Development**: Console logs with colorized output.
- **Production**: JSON-formatted logs stored in rotating log files.
- Log files:
  - `logs/application-%DATE%.log`
  - `logs/error-%DATE%.log`
  - `logs/exceptions-%DATE%.log`

Key features:
- Correlation IDs for request tracing.
- Metadata-rich logs for debugging.

---

## Environment Variables

Each service requires specific environment variables. Below are the common configurations:

| Variable            | Description                           | Example                 |
|---------------------|---------------------------------------|-------------------------|
| `DB_HOST`           | Database host                        | `localhost`             |
| `DB_PORT`           | Database port                        | `5432`                  |
| `DB_USER`           | Database username                    | `postgres`              |
| `DB_PASSWORD`       | Database password                    | `your_password`         |
| `JWT_SECRET`        | Secret key for JWT                   | `supersecretkey`        |
| `JWT_REFRESH_SECRET`| Secret key for refresh tokens         | `refreshsecretkey`      |
| `REDIS_HOST`        | Redis host                           | `localhost`             |
| `REDIS_PORT`        | Redis port                           | `6379`                  |
| `EMAIL_USER`        | SMTP user                            | `your_email@example.com`|
| `EMAIL_PASS`        | SMTP password                        | `your_email_password`   |

---

## Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add new feature"`.
4. Push the branch: `git push origin feature-name`.
5. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
