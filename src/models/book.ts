// src/models/Book.js
import { Entity, Column, BeforeInsert, OneToMany, Index } from 'typeorm';
import BaseEntity from './baseEntity';
import { BookBorrower } from './bookBorrower';
@Entity('books')
@Index(['title'])
@Index(['author'])
@Index(['ISBN'])
export class Book extends BaseEntity {

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false})
  author: string;

  @Column({ type: 'varchar', length: 13, unique: true, nullable: true })
  ISBN: string;

  @Column({ type: 'int', default: 0, nullable: false })
  quantity: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  shelfLocation: string;

  @BeforeInsert()
  generateISBN() {
    this.ISBN = generateValidISBN(); // Call the ISBN generation logic
  }

  @OneToMany(() => BookBorrower, bookBorrower => bookBorrower.book)
  bookBorrowers: BookBorrower[];
}

// Function to generate an ISBN number
function generateValidISBN(): string {
  // Some logic to generate a valid ISBN
  return '978' + Math.floor(Math.random() * 1000000000000).toString();
}

