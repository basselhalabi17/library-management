import {DataSource} from 'typeorm';
import {Book} from '../models/book';
import {Borrower} from '../models/borrower';
import { BookBorrower } from '../models/bookBorrower';
import {CreateBooksTable1729523544579} from '../migrations/1729523544579-CreateBooksTable';
import { CreateBorrowersTable1729589585418 } from '../migrations/1729589585418-CreateBorrowersTable';
import { CreateBookBorrowerTableAndItsRelations1729939783300 } from '../migrations/1729939783300-CreateBookBorrowerTableAndItsRelations';
import { CreateIndicesOnTables1730108429153 } from '../migrations/1730108429153-CreateIndicesOnTables';
import env from '../config/environment';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: env.DB.HOST,
    port: 5432,
    username: env.DB.USER,
    password: env.DB.PASSWORD,
    database: env.DB.NAME,
    synchronize: false,
    // logging: true,
    entities: [
      Book,
      Borrower,
      BookBorrower
    ],
    migrations: [
      CreateBooksTable1729523544579,
      CreateBorrowersTable1729589585418,
      CreateBookBorrowerTableAndItsRelations1729939783300,
      CreateIndicesOnTables1730108429153,
    ],
  });
  
  export default AppDataSource;
