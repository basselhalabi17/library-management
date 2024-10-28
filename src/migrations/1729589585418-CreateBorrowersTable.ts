import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBorrowersTable1729589585418 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'borrowers',
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
                    name: 'name',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true,
                    isNullable: false
                },
                {
                    name: 'phone',
                    type: 'varchar',
                    isNullable: true
                }

            ]
    }));
}

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('borrowers');
    }

}
