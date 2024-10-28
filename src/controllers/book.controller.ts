import { Router, Request, Response, NextFunction } from 'express';
import { Book } from '../models/book';
import AppDataSource from '../config/db';
import NotFoundException from '../exceptions/not-found-exception';
import { Like } from 'typeorm';
import { CreateBookDto } from '../dto/book-dto';
import validateDto from '../middleware/validation.middleware';
import limiter from '../middleware/rate-limiter.middleware';

export class BookController {
    public path = '/books';
    public router: Router = Router();

    private bookRepository = AppDataSource.getRepository(Book);

    constructor() {
        this.initializeRoutes();
    }

    /**
     * Initializes the routes for the BookController.
     * 
     * @remarks
     * This method sets up the HTTP routes for handling book-related operations.
     */
    private initializeRoutes() {
        this.router.get(this.path, limiter, this.getAllBooks);
        this.router.get(`${this.path}/search`, limiter, this.searchBooks);
        this.router.post(this.path, validateDto(CreateBookDto), this.createBook);
        this.router.patch(`${this.path}/:id`, this.updateBook);
        this.router.delete(`${this.path}/:id`, this.deleteBook);
    }

    /**
     * Get all books.
     * 
     * @param request - The HTTP request.
     * @param response - The HTTP response.
     * @param next - The next middleware function.
     * @returns All books.
     */
    private getAllBooks = async (request: Request, response: Response, next: NextFunction) => {
        try {
            console.log('Getting all books');
            const books = await this.bookRepository.find();
            response.send(books);
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    /**
     * Search books based on title, author, and ISBN.
     * 
     * @param request - The HTTP request.
     * @param response - The HTTP response.
     * @routeparam title - The title of the book. (Optional)
     * @routeparam author - The author of the book. (Optional)
     * @routeparam ISBN - The ISBN of the book. (Optional)
     * @param next - The next middleware function.
     * @returns The books matching any of the search criteria.
     */
    private searchBooks = async (request: Request, response: Response, next: NextFunction) => {
        const { title, author, ISBN } = request.query;

        try {
            const whereConditions: any[] = [];

            // Add conditions based on provided query parameters
            if (title) {
                whereConditions.push({ title: Like(`%${title}%`) }); // Use Like for partial matching
            }

            if (author) {
                whereConditions.push({ author: Like(`%${author}%`) });
            }

            if (ISBN) {
                whereConditions.push({ ISBN: ISBN });
            }

            // Use the find method with the where option
            const books = await this.bookRepository.find({
                where: whereConditions,
            });

            if (books.length === 0) {
                throw new NotFoundException('No books found matching the search criteria.');
            }
            response.status(200).json(books);
        } catch (error) {
            console.log(error);
            next(error);
        }

    };

    /**
     * Create a new book.
     * 
     * @param request - The HTTP request.
     * @bodyparam {CreateBookDto} - The book data.
     * @param response - The HTTP response.
     * @param next - The next middleware function.
     * @returns The newly created book.
     */
    private createBook = async (request: Request, response: Response, next: NextFunction) => {
        try {
            console.log('this is the request body: ', request.body);
            const newBook = this.bookRepository.create(request.body);
            const result = await this.bookRepository.save(newBook);
            response.status(201).send(result);
        }
        catch (error) {
            console.log(error);
            next(error)
        }
    };

    /**
     * Update a book by ID.
     * 
     * @param request - The HTTP request.
     * @routeparam id - The ID of the book.
     * @param response - The HTTP response.
     * @param next - The next middleware function.
     * @returns The updated book.
     */
    private updateBook = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id;
            console.log(id);
            const book = await this.bookRepository.findOne({
                where: { id: id }
            });
            if (!book) throw new NotFoundException(`Book with id ${id} not found`);
            const { title, author, ISBN, quantity, shelfLocation } = request.body;

            // Update the book
            await this.bookRepository.update(id, { title, author, ISBN, quantity, shelfLocation });

            // Merge the updates into the existing book object
            const updatedBook = {
                ...book,
                title: title ?? book.title,
                author: author ?? book.author,
                ISBN: ISBN ?? book.ISBN,
                quantity: quantity ?? book.quantity,
                shelfLocation: shelfLocation ?? book.shelfLocation
            };
            response.send(updatedBook);
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    /**
     * Delete a book by ID.
     * 
     * @param request - The HTTP request.
     * @routeparam id - The ID of the book.
     * @param response - The HTTP response.
     * @param next - The next middleware function.
     * @returns A 204 response.
     */
    private deleteBook = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id;
            const book = await this.bookRepository.findOne({
                where: { id: id }
            });
            if (!book) throw new NotFoundException(`Book with id ${id} not found`);
            await this.bookRepository.delete(id);
            response.status(204).end();
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
}