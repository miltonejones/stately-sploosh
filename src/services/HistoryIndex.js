class ViewingHistoryDb {
  constructor(databaseName) {
    this.dbName = databaseName;
  }

  async openDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        reject(`Error opening database: ${event.target.error}`);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore("history", { keyPath: "ID" });
        objectStore.createIndex("timestamp", "timestamp");
      };
    });
  }

  async getItem(id) {
    const db = await this.openDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["history"], "readonly");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.get(id);

      request.onerror = (event) => {
        reject(`Error getting item: ${event.target.error}`);
      };

      request.onsuccess = (event) => {
        resolve(request.result);
      };
    });
  }

  async getItems() {
    const db = await this.openDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["history"], "readonly");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.getAll();

      request.onerror = (event) => {
        reject(`Error getting items: ${event.target.error}`);
      };

      request.onsuccess = (event) => {
        resolve(request.result);
      };
    });
  }

  async updateItem(item) {
    const db = await this.openDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["history"], "readwrite");
      const objectStore = transaction.objectStore("history");

      const getRequest = objectStore.get(item.ID);

      getRequest.onsuccess = (event) => {
        const existingItem = getRequest.result;

        if (existingItem) {
          const updatedItem = {
            ...existingItem,
            ...item,
            timestamp: new Date().toISOString(),
          };

          const updateRequest = objectStore.put(updatedItem);

          updateRequest.onsuccess = () => {
            resolve();
          };

          updateRequest.onerror = (event) => {
            reject(`Error updating item: ${event.target.error}`);
          };
        } else {
          reject(`Item with ID ${item.ID} not found.`);
        }
      };

      getRequest.onerror = (event) => {
        reject(`Error getting item: ${event.target.error}`);
      };
    });
  }

  async addItem(item) {
    const db = await this.openDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["history"], "readwrite");
      const objectStore = transaction.objectStore("history");
      const request = objectStore.add({
        ...item,
        timestamp: new Date().toISOString(),
      });

      request.onerror = (event) => {
        reject(`Error adding item: ${event.target.error}`);
      };

      request.onsuccess = (event) => {
        resolve(`Added video "${item.title}" to memory`);
      };
    });
  }
}

// Example usage:
const databaseName = "ViewingHistoryDB2";
const videoStore = new ViewingHistoryDb(databaseName);

export default videoStore;

// const video1 = { ID: 1, title: "Video 1", url: "https://example.com/video1" };
// const video2 = { ID: 2, title: "Video 2", url: "https://example.com/video2" };

// videoStore.addItem(video1).then(() => {
//   console.log("Item added successfully.");
// });

// videoStore.getItems().then(items => {
//   console.log(items);
// });

// videoStore.getItem(1).then(item => {
//   console.log(item);
// });
