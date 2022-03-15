import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAcuracyToModel1647366979764 implements MigrationInterface {
    name = 'AddAcuracyToModel1647366979764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_neural_model" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "file_path" varchar NOT NULL, "epochs" integer NOT NULL, "hiddenLayerCount" integer NOT NULL, "lstm_count" integer NOT NULL, "status" integer NOT NULL DEFAULT (0), "cityId" integer, "name" varchar NOT NULL, "accuracy" float NOT NULL DEFAULT (0), CONSTRAINT "UQ_f892314596e92530cd8c8286dbf" UNIQUE ("file_path"), CONSTRAINT "FK_8cd7d84eaf6d293af78630a17c7" FOREIGN KEY ("cityId") REFERENCES "city" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_neural_model"("id", "file_path", "epochs", "hiddenLayerCount", "lstm_count", "status", "cityId", "name") SELECT "id", "file_path", "epochs", "hiddenLayerCount", "lstm_count", "status", "cityId", "name" FROM "neural_model"`);
        await queryRunner.query(`DROP TABLE "neural_model"`);
        await queryRunner.query(`ALTER TABLE "temporary_neural_model" RENAME TO "neural_model"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "passwordHash" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "name") SELECT "id", "name" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "user"("id", "name") SELECT "id", "name" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "neural_model" RENAME TO "temporary_neural_model"`);
        await queryRunner.query(`CREATE TABLE "neural_model" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "file_path" varchar NOT NULL, "epochs" integer NOT NULL, "hiddenLayerCount" integer NOT NULL, "lstm_count" integer NOT NULL, "status" integer NOT NULL DEFAULT (0), "cityId" integer, "name" varchar NOT NULL, CONSTRAINT "UQ_f892314596e92530cd8c8286dbf" UNIQUE ("file_path"), CONSTRAINT "FK_8cd7d84eaf6d293af78630a17c7" FOREIGN KEY ("cityId") REFERENCES "city" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "neural_model"("id", "file_path", "epochs", "hiddenLayerCount", "lstm_count", "status", "cityId", "name") SELECT "id", "file_path", "epochs", "hiddenLayerCount", "lstm_count", "status", "cityId", "name" FROM "temporary_neural_model"`);
        await queryRunner.query(`DROP TABLE "temporary_neural_model"`);
    }

}
