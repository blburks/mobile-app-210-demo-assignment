import * as SQLite from "expo-sqlite";

const DB_NAME = "task.db";
const DB_VERSION = 1;

export const db = SQLite.openDatabase(DB_NAME);

export function migrateDatabase() {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT
      );`,
    );

    tx.executeSql(
      `SELECT value FROM meta WHERE key = 'db_version';`,
      [],
      (_, result) => {
        const row = result.rows.length ? result.rows.item(0) : null;
        const oldVersion = row ? parseInt(row.value, 10) : 0;

        if (oldVersion < 1) {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS tasks (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             title TEXT NOT NULL,
             isComplete INTEGER NOT NULL DEFAULT 0,
             createdAt TEXT NOT NULL
           );`,
          );
        }

        if (oldVersion < DB_VERSION) {
          tx.executeSql(
            `INSERT OR REPLACE INTO meta (key, value)
             VALUES ('db_version', ?);`,
            [String(DB_VERSION)],
          );
        }
      },
    );
  });
}
