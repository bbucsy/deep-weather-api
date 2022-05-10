import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyTrainingDataEntity1652175327963
  implements MigrationInterface
{
  name = 'ModifyTrainingDataEntity1652175327963';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_training_data" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "epoch" integer NOT NULL, "accuracy" double NOT NULL, "loss" double NOT NULL, "modelId" integer, "created" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_86a43bbcb26dec64ba51a23a9e8" FOREIGN KEY ("modelId") REFERENCES "neural_model" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
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
      `CREATE TABLE "training_data" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "epoch" integer NOT NULL, "accuracy" double NOT NULL, "loss" double NOT NULL, "modelId" integer, CONSTRAINT "FK_86a43bbcb26dec64ba51a23a9e8" FOREIGN KEY ("modelId") REFERENCES "neural_model" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "training_data"("id", "epoch", "accuracy", "loss", "modelId") SELECT "id", "epoch", "accuracy", "loss", "modelId" FROM "temporary_training_data"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_training_data"`);
  }
}
