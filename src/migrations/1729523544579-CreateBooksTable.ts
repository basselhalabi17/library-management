import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBooksTable1729523544579 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'books',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'title',
                    type: 'varchar',
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: 'author',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'ISBN',
                    type: 'varchar',
                    isUnique: true,
                    isNullable: true,
                },
                {
                    name: 'quantity',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'shelfLocation',
                    type: 'varchar',
                    isNullable: false,
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('books');
    }

}
