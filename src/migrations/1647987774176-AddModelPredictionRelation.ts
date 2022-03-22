import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddModelPredictionRelation1647987774176
  implements MigrationInterface
{
  name = 'AddModelPredictionRelation1647987774176';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_prediction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "result" integer NOT NULL, "modelId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_prediction"("id", "result") SELECT "id", "result" FROM "prediction"`,
    );
    await queryRunner.query(`DROP TABLE "prediction"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_prediction" RENAME TO "prediction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_prediction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "result" integer NOT NULL, "modelId" integer, CONSTRAINT "FK_3bdf37ea6ae9c4b1b71ea687f0b" FOREIGN KEY ("modelId") REFERENCES "neural_model" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_prediction"("id", "result", "modelId") SELECT "id", "result", "modelId" FROM "prediction"`,
    );
    await queryRunner.query(`DROP TABLE "prediction"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_prediction" RENAME TO "prediction"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prediction" RENAME TO "temporary_prediction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "prediction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "result" integer NOT NULL, "modelId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "prediction"("id", "result", "modelId") SELECT "id", "result", "modelId" FROM "temporary_prediction"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_prediction"`);
    await queryRunner.query(
      `ALTER TABLE "prediction" RENAME TO "temporary_prediction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "prediction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "result" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "prediction"("id", "result") SELECT "id", "result" FROM "temporary_prediction"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_prediction"`);
  }
}
