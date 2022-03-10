import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActiveColumn1646931214743 implements MigrationInterface {
  name = 'AddActiveColumn1646931214743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_neural_model" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "file_path" varchar NOT NULL, "epochs" integer NOT NULL, "hiddenLayerCount" integer NOT NULL, "lstm_count" integer NOT NULL, "ready" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_f892314596e92530cd8c8286dbf" UNIQUE ("file_path"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_neural_model"("id", "file_path", "epochs", "hiddenLayerCount") SELECT "id", "file_path", "epochs", "hiddenLayerCount" FROM "neural_model"`,
    );
    await queryRunner.query(`DROP TABLE "neural_model"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_neural_model" RENAME TO "neural_model"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "neural_model" RENAME TO "temporary_neural_model"`,
    );
    await queryRunner.query(
      `CREATE TABLE "neural_model" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "file_path" varchar NOT NULL, "epochs" integer NOT NULL, "hiddenLayerCount" integer NOT NULL, CONSTRAINT "UQ_f892314596e92530cd8c8286dbf" UNIQUE ("file_path"))`,
    );
    await queryRunner.query(
      `INSERT INTO "neural_model"("id", "file_path", "epochs", "hiddenLayerCount") SELECT "id", "file_path", "epochs", "hiddenLayerCount" FROM "temporary_neural_model"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_neural_model"`);
  }
}
