import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, BeforeInsert, Index } from 'typeorm';
import { Book } from './book';
import { Borrower } from './borrower';
import { addMinutes, addHours } from 'date-fns';

@Entity('bookBorrowers')
@Index(['bookId'])
@Index(['borrowerId'])
export class BookBorrower {
    // Add properties for the BookBorrower entity
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    bookId: string;

    @Column({nullable: false})
    borrowerId: string;

    // For example, `borrowDate` and `returnDate`
    @Column({ type: 'timestamp', precision: 6, nullable: false })
    borrowDate: Date;

    @Column({ type: 'timestamp', precision: 6, nullable: false})
    dueDate: Date;

    @Column({ type: 'timestamp', precision: 6, nullable: true })
    returnDate: Date;

    // Define the relationship with the Book entity
    // For example, a Many-to-One relationship with the Book entity
    @ManyToOne(() => Book, book => book.bookBorrowers, { onDelete: 'CASCADE' })
    book: Book;

    // Define the relationship with the Borrower entity
    // For example, a Many-to-One relationship with the Borrower entity
    @ManyToOne(() => Borrower, borrower => borrower.bookBorrowers, { onDelete: 'CASCADE' })
    borrower: Borrower;

    @BeforeInsert()
    setBorrowAndDueDate() {
        const borrowingPeriodInMinutes = 3; // 7 days
        const now = new Date(); // Current date and time
        this.borrowDate = addHours(now, 1); // Set borrowDate to the current date (e.g., 1 hour from now for timezone)
        this.dueDate = addMinutes(this.borrowDate, borrowingPeriodInMinutes); // Calculate dueDate
    }

}