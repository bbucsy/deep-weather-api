import {MigrationInterface, QueryRunner} from "typeorm";

export class SaveInputOfPrediction1647988007455 implements MigrationInterface {
    name = 'SaveInputOfPrediction1647988007455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_prediction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "result" integer NOT NULL, "modelId" integer, "input" varchar NOT NULL, CONSTRAINT "FK_3bdf37ea6ae9c4b1b71ea687f0b" FOREIGN KEY ("modelId") REFERENCES "neural_model" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_prediction"("id", "result", "modelId") SELECT "id", "result", "modelId" FROM "prediction"`);
        await queryRunner.query(`DROP TABLE "prediction"`);
        await queryRunner.query(`ALTER TABLE "temporary_prediction" RENAME TO "prediction"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prediction" RENAME TO "temporary_prediction"`);
        await queryRunner.query(`CREATE TABLE "prediction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "result" integer NOT NULL, "modelId" integer, CONSTRAINT "FK_3bdf37ea6ae9c4b1b71ea687f0b" FOREIGN KEY ("modelId") REFERENCES "neural_model" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "prediction"("id", "result", "modelId") SELECT "id", "result", "modelId" FROM "temporary_prediction"`);
        await queryRunner.query(`DROP TABLE "temporary_prediction"`);
    }

}
