import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorUserModel1651435891682 implements MigrationInterface {
  name = 'RefactorUserModel1651435891682';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'), "github" boolean NOT NULL DEFAULT (0), "email" varchar NOT NULL, CONSTRAINT "UQ_a910499886dc3d020ee3263dc9b" UNIQUE ("name"), CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "name", "passwordHash", "role", "github") SELECT "id", "name", "passwordHash", "role", "github" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'), "github" boolean NOT NULL DEFAULT (0), "email" varchar NOT NULL, CONSTRAINT "UQ_a910499886dc3d020ee3263dc9b" UNIQUE ("name"), CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "name", "passwordHash", "role", "github", "email") SELECT "id", "name", "passwordHash", "role", "github", "email" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'), "github" boolean NOT NULL DEFAULT (0), "email" varchar NOT NULL, CONSTRAINT "UQ_a910499886dc3d020ee3263dc9b" UNIQUE ("name"), CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "name", "passwordHash", "role", "github", "email") SELECT "id", "name", "passwordHash", "role", "github", "email" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'), "github" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_a910499886dc3d020ee3263dc9b" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "name", "passwordHash", "role", "github") SELECT "id", "name", "passwordHash", "role", "github" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
  }
}
