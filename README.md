<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<img src="https://www.google.com/search?q=reactjs+image&sca_esv=30342252162f46f6&udm=2&sxsrf=APpeQns-HUHusXzt8KD5VgSLLYoC9rup3A:1784843349538&source=lnms&sa=X&ved=2ahUKEwjyutDO4-mVAxV_-gIHHR5GI4YQ0pQJegQIBRAH&biw=1366&bih=615&dpr=1#ip=1&sv=CAMSURoyKhBlLTVYWkNaWVZTUEhRZk5NMg41WFpDWllWU1BIUWZOTToOOVZHU1YyV1VaUDVuYk0gBCoXCgFzEhBlLTVYWkNaWVZTUEhRZk5NGAEwARgHIMie2dAPSggQARgBIAEoAQ">

## Description

<pre>
  This's a <b>final trainig project</b> it's idea about rent tool instead of buying tools, the renter could rent tools from the owner, for the current version i'll swim far from Payment, Location, Chat. i'll use them in the next version, but i'll use websocket for sending notifications and rent requests.
  <i> the app includes : </i>
  <small>- filtring </small>
  <small>- searching </small>
  <small>- profile </small>
  <small>- Available, Occupped tools </small>
  <small>- renter space </small>
  <small>- renter space </small>
  <small>- notification </small>
  <small>- rental tacking </small>
  <small>- authentication & authorization </small>
  <small>- rental notification </small>
   <small> and more... </small>
</pre>

## Project modelisation:UML

# I used UML for analyse project requirements.

<b>Class Diagram :</b>
<img width="1121" height="597" alt="class_diagram" src="https://github.com/user-attachments/assets/d9ccb695-0c66-4b2d-a44a-7fe12ad942e8" />

<b>Sequence Diagram:</b>
<small>Shown just how rental process goes</small>
<img width="1121" height="597" alt="diagram_suqence" src="https://github.com/user-attachments/assets/2d2f9597-6800-444e-8345-2b302f839762" />

<b>Use Case:</b>
<img width="1121" height="597" alt="useCase" src="https://github.com/user-attachments/assets/71b7d2db-728a-4df1-9e23-a99e748d7366" />

## Description

# RentTool Backend

Backend API for a tool rental platform built with **NestJS, TypeScript, and MongoDB**.

The application provides the backend infrastructure for managing users, tools, rentals, reviews, notifications, authentication, real-time communication, and media uploads.

## 🚀 Features

- 🔐 JWT-based authentication
- 👤 User management
- 🛠️ Tool management
- 🤝 Rental management
- ⭐ Tool and user reviews
- 🔔 Persistent notifications
- ⚡ Real-time communication with WebSockets
- ☁️ Cloudinary integration for media management
- 🧩 DTO-based request validation
- 🛡️ Custom authentication decorators and guards
- 🚨 Global exception handling
- 📦 Standardized API responses
- 🧪 Unit tests for controllers and services
- 🐳 Docker support

## 🛠️ Tech Stack

- **NestJS**
- **TypeScript**
- **MongoDB**
- **Mongoose**
- **JWT**
- **WebSockets**
- **Cloudinary**
- **Docker**
- **Jest**

## 🏗️ Architecture

The application is organized around independent NestJS modules, with shared infrastructure separated into common and core layers.

```text
src/
├── common/
│   ├── constants/
│   ├── decorators/
│   ├── types/
│   └── utilities/
│
├── core/
│   ├── filters/
│   └── interceptors/
│
└── modules/
    ├── authentication/
    ├── user/
    ├── tool/
    ├── rental/
    ├── review/
    ├── notification/
    ├── appsocket/
    ├── realtime/
    └── cloudinary/
```

### Common Layer

Contains shared application utilities such as:

- Custom decorators
- Authentication-related decorators
- Shared types
- Constants
- Rental utilities

### Core Layer

Contains cross-cutting application infrastructure:

- Global exception handling
- Response interception

### Modules

Each business domain is isolated into its own NestJS module with controllers, services, DTOs, and schemas where applicable.

## 🔐 Authentication

The authentication module provides:

- User login
- JWT-based authentication
- Password encryption
- Authentication services
- DTO-based request handling
- Custom authentication decorators

Protected application resources can use the project's authentication infrastructure to identify and authorize authenticated users.

## 🛠️ Tool Management

The tool module handles the management of rental tools.

It includes:

- Tool creation
- Tool updates
- Tool retrieval
- Tool-related business logic
- MongoDB/Mongoose schema
- DTO-based request validation

## 🤝 Rental Management

The rental module contains the business logic related to tool rentals.

It provides:

- Rental creation
- Rental updates
- Rental retrieval
- Rental-specific business utilities
- Persistent rental data using MongoDB/Mongoose

## ⭐ Reviews

The review module supports two review domains:

- **Tool reviews**
- **User reviews**

Each review type has dedicated schemas and DTOs for creating and updating reviews.

## 🔔 Notifications

The notification module provides persistent notification management.

It includes:

- Notification creation
- Notification updates
- Notification retrieval
- MongoDB persistence

Notifications can be combined with the real-time layer to provide users with real-time updates.

## ⚡ Real-Time Communication

The application includes WebSocket-based real-time communication.

The real-time infrastructure is separated into dedicated modules:

```text
appsocket/
realtime/
notification/
```

This allows the backend to handle real-time application events while keeping notification persistence separate from real-time delivery.

## ☁️ Cloudinary Integration

The project includes a dedicated Cloudinary module for media management.

```text
cloudinary/
├── cloudinary.module.ts
├── cloudinary.provider.ts
└── cloudinary.service.ts
```

The integration is isolated from the rest of the application through a dedicated provider and service.

## 🧪 Testing

The project includes unit tests for controllers and services across several application modules using **Jest**.

Example:

```text
authentication/
├── authentication.controller.spec.ts
└── authentication.service.spec.ts

rental/
├── rental.controller.spec.ts
└── rental.service.spec.ts

review/
├── review.controller.spec.ts
└── review.service.spec.ts
```

## 🐳 Docker

The project supports running the backend using Docker.

Make sure Docker and Docker Compose are installed before starting the application with the containerized setup.

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/achrafjbr/rentTool-backend.git

cd rentTool-backend
```

Install dependencies:

```bash
npm install
```

Create your environment configuration file:

```text
MONGODB_URI=
DB_NAME=
APP_NAME=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
.env
```

Configure the required environment variables for the application, including database, authentication, and Cloudinary configuration.

Start the development server:

```bash
npm run start:dev
```

## 🧪 Running Tests

Run unit tests with:

```bash
npm run test
```

## 📁 Main Project Structure

```text
src/
├── common/
├── core/
├── modules/
│   ├── appsocket/
│   ├── authentication/
│   ├── cloudinary/
│   ├── notification/
│   ├── realtime/
│   ├── rental/
│   ├── review/
│   ├── tool/
│   └── user/
├── app.module.ts
└── main.ts
```

## 📌 Project Highlights

This project demonstrates experience with:

- Modular NestJS architecture
- REST API development
- Authentication and authorization
- MongoDB/Mongoose data modeling
- Real-time WebSocket communication
- External service integration
- DTO-based validation
- Global exception handling
- API response standardization
- Unit testing
- Dockerized backend development

## 👨‍💻 Author

**Achraf Jbr**

Backend Developer focused on **NestJS, Node.js, TypeScript, MongoDB, and REST API development**.

GitHub:
https://github.com/achrafjbr
