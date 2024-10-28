import { Router, NextFunction, Request, Response} from 'express';
import AppDataSource from '../config/db';
import { Book } from '../models/book';
import { BookBorrower } from '../models/bookBorrower';
import { Borrower } from '../models/borrower';
import NotFoundException from '../exceptions/not-found-exception';
import HttpException from '../exceptions/http-exception';
import { addHours } from 'date-fns';
import * as ExcelJS from 'exceljs';



export class BookBorrowerController {
    public router: Router = Router();
    private bookRepository = AppDataSource.getRepository(Book);
    private borrowerRepository = AppDataSource.getRepository(Borrower);
    private bookBorrowerRepository = AppDataSource.getRepository(BookBorrower);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/checkout/:bookId/:borrowerId', this.checkOutBook);
        // Add a route for returning a book
        this.router.post('/return/:bookId/:borrowerId', this.returnBook);
        //Add a route to check which books are checked out and by whom
        this.router.get('/checked-out', this.getCheckedOutBooks);
        //Add a route for borrower to check books he currently has
        this.router.get('/checked-out/:borrowerId', this.getBorrowerCheckedOutBooks);
        //Add a route to list books that are overdue
        this.router.get('/overdue', this.getOverdueBooks);
        //Add a route for exporting borrowing data
        this.router.get('/export', this.exportBorrowingData);
        //Add a route for exporting overdue or all borrows of last month based on the request
        this.router.get('/export-last-month', this.exportLastMonth);
    }


    /**
     * Checks out a book for a borrower.
     * 
     * @param request - The HTTP request object.
     * @routeparam bookId - The ID of the book to check out.
     * @routeparam borrowerId - The ID of the borrower checking out the book.
     * @param response - The HTTP response object.
     * @param next - The next function in the middleware chain.
     * @throws NotFoundException if the book or borrower is not found.
     * @throws HttpException if the book is already checked out or out of stock.
     */
    private checkOutBook = async (request: Request, response: Response, next: NextFunction) => {
        try {
        const { bookId, borrowerId } = request.params;
        const book = await this.bookRepository.findOne({
            where: { id: bookId },
        });
        const borrower = await this.borrowerRepository.findOne({
            where: { id: borrowerId },
        });

        if (!book) {
            throw new NotFoundException(`Book with ID ${bookId} not found`);
        }

        if (!borrower) {
            throw new NotFoundException(`Borrower with ID ${borrowerId} not found`);
        }

        const bookBorrowerExists = await this.bookBorrowerRepository.createQueryBuilder("bookBorrower")
            .where("bookBorrower.bookId = :bookId", { bookId })
            .andWhere("bookBorrower.borrowerId = :borrowerId", { borrowerId })
            .andWhere("bookBorrower.returnDate IS NULL")  // Explicitly checking returnDate
            .getOne();

        if (bookBorrowerExists) {
            throw new HttpException(400, 'Book is already checked out by this borrower');
        }

        if (book.quantity == 0){
            throw new HttpException(400, 'Book is out of stock');
        }


        const bookBorrower = new BookBorrower();
        bookBorrower.bookId = book.id;
        bookBorrower.borrowerId = borrower.id;

        await this.bookBorrowerRepository.save(bookBorrower);

        book.quantity -= 1;
        await this.bookRepository.save(book);
        response.send('Book checked out successfully');
    } catch (error) {
        console.log(error);
        next(error);
    };
}

    /**
     * Returns a book that was checked out by a borrower.
     * 
     * @param request - The HTTP request object.
     * @routeparam bookId - The ID of the book to return.
     * @routeparam borrowerId - The ID of the borrower returning the book.
     * @param response - The HTTP response object.
     * @param next - The next function in the middleware chain.
     * @throws NotFoundException if the book or borrower is not found.
     * @throws HttpException if the book is not checked out by the borrower
     * or if the book is already returned.
     */
    private returnBook = async (request: Request, response: Response, next: NextFunction) => {
        try {
        const { bookId, borrowerId } = request.params;
        const book = await this.bookRepository.findOne({
            where: { id: bookId },
        });
        const borrower = await this.borrowerRepository.findOne({
            where: { id: borrowerId },
        });

        if (!book) {
            throw new NotFoundException(`Book with ID ${bookId} not found`);
        }

        if (!borrower) {
            throw new NotFoundException(`Borrower with ID ${borrowerId} not found`);
        }

        const bookBorrower = await this.bookBorrowerRepository.createQueryBuilder("bookBorrower")
            .where("bookBorrower.bookId = :bookId", { bookId })
            .andWhere("bookBorrower.borrowerId = :borrowerId", { borrowerId })
            .andWhere("bookBorrower.returnDate IS NULL")  // Explicitly checking returnDate
            .getOne();

        if (!bookBorrower) {
            return next(new HttpException(400, 'Book is not checked out by this borrower'));
        }

        bookBorrower.returnDate = addHours(new Date(), 1); // Set returnDate to the current date (e.g., 1 hour from now for timezone)
        await this.bookBorrowerRepository.save(bookBorrower);

        book.quantity += 1;
        await this.bookRepository.save(book);
        response.send('Book returned successfully');
    } catch (error) {
        console.log(error);
        next(error);
    }
};


    /**
     * Retrieves a list of checked out books along with their borrowers' details.
     * 
     * @param request - The HTTP request object.
     * @param response - The HTTP response object.
     * @param next - The next middleware function.
     * @returns A list of checked out books with their borrowers' details.
     */
    private getCheckedOutBooks = async (request: Request, response: Response, next: NextFunction) => {
        try {
        const checkedOutBooks = await this.bookBorrowerRepository
            .createQueryBuilder("bookBorrower")
            .leftJoinAndSelect("bookBorrower.book", "book")
            .leftJoinAndSelect("bookBorrower.borrower", "borrower")
            .where("bookBorrower.returnDate IS NULL")
            .getMany();

        // Group borrowers by book
        const result = checkedOutBooks.reduce((acc, bookBorrower) => {
            const bookName = bookBorrower.book.title; // Assuming book has a 'title' field
            const bookId = bookBorrower.book.id; // Assuming book has an 'id' field
            
            // Extract borrower details
            const borrowerDetails = {
                id: bookBorrower.borrower.id, // Assuming borrower has an 'id' field
                name: bookBorrower.borrower.name, // Assuming borrower has a 'name' field
                email: bookBorrower.borrower.email || null, // Assuming borrower has an 'email' field
                phone: bookBorrower.borrower.phone || null, // Assuming borrower has a 'phone' field
                borrowDate: bookBorrower.borrowDate, // Assuming bookBorrower has a 'borrowDate' field
                dueDate: bookBorrower.dueDate, // Assuming bookBorrower has a 'dueDate' field
            };

            // If the book is not in the accumulator, add it
            if (!acc[bookId]) {
                acc[bookId] = {
                    bookId: bookId, // Include book ID in the result
                    bookTitle: bookName, // Include book title
                    borrowers: [] // Initialize empty borrowers array
                };
            }

            // Add the borrower's details to the book's borrower list
            acc[bookId].borrowers.push(borrowerDetails);
            return acc;
        }, {});

        response.send(Object.values(result));
    } catch (error) {
        console.log(error);
        next(error);
    }
};

    /**
     * Retrieves a list of books checked out by a borrower.
     * 
     * @param request - The HTTP request object.
     * @routeparam borrowerId - The ID of the borrower.
     * @param response - The HTTP response object.
     * @param next - The next middleware function.
     * @returns A list of books checked out by the borrower.
     * @throws NotFoundException if the borrower is not found.
     * @throws HttpException if the borrower has no checked out books.
     */
    private getBorrowerCheckedOutBooks = async (request: Request, response: Response, next: NextFunction) => {
        try {
        const borrowerId = request.params.borrowerId;
        const borrower = await this.borrowerRepository.findOne({
            where: { id: borrowerId },
        });

        if (!borrower) {
            throw new NotFoundException(`Borrower with ID ${borrowerId} not found`);
        }

        const checkedOutBooks = await this.bookBorrowerRepository
            .createQueryBuilder("bookBorrower")
            .leftJoinAndSelect("bookBorrower.book", "book")
            .leftJoinAndSelect("bookBorrower.borrower", "borrower")
            .where("bookBorrower.borrowerId = :borrowerId", { borrowerId })
            .andWhere("bookBorrower.returnDate IS NULL")
            .getMany();

        const result = checkedOutBooks.map(bookBorrower => {
            return {
                bookId: bookBorrower.book.id, // Assuming book has an 'id' field
                bookTitle: bookBorrower.book.title, // Assuming book has a 'title' field
                borrowDate: bookBorrower.borrowDate, // Assuming bookBorrower has a 'borrowDate' field
                dueDate: bookBorrower.dueDate, // Assuming bookBorrower has a 'dueDate' field
            };
        });

        response.send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

    /**
     * Retrieves a list of books that are overdue.
     * 
     * @param request - The HTTP request object.
     * @param response - The HTTP response object.
     * @param next - The next middleware function.
     * @returns A list of overdue books.
     */
    private getOverdueBooks = async (request: Request, response: Response, next: NextFunction) => {
        try {
        const overdueBooks = await this.bookBorrowerRepository
            .createQueryBuilder("bookBorrower")
            .leftJoinAndSelect("bookBorrower.book", "book")
            .leftJoinAndSelect("bookBorrower.borrower", "borrower")
            .where("bookBorrower.returnDate IS NULL")
            .andWhere("bookBorrower.dueDate < :currentDate", { currentDate: addHours(new Date(), 1) }) // Check if dueDate is before the current date
            .getMany();

        const result = overdueBooks.map(bookBorrower => {
            return {
                bookId: bookBorrower.book.id, // Assuming book has an 'id' field
                bookTitle: bookBorrower.book.title, // Assuming book has a 'title' field
                borrowerId: bookBorrower.borrower.id, // Assuming borrower has an 'id' field
                borrowerName: bookBorrower.borrower.name, // Assuming borrower has a 'name' field
                borrowDate: bookBorrower.borrowDate, // Assuming bookBorrower has a 'borrowDate' field
                dueDate: bookBorrower.dueDate, // Assuming bookBorrower has a 'dueDate' field
            };
        });

        response.send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

    /**
     * Exports borrowing data to a file.
     * 
     * @param request - The HTTP request object.
     * @bodyparam dateFrom - The start date for the borrowing data.
     * @bodyparam dateTo - The end date for the borrowing data.
     * @bodyparam format - The format of the exported file (csv or xlsx).
     * @param response - The HTTP response object.
     * @param next - The next middleware function.
     * @returns A CSV file containing borrowing data.
     */
    private exportBorrowingData = async (request: Request, response: Response, next: NextFunction) => {
        try {
        const {dateFrom, dateTo, format} = request.body; 
        const borrowingData = await this.bookBorrowerRepository
            .createQueryBuilder("bookBorrower")
            .leftJoinAndSelect("bookBorrower.book", "book")
            .leftJoinAndSelect("bookBorrower.borrower", "borrower")
            .where("bookBorrower.borrowDate >= :dateFrom", { dateFrom })
            .andWhere("bookBorrower.borrowDate <= :dateTo", { dateTo })
            .getMany();

        // Format borrowing data as CSV
        if (format === 'csv') {
            this.exportToCsv(borrowingData, response);
        } else if (format === 'xlsx') {
            this.exportToXlsx(borrowingData, response);
        }
        else {
            throw new HttpException(400, 'Invalid format. Please specify either "csv" or "xlsx"');
        }
        
    } catch (error) {
        console.log(error);
        next(error);
    }
};

    /**
     * Exports borrowing data for the last month to a file.
     * 
     * @param request - The HTTP request object.
     * @queryparam type - The type of borrowing data to export (overdue or all).
     * @queryparam format - The format of the exported file (csv or xlsx).
     * @param response - The HTTP response object.
     * @param next - The next middleware function.
     * @returns A CSV or XLSX file containing borrowing data for the last month.
     */
    private exportLastMonth = async (request: Request, response: Response, next: NextFunction) => {
        try {
        const { type, format } = request.query;
        const now = addHours(new Date(), 1); // Start date is 1 hour from now
        const lastMonth = addHours(new Date(), 1); // End date is the current date
        lastMonth.setMonth(now.getMonth() - 1);
        let borrowingData: BookBorrower[];
        if (type === 'overdue') {
            // Using QueryBuilder to fetch overdue records from the last month
            borrowingData = await this.bookBorrowerRepository.createQueryBuilder('bookBorrower')
                .leftJoinAndSelect('bookBorrower.book', 'book')
                .leftJoinAndSelect('bookBorrower.borrower', 'borrower')
                .where('bookBorrower.dueDate < :now', { now }) // Due date is in the past
                .andWhere('bookBorrower.dueDate >= :lastMonth', { lastMonth }) // Due date is within the last month
                .andWhere('bookBorrower.returnDate IS NULL') // Not yet returned
                .getMany();
        } else if (type === 'all') {
            // Using QueryBuilder to fetch all records from the last month
            borrowingData = await this.bookBorrowerRepository.createQueryBuilder('bookBorrower')
                .leftJoinAndSelect('bookBorrower.book', 'book')
                .leftJoinAndSelect('bookBorrower.borrower', 'borrower')
                .where('bookBorrower.borrowDate BETWEEN :lastMonth AND :now', { lastMonth, now })
                .getMany();
        }
        else {
            throw new HttpException(400, 'Invalid type. Please specify either "overdue" or "all"');
        }

        // Format borrowing data as CSV or XLSX
        if (format === 'csv') {
            this.exportToCsv(borrowingData, response);
        } else if (format === 'xlsx') {
            this.exportToXlsx(borrowingData, response);
        } else {
            throw new HttpException(400, 'Invalid format. Please specify either "csv" or "xlsx"');
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

private exportToCsv(borrowingData: any[], response: Response) 
{
    const csvData = borrowingData.map(bookBorrower => {
        return [
            bookBorrower.book.title, // Assuming book has a 'title' field
            bookBorrower.borrower.name, // Assuming borrower has a 'name' field
            bookBorrower.borrower.email || 'N/A', // Assuming borrower has an 'email' field
            bookBorrower.borrower.phone || 'N/A', // Assuming borrower has a 'phone
            bookBorrower.borrowDate, // Assuming bookBorrower has a 'borrowDate' field
            bookBorrower.dueDate, // Assuming bookBorrower has a 'dueDate' field
            bookBorrower.returnDate || 'Not Returned Yet', // Assuming bookBorrower has a 'returnDate' field
        ].join(',');
    });

    // Add headers to CSV
    const csv = [
        'Book Title, Borrower Name, Borrower Email, Borrower Phone, Borrow Date, Due Date, Return Date',
        ...csvData,
    ].join('\n');

    // Set response headers
    response.setHeader('Content-Type', 'text/csv');
    response.setHeader('Content-Disposition', 'attachment; filename=borrowing-data.csv');
    response.send(csv);
}

private async exportToXlsx(borrowingData: any[], response: Response) {
    // Implement exporting to XLSX here
    try {
        console.log(borrowingData)
        // Create a new ExcelJS Workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Borrow Records');

        // Add column headers
        worksheet.addRow([
            'Book Title', 
            'Borrower Name', 
            'Borrower Email', 
            'Borrower Phone', 
            'Borrow Date', 
            'Due Date', 
            'Return Date'
        ]);

        // Add data rows
        borrowingData.forEach(record => {
            worksheet.addRow([
                record.book.title,
                record.borrower.name,
                record.borrower.email,
                record.borrower.phone || 'N/A',
                record.borrowDate,
                record.dueDate,
                record.returnDate || 'Not Returned Yet',
            ]);
        });

        // Write the XLSX file to the response
        response.setHeader('Content-Disposition', 'attachment; filename=borrow_records.xlsx');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
        // Send the buffer as response
        const buffer = workbook.xlsx.writeBuffer();
        response.send(await buffer);
    } catch (err) {
        throw new HttpException(500, 'Error exporting data to XLSX');
    }
};

}