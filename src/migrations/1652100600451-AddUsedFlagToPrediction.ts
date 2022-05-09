import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsedFlagToPrediction1652100600451
  implements MigrationInterface
{
  name = 'AddUsedFlagToPrediction1652100600451';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'), "github" boolean NOT NULL DEFAULT (0), "email" varchar NOT NULL, CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"), CONSTRAINT "UQ_a910499886dc3d020ee3263dc9b" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "name", "passwordHash", "role", "github", "email") SELECT "id", "name", "passwordHash", "role", "github", "email" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_prediction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "result" integer NOT NULL, "modelId" integer, "input" varchar NOT NULL, "prediction_time" integer NOT NULL DEFAULT (0), "used_in_trining" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_3bdf37ea6ae9c4b1b71ea687f0b" FOREIGN KEY ("modelId") REFERENCES "neural_model" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_prediction"("id", "result", "modelId", "input", "prediction_time") SELECT "id", "result", "modelId", "input", "prediction_time" FROM "prediction"`,
    );
    await queryRunner.query(`DROP TABLE "prediction"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_prediction" RENAME TO "prediction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'), "github" boolean NOT NULL DEFAULT (0), "email" varchar NOT NULL, CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"), CONSTRAINT "UQ_a910499886dc3d020ee3263dc9b" UNIQUE ("name"))`,
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
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'), "github" boolean NOT NULL DEFAULT (0), "email" varchar NOT NULL, CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"), CONSTRAINT "UQ_a910499886dc3d020ee3263dc9b" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "name", "passwordHash", "role", "github", "email") SELECT "id", "name", "passwordHash", "role", "github", "email" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(
      `ALTER TABLE "prediction" RENAME TO "temporary_prediction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "prediction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "result" integer NOT NULL, "modelId" integer, "input" varchar NOT NULL, "prediction_time" integer NOT NULL DEFAULT (0), CONSTRAINT "FK_3bdf37ea6ae9c4b1b71ea687f0b" FOREIGN KEY ("modelId") REFERENCES "neural_model" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "prediction"("id", "result", "modelId", "input", "prediction_time") SELECT "id", "result", "modelId", "input", "prediction_time" FROM "temporary_prediction"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_prediction"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'), "github" boolean NOT NULL DEFAULT (0), "email" varchar NOT NULL, CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"), CONSTRAINT "UQ_a910499886dc3d020ee3263dc9b" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "name", "passwordHash", "role", "github", "email") SELECT "id", "name", "passwordHash", "role", "github", "email" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
  }
}
