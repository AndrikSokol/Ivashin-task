import { dbName, dbVersion } from "../constants/db";

export class IndexedDB {
  private static idb = window.indexedDB;

  static createCollectionsInIndexedDB = () => {
    if (!this.idb) {
      console.log("browser doesnt support IndexedDB");
    }

    const request = this.idb.open(dbName, dbVersion);

    request.onerror = (event) => {
      console.error(`Error opening database: ${event}`);
    };

    request.onsuccess = () => {
      const db = request.result;
      console.log("Database opened successfully!", db);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore("notes", {
        keyPath: "id",
        autoIncrement: true,
      });
    };
  };
}
