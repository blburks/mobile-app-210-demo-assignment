import db from "./db";

// CREATE
export function createTask(title) {
  return new Promise((resolve, reject) => {
    const createdAt = new Date().toISOString();

    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO tasks (title, isComplete, createdAt)
         VALUES (?, 0, ?);`,
        [title, createdAt],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error),
      );
    });
  });
}

// READ
export function getAllTasks() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM tasks ORDER BY createdAt DESC;`,
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error),
      );
    });
  });
}

// UPDATE
export function updateTask(id, updates) {
  return new Promise((resolve, reject) => {
    const { title, isComplete } = updates;

    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE tasks
         SET title = ?, isComplete = ?
         WHERE id = ?;`,
        [title, isComplete ? 1 : 0, id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error),
      );
    });
  });
}

// DELETE
export function deleteTask(id) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM tasks WHERE id = ?;`,
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, error) => reject(error),
      );
    });
  });
}
