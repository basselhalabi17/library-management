# Library Management System

## Description
A library management system built with Node.js, Express, and TypeORM. This system allows users to manage books and borrowers. Borrowing process takes place using the checkout endpoint where the borrow date is set to the current date and the due date is set to 3 minutes after the borrow date for testing purposes

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
6. Application should be running on ```localhost:7000 ```

## Usage

### Endpoints Documentation

#### Routes
### Get All Books

- **Endpoint:** `GET /books`
- **Middleware**: limiter (applies rate limiting)
- **Description:** Gets all books in the system.
- **Responses:**
  - **200 OK:** Successfully returns all books.
  - **500 Internal Server Error:** If an error occurs on the server.

### Search Books
- **Endpoint:** `GET /books/search`
- **Middleware:** limiter (applies rate limiting)
- **Description:** Searches for books by title, author, or ISBN.
- **Query Parameters:**
  - `title (optional)` - Partial or full title of the book.
  - `author (optional)` - Partial or full name of the author.
  - `ISBN (optional)` - Full ISBN of the book.
- **Responses:**
  - **200 OK:** Returns an array of book objects that match the search criteria.
  - **404 Not Found:** If no books are found that match the search criteria.
  - **500 Internal Server Error:** If an error occurs on the server.
    
### Create Book
- **Endpoint:** `POST /books`
- **Middleware:** validateDto(CreateBookDto) - it validates the object and removes any extra fields that are not in books table
- **Description:** Creates a new book in the repository.
- **Request Body:**
  - `title (string)` - Title of the book.
  - `author (string)` - Author of the book.
  - `ISBN (string)` - ISBN of the book.
  - `quantity (number)` - Quantity available.
  - `shelfLocation (string)` - Location of the book on the shelf.
- **Responses:**
  - **201 Created:** Returns the newly created book object.
  - **400 Bad Request:** If required field is missing or input has invalid syntax.
  - **409 Conflict:**: if there are any duplicates
  - **500 Internal Server Error:** If an error occurs on the server.

### Update Book
- **Endpoint:** `PATCH /books/:id`
- **Description:** Updates an existing book by its ID.
- **Route Parameters:**
  - `id (string)` - The unique identifier of the book to update.
- **Request Body:** Any combination of the following properties:
  - `title (string)`
  - `author (string)`
  - `ISBN (string)`
  - `quantity (number)`
  - `shelfLocation (string)`
- **Responses:**
  - **200 OK:** Returns the updated book object.
  - **400 Bad Request:** If required field is missing or input has invalid syntax.
  - **404 Not Found:** If the book with the specified ID does not exist.
  - **409 Conflict:**: if there are any duplicates
  - **500 Internal Server Error:** If an error occurs on the server.

### Delete Book
- **Endpoint:** `DELETE /books/:id`
- **Description:** Deletes a book from the repository by its ID.
- **Route Parameters:**
  - `id (string)` - The unique identifier of the book to delete.
- **Responses:**
  - **204 No Content:** Successfully deletes the book.
  - **404 Not Found:** If the book with the specified ID does not exist.
  - **500 Internal Server Error:** If an error occurs on the server.

### Get All Borrowers
- **Endpoint:** `GET /borrowers`
- **Description:** Retrieves all borrowers in the system.
- **Responses:**
  - **200 OK:** Returns an array of borrower objects.
  - **500 Internal Server Error:** If an error occurs on the server.

### Create Borrower
- **Endpoint:** `POST /borrowers`
- **Middleware:** validateDto(CreateBorrowerDto)
- **Description:** Creates a new borrower in the system.
- **Request Body:**
  - `name (string)` - Full name of the borrower.
  - `email (string)` - Email of the borrower.
  - `phone (string)` Optional - Phone number of the borrower.
- **Responses:**
  - **201 Created:** Returns the newly created borrower object.
  - **400 Bad Request:** If required field is missing or input has invalid syntax.
  - **409 Conflict:**: if there are any duplicates
  - **500 Internal Server Error:** If an error occurs on the server.
  
### Update Borrower
- **Endpoint:** `PATCH /borrowers/:id`
- **Description:** Updates an existing borrower by their ID.
- **Route Parameters:**
  - `id (string)` - The unique identifier of the borrower to update.
- **Request Body:** Any combination of the following properties:
  - `name (string)` - Updated name of the borrower.
  - `email (string)` - Updated email of the borrower.
  - `phone (string)` - Updated phone number of the borrower.
