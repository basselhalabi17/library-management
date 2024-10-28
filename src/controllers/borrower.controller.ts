import { Router, Request, Response, NextFunction } from 'express';
import AppDataSource from '../config/db';
import { Borrower } from '../models/borrower';
import NotFoundException from '../exceptions/not-found-exception';
import validateDto from '../middleware/validation.middleware';
import { CreateBorrowerDto } from '../dto/borrower-dto';

/**
 * Controller class for managing borrowers.
 */
export class BorrowerController {
    public path = '/borrowers';
    public router = Router();

    private borrowerRepository = AppDataSource.getRepository(Borrower);

    constructor() {
        this.initializeRoutes();
    }
    
    /**
     * Initializes the routes for the borrower controller.
     */
    private initializeRoutes() {
        this.router.get(this.path, this.getAllBorrowers);
        this.router.post(this.path, validateDto(CreateBorrowerDto), this.createBorrower);
        this.router.patch(`${this.path}/:id`, this.updateBorrower);
        this.router.delete(`${this.path}/:id`, this.deleteBorrower);
    }

    /**
     * Get all borrowers.
     * 
     * @param request - The HTTP request.
     * @param response - The HTTP response.
     * @param next - The next middleware function.
     * @returns All borrowers.
     */
    private getAllBorrowers = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const borrowers = await this.borrowerRepository.find();
            response.send(borrowers);
        }
        catch (error) {
            console.log(error.message);
            next(error);
        }

    };

    /**
     * Create a new borrower.
     * 
     * @param request - The HTTP request.
     * @bodyparam {CreateBorrowerDto} - The new borrower data.
     * @param response - The HTTP response.
     * @param next - The next middleware function.
     * @returns The newly created borrower.
     */
    private createBorrower = async (request: Request, response: Response, next: NextFunction) => {
        try {
            console.log(request.body);
            const borrower = this.borrowerRepository.create(request.body);
            const result = await this.borrowerRepository.save(borrower);
            response.send(result);
        }
        catch (error) {
            console.log(error);
            next(error)
        }
    }

    /**
     * Update a borrower by ID.
     * 
     * @param request - The HTTP request.
     * @routeparam id - The ID of the borrower.
     * @bodyparam {Partial<Borrower>} - The updated borrower data.
     * @param response - The HTTP response.
     * @param next - The next middleware function.
     * @returns The updated borrower.
     */
    private updateBorrower = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id;
            const borrower = await this.borrowerRepository.findOne({
                where: { id: id }
            });
            if (!borrower) throw new NotFoundException(`Borrower with ${id} not found`);
            else {
                const {name, email, phone} = request.body;
                await this.borrowerRepository.update(id, {name, email, phone});
                const updatedBorrower = {
                    ...borrower,
                    name: name ?? borrower.name,
                    email: email ?? borrower.email,
                    phone: phone ?? borrower.phone
                };
                response.send(updatedBorrower);
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    /**
     * Delete a borrower by ID.
     * 
     * @param request - The HTTP request.
     * @routeparam id - The ID of the borrower.
     * @param response - The HTTP response.
     * @param next - The next middleware function.
     * @returns 204 if successful.
     */
    private deleteBorrower = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id;
            const borrower = await this.borrowerRepository.findOne({
                where: { id: id }
            });
            if (!borrower) throw new NotFoundException(`Borrower with ${id} not found`);
            else {
                await this.borrowerRepository.delete(id);
                response.status(204).end();
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}