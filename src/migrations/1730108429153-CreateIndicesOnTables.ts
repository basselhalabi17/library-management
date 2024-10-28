import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIndicesOnTables1730108429153 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE INDEX "IDX_Books_title" ON "books" ("title")');
        await queryRunner.query('CREATE INDEX "IDX_Books_author" ON "books" ("author")');
        await queryRunner.query('CREATE INDEX "IDX_Books_ISBN" ON "books" ("ISBN")');
        await queryRunner.query('CREATE INDEX "IDX_BookBorrowers_book_id" ON "bookBorrowers" ("bookId")');
        await queryRunner.query('CREATE INDEX "IDX_BookBorrowers_borrower_id" ON "bookBorrowers" ("borrowerId")');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "IDX_Books_title"');
        await queryRunner.query('DROP INDEX "IDX_Books_author"');
        await queryRunner.query('DROP INDEX "IDX_Books_ISBN"');
        await queryRunner.query('DROP INDEX "IDX_BookBorrowers_book_id"');
        await queryRunner.query('DROP INDEX "IDX_BookBorrowers_borrower_id"');
    }

}
