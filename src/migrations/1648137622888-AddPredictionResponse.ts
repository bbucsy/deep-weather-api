import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPredictionResponse1648137622888 implements MigrationInterface {
  name = 'AddPredictionResponse1648137622888';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "prediction_response" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "response" integer NOT NULL, "predictionId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_prediction_response" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "response" integer NOT NULL, "predictionId" integer, CONSTRAINT "FK_186322492f91d6e3d93517db0b8" FOREIGN KEY ("predictionId") REFERENCES "prediction" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_prediction_response"("id", "response", "predictionId") SELECT "id", "response", "predictionId" FROM "prediction_response"`,
    );
    await queryRunner.query(`DROP TABLE "prediction_response"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_prediction_response" RENAME TO "prediction_response"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prediction_response" RENAME TO "temporary_prediction_response"`,
    );
    await queryRunner.query(
      `CREATE TABLE "prediction_response" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "response" integer NOT NULL, "predictionId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "prediction_response"("id", "response", "predictionId") SELECT "id", "response", "predictionId" FROM "temporary_prediction_response"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_prediction_response"`);
    await queryRunner.query(`DROP TABLE "prediction_response"`);
  }
}
