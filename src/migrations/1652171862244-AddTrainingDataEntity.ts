import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTrainingDataEntity1652171862244 implements MigrationInterface {
  name = 'AddTrainingDataEntity1652171862244';

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
      `CREATE TABLE "training_data" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "epoch" integer NOT NULL, "accuracy" double NOT NULL, "loss" double NOT NULL, "modelId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'), "github" boolean NOT NULL DEFAULT (0), "email" varchar NOT NULL, CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"), CONSTRAINT "UQ_a910499886dc3d020ee3263dc9b" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "name", "passwordHash", "role", "github", "email") SELECT "id", "name", "passwordHash", "role", "github", "email" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_training_data" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "epoch" integer NOT NULL, "accuracy" double NOT NULL, "loss" double NOT NULL, "modelId" integer, CONSTRAINT "FK_86a43bbcb26dec64ba51a23a9e8" FOREIGN KEY ("modelId") REFERENCES "neural_model" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_training_data"("id", "epoch", "accuracy", "loss", "modelId") SELECT "id", "epoch", "accuracy", "loss", "modelId" FROM "training_data"`,
    );
    await queryRunner.query(`DROP TABLE "training_data"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_training_data" RENAME TO "training_data"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "training_data" RENAME TO "temporary_training_data"`,
    );
    await queryRunner.query(
      `CREATE TABLE "training_data" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "epoch" integer NOT NULL, "accuracy" double NOT NULL, "loss" double NOT NULL, "modelId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "training_data"("id", "epoch", "accuracy", "loss", "modelId") SELECT "id", "epoch", "accuracy", "loss", "modelId" FROM "temporary_training_data"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_training_data"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('user'), "github" boolean NOT NULL DEFAULT (0), "email" varchar NOT NULL, CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"), CONSTRAINT "UQ_a910499886dc3d020ee3263dc9b" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "name", "passwordHash", "role", "github", "email") SELECT "id", "name", "passwordHash", "role", "github", "email" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(`DROP TABLE "training_data"`);
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
