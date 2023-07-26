const dbName = "notes";
const dbVersion = 1;

const request = indexedDB.open(dbName, dbVersion);

request.onerror = (event) => {
  console.error(`Error opening database: ${event}`);
};

request.onsuccess = (e) => {
  const db = request.result;
  console.log("Database opened successfully!", db);
};

request.onupgradeneeded = () => {
  const db = request.result;
  const objectStore = db.createObjectStore("notes", {
    keyPath: "id",
    autoIncrement: true,
  });

  objectStore.createIndex("titleIndex", "title", { unique: false });
};