- **Responses:**
  - **200 OK:** Returns the updated borrower object.
  - **400 Bad Request:** If required field is missing or input has invalid syntax.
  - **404 Not Found:** If the borrower with the specified ID does not exist.
  - **409 Conflict:**: if there are any duplicates
  - **500 Internal Server Error:** If an error occurs on the server.

### Delete Borrower
- **Endpoint:** `DELETE /borrowers/:id`
- **Description:** Deletes a borrower from the system by their ID.
- **Route Parameters:**
  - `id (string)` - The unique identifier of the borrower to delete.
- **Responses:**
  - **204 No Content:** Successfully deleted the borrower.
  - **404 Not Found:** If the borrower with the specified ID does not exist.
  - **500 Internal Server Error:** If an error occurs on the server.

### Check Out a Book

- **Endpoint:** `POST /checkout/:bookId/:borrowerId`
- **Description:** Checks out a book for a borrower.
- **Route Parameters:**
  - `bookId` (string): The ID of the book to be checked out.
  - `borrowerId` (string): The ID of the borrower.
- **Responses:**
  - **200 OK:** Successfully checked out the book.
  - **400 Bad Request:** If the book is already checked out or out of stock.
  - **404 Not Found:** If the book or borrower is not found.
  - **500 Internal Server Error:** If an error occurs on the server.
 
### Return a Book

- **Endpoint:** `POST /return/:bookId/:borrowerId`
- **Description:** Returns a checked-out book.
- **Route Parameters:**
  - `bookId` (string): The ID of the book to be returned.
  - `borrowerId` (string): The ID of the borrower.
- **Responses:**
  - **200 OK:** Successfully returns the book.
  - **400 Bad Request:** If the book was not checked out by this borrrower.
  - **404 Not Found:** If the book or borrower is not found.
  - **500 Internal Server Error:** If an error occurs on the server.

### Get All Checked Out Books

- **Endpoint:** `GET /checked-out`
- **Description:** Retrieves a list of all currently checked-out books.
- **Responses:**
  - **200 OK:** Returns an array of checked-out books.
  - **500 Interval Server Error:**: If an error occurs on the server.

### Get Checked-Out Books by Borrower
- **Endpoint:** `GET /checked-out/:borrowerId`
- **Description:** Retrieves a list of books checked out by a specific borrower.
- **Route Parameters:**
  - `borrowerId` (string): The ID of the borrower.
- **Responses:**
  - **200 OK:** Returns an array of checked-out books for the specified borrower.
  - **500 Interval Server Error:**: If an error occurs on the server.

### Get Overdue Books
- **Endpoint:** `GET /overdue`
- **Description:** Retrieves a list of overdue books.
- **Responses:**
  - **200 OK:** Returns an array of overdue books.
  - **500 Interval Server Error:**: If an error occurs on the server.

### Export Borrowing Data in a specific period in csv or xlsx format
- **Endpoint:** `GET /export`
- **Description:** Exports all the borrowing data during a specified period in csv or xlsx format.
- **Request Body:**
  - `dateFrom` (date): start date from which to start retrieving borrowing data.
  - `dateTo` (date): end date.
  - `format` (string): csv or xlsx
- **Responses:**
  - **200 OK:** Returns a csv or xlsx file containing all the borrowing data of the system and it can be viewed if you save the response to a file in Postman.
  - **500 Interval Server Error:**: If an error occurs on the server.

### Export All Borrowing Data or Only Overdue borrowing in last month 
- **Endpoint:** `GET /export-last-month`
- **Description:** Exports all the borrowing data in the last month based on the type parameter. If it is "overdue", then gets only overdue borrowing, else gets all borrowing data.
- **Request Body:**
  - `type` (string): "overdue" or "all"
  - `format` (string): csv or xlsx
- **Responses:**
  - **200 OK:** Returns a csv or xlsx file containing all the borrowing data or overdue borrowing of the system in the last month and it can be viewed if you save the response to a file in Postman.
  - **500 Interval Server Error:**: If an error occurs on the server.

## Docker Setup

1. Build And Run the docker-compose
    ```sh
    docker-compose up --build -d
    ```
2. You can view the logs using the following command:
   ```sh
   docker logs library-management -f
   ```
3. Application should also be running on ```localhost:7000 ```

## Bonus Features Implemented

1. The system can show analytical reports of the borrowing process in a specific period and
export the borrowing process data in CSV or Xlsx sheet formats e.x.
2. Exports all overdue borrows of the last month.
3. Exports all borrowing processes of the last month.
4. Implement rate limiting for the API to prevent abuse (applied on getAllBooks and searchBooks endpoints...it is set statically in the code with a maximum 2 requests per 3 seconds for testing purposes)
5. Dockerizing the application using docker-compose.
