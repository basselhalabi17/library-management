// Importing required modules
import env from './config/environment';
import express, { Request, Response } from 'express';
import AppDataSource from './config/db';
import { BookController } from './controllers/book.controller';
import { BorrowerController } from './controllers/borrower.controller';
import errorMiddleware from './middleware/error.middleware';
import { BookBorrowerController } from './controllers/book-borrower.controller';

// Creating an express app
class App {
    public app: express.Application;
    constructor(controllers: any[]) {
        this.app = express();
        this.connectDB();
        this.initializeSettings();
        this.initializeControllers(controllers);
        this.initializeErrorMiddleware();
    }

    private initializeControllers(controllers) {
        this.app.get('/', (req: Request, res: Response) => {
          res.send('Hello, World!');
        });
        // The other controllers here

        // Importing the BookController
        controllers.forEach((controller) => {
          this.app.use(controller.router);
        });

      }
    
      private initializeSettings() {
        this.app.use(express.json());
        // this.app.use(express.urlencoded({ extended: true }));
      }

      private initializeErrorMiddleware() {
        this.app.use(errorMiddleware);
      }
     private async connectDB() {
        try {
        await AppDataSource.initialize();
        console.log('Database connected successfully');
        await AppDataSource.runMigrations();
        } catch (error) {
            console.error('Error connecting to the database', error);
      }
    }

    listen() {
      this.app.listen(env.APP.PORT, () => {
          console.log(`Server running on port ${env.APP.PORT}`);
        });
      }
}

const app = new App(
  [
  new BookController(), 
  new BorrowerController(),
  new BookBorrowerController()
]);
app.listen();
// The app is now ready to be started