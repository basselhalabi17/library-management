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
   ```sh
   PORT=7000
   POSTGRES_HOST=db # docker-compose service name (change to localhost if not using docker-compose)
   POSTGRES_USER=user (change to your postgres user if not using docker-compose)  
   POSTGRES_PASSWORD=password (change to your postgres password if not using docker-compose)
   POSTGRES_NAME=library (create a database with this name if not using docker-compose)
   ```

5. Run the application:
    ```sh
    npm start
    ```
6. Application should be running on localhost:7000

## Usage

### Endpoints Documentation

#### Routes
#### Get All Books
```sh
- Endpoint: GET /books
- Middleware: limiter (applies rate limiting)
- Description: Retrieves all books from the repository.
- Responses:
    200 OK: Returns an array of book objects.
    500 Internal Server Error: If an error occurs on the server.
```
#### Search Books
```sh
- Endpoint: GET /books/search
- Middleware: limiter (applies rate limiting)
- Description: Searches for books by title, author, or ISBN.
- Query Parameters:
    title (optional) - Partial or full title of the book.
    author (optional) - Partial or full name of the author.
    ISBN (optional) - Full ISBN of the book.
- Responses:
    200 OK: Returns an array of book objects that match the search criteria.
    404 Not Found: If no books are found that match the search criteria.
    500 Internal Server Error: If an error occurs on the server.
```
#### Create Book
```sh
- Endpoint: POST /books
- Middleware: validateDto(CreateBookDto)
- Description: Creates a new book in the repository.
- Request Body:
    title (string) - Title of the book.
    author (string) - Author of the book.
    ISBN (string) - ISBN of the book.
- quantity (number) - Quantity available.
- shelfLocation (string) - Location of the book on the shelf.
- Responses:
    201 Created: Returns the newly created book object.
    400 Bad Request: If validation fails.
    500 Internal Server Error: If an error occurs on the server.
```
#### Update Book
```sh
- Endpoint: PATCH /books/:id
- Description: Updates an existing book by its ID.
- Path Parameters:
    id (string) - The unique identifier of the book to update.
- Request Body: Any combination of the following properties:
   title (string)
   author (string)
   ISBN (string)
   quantity (number)
   shelfLocation (string)
- Responses:
    200 OK: Returns the updated book object.
    404 Not Found: If the book with the specified ID does not exist.
    500 Internal Server Error: If an error occurs on the server.
```
#### Delete Book
```sh
- Endpoint: DELETE /books/:id
- Description: Deletes a book from the repository by its ID.
-Path Parameters:
  id (string) - The unique identifier of the book to delete.
- Responses:
    204 No Content: Successfully deletes the book.
    404 Not Found: If the book with the specified ID does not exist.
    500 Internal Server Error: If an error occurs on the server.
```

#### Get All Borrowers
```sh
- Endpoint: GET /borrowers
- Description: Retrieves all borrowers in the system.
- Responses:
    200 OK: Returns an array of borrower objects.
    500 Internal Server Error: If an error occurs on the server.
```
#### Create Borrower
```sh
- Endpoint: POST /borrowers
- Middleware: validateDto(CreateBorrowerDto)
- Description: Creates a new borrower in the system.
- Request Body:
    name (string) - Full name of the borrower.
    email (string) - Email of the borrower.
    phone (string) Optional - Phone number of the borrower.
- Responses:
    201 Created: Returns the newly created borrower object.
    400 Bad Request: If validation fails.
    500 Internal Server Error: If an error occurs on the server.
```
#### Update Borrower
```sh
- Endpoint: PATCH /borrowers/:id
- Description: Updates an existing borrower by their ID.
- Path Parameters:
    id (string) - The unique identifier of the borrower to update.
- Request Body: Any combination of the following properties:
    name (string) - Updated name of the borrower.
    email (string) - Updated email of the borrower.
    phone (string) - Updated phone number of the borrower.
- Responses:
    200 OK: Returns the updated borrower object.
    404 Not Found: If the borrower with the specified ID does not exist.
    500 Internal Server Error: If an error occurs on the server.
```
#### Delete Borrower
```sh
- Endpoint: DELETE /borrowers/:id
- Description: Deletes a borrower from the system by their ID.
- Path Parameters:
    id (string) - The unique identifier of the borrower to delete.
- Responses:
   204 No Content: Successfully deleted the borrower.
   404 Not Found: If the borrower with the specified ID does not exist.
   500 Internal Server Error: If an error occurs on the server.
```
