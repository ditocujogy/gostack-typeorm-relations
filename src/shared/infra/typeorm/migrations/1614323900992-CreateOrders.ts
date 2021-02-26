import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export default class CreateOrders1614323900992 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'orders',

      columns: [
        {
          name: 'id',
          type: 'uuid',
          generationStrategy: 'uuid',
          isPrimary: true,
          default: 'uuid_generate_v4()',
        },
        {
          name: 'customer_id',
          type: 'uuid',
          isNullable: true,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()'
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ]
    }))

    await queryRunner.createForeignKey('orders', new TableForeignKey({
      name: 'OrdersCustomer',
      columnNames: ['customer_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'customers',
      onDelete: 'CASCADE',
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('orders', 'OrdersCustomer')
    await queryRunner.dropTable('orders');
  }

}
