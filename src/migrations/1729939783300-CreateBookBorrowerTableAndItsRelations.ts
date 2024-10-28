import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBookBorrowerTableAndItsRelations1729939783300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "bookBorrowers",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "bookId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "borrowerId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "borrowDate",
                        type: "timestamp",
                        precision: 6,
                        isNullable: false,
                    },
                    {
                        name: "dueDate",
                        type: "timestamp",
                        precision: 6,
                        isNullable: false,
                    },
                    {
                        name: "returnDate",
                        type: "timestamp",
                        precision: 6,
                        isNullable: true,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["bookId"],
                        referencedTableName: "books",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    },
                    {
                        columnNames: ["borrowerId"],
                        referencedTableName: "borrowers",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("bookBorrowers");
    }

}
