module.exports = {
  type: 'sqlite',
  database: 'dev.db',
  migrations: ['dist/migrations/*{.ts,.js}'],
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
  synchronize: false,
};
