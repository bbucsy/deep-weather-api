import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleToUser1649798083794 implements MigrationInterface {
  name = 'AddRoleToUser1649798083794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "name", "passwordHash") SELECT "id", "name", "passwordHash" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'), CONSTRAINT "UQ_a910499886dc3d020ee3263dc9b" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "name", "passwordHash", "role") SELECT "id", "name", "passwordHash", "role" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "name", "passwordHash", "role") SELECT "id", "name", "passwordHash", "role" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "name", "passwordHash") SELECT "id", "name", "passwordHash" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
  }
}
