import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export default class CreateOrdersProducts1614325543736 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'orders_products',

      columns: [
        {
          name: 'id',
          type: 'uuid',
          generationStrategy: 'uuid',
          isPrimary: true,
          default: 'uuid_generate_v4()',
        },
        {
          name: 'price',
          type: 'decimal',
          precision: 10,
          scale: 2,
        },
        {
          name: 'quantity',
          type: 'int'
        },
        {
          name: 'order_id',
          type: 'uuid',
          isNullable: true,
        },
        {
          name: 'product_id',
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

    await queryRunner.createForeignKey('orders_products', new TableForeignKey({
      name: 'OrdersProductsOrder',
      columnNames: ['order_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'orders',
      onDelete: 'CASCADE',
    }))

    await queryRunner.createForeignKey('orders_products', new TableForeignKey({
      name: 'OrdersProductsProduct',
      columnNames: ['product_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'products',
      onDelete: 'CASCADE',
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('products', 'OrdersProductsProduct')
    await queryRunner.dropForeignKey('orders', 'OrdersProductsOrder')
    await queryRunner.dropTable('orders_products');
  }

}
