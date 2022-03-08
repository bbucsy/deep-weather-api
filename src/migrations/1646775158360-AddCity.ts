import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCity1646775158360 implements MigrationInterface {
  name = 'AddCity1646775158360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "city" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "lon" integer NOT NULL, "lat" integer NOT NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "city"`);
  }
}
