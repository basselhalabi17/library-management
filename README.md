# Library Management System

## Description
A library management system built with Node.js, Express, and TypeORM. This system allows users to manage books, authors, and other library resources.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/library-management.git
    cd library-management
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up the environment variables:
    Create a `.env` file in the root directory and add the necessary environment variables.

4. Run the application:
    ```sh
    npm start
    ```

## Usage

### Endpoints Documentation

#### Update Book
```http
PUT /books/:id
