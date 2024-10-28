import { Entity, Column, OneToMany } from 'typeorm';
import BaseEntity from './baseEntity';
import { BookBorrower } from './bookBorrower';

@Entity('borrowers')
export class Borrower extends BaseEntity {

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @OneToMany(() => BookBorrower, bookBorrower => bookBorrower.borrower)
  bookBorrowers: BookBorrower[];

}