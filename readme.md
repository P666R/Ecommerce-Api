# E-commerce API with Nodejs

## Features

TypeScript enabled Nodejs project.
Database MySQL.
Prisma ORM for database interactions.
Database schema for ecommerce functionality.
Tried to implement features like product listing, cart management, and user authentication.
Error Handling via global error handling middleware using custom error classes.

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

## Postman Documentation link

https://documenter.getpostman.com/view/27141986/2sA2rDwgAU

## Installation

Clone the project
git clone https://github.com/P666R/Ecommerce-Api.git

Go to the project directory

Environmental Variables refer .env.example

Install dependencies
npm install

Prisma
npx prisma init

npx prisma migrate dev --name some_name

npx prisma studio for GUI

Start the server
npm start
