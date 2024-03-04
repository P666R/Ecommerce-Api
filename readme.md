# E-commerce API with Nodejs

## Features

- TypeScript enabled Nodejs project
- Database MySQL
- Prisma ORM for database interaction
- Database schema for ecommerce functionality
- Implement features like product listing, category listing, cart management, order management and user authentication
- Error Handling via global error handling middleware using custom error classes
- Feature to set custon error codes for frontend use
- Global rate limiting for all
- Custom token bucket rate limiting MW using Redis for logged in users for implmentation in specific routes of choice

## Database Models Overview

### User:

Represents a user with basic information such as name, email, and password.
Has optional default shipping and billing addresses.
Connected to addresses, cart items, and orders.

### Address:

Stores user addresses with details like line one, city, and country.
Belongs to a specific user.

### Product:

Represents a product with a name, description, price, and tags.
Connected to cart items and orders.

### Category:

Represents categories linked to products, created based on products tags.
Connected to products.

### CartItem:

Represents a user's selected product in their shopping cart.
Connects a user to a specific product.

### Order:

Represents a user's purchase with net amount, shipping address, and order status.
Connects to products and order events.

### OrderProduct:

Connects orders to specific products with quantities.

### OrderEvent:

Represents events in the lifecycle of an order, such as acceptance or cancellation.
Connected to a specific order.

## Postman API Documentation link

https://documenter.getpostman.com/view/27141986/2sA2rDwgAU

## Installation

Clone the project: <br>
git clone https://github.com/P666R/Ecommerce-Api.git

Go to the project directory

Environmental Variables: <br>
refer .env.example

Install dependencies: <br>
npm install

Prisma: <br>
npx prisma init

npx prisma migrate dev --name some_name

npx prisma studio for GUI

Start redis server: <br>
sudo service redis-server start

Start the dev server: <br>
npm run dev:start
