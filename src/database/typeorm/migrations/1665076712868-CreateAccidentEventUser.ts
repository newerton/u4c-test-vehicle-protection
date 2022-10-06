import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateAccidentEventUser1665076712868
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accident_event_user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'accident_event_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            default: null,
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'accident_event_user',
      new TableForeignKey({
        name: 'fk-accident_event_user-accident_event_id',
        columnNames: ['accident_event_id'],
        referencedTableName: 'accident_event',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'accident_event_user',
      new TableForeignKey({
        name: 'fk-accident_event_user-user_id',
        columnNames: ['user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'accident_event_user',
      new TableIndex({
        name: 'idx-accident_event_user-user_id',
        columnNames: ['user_id'],
        parser: 'btree',
      }),
    );

    await queryRunner.createIndex(
      'accident_event_user',
      new TableIndex({
        name: 'idx-accident_event_user-accident_event_id',
        columnNames: ['accident_event_id'],
        parser: 'btree',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accident_event_user');
  }
}
