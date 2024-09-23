// Let us open our database
interface IFormInput {
  labelContent: string;
  inputContent: string;
}

let db: IDBDatabase | null = null;

const DBOpenRequest = indexedDB.open("pastaForm", 1);

// Register two event handlers to act on the database being opened successfully, or not
DBOpenRequest.onerror = (event) => {
  console.log(event.target)
};

DBOpenRequest.onsuccess = (event: Event) => {
  // Store the result of opening the database in the db variable. This is used a lot below
  if (!event.target || !(event.target instanceof IDBOpenDBRequest)) return;
  db = event.target.result;
  console.log("DB Open success", db);
};

// This is run when the version is updated
DBOpenRequest.onupgradeneeded = (event: Event) => {
  // Save the IDBDatabase interface
  if (!event.target || !(event.target instanceof IDBOpenDBRequest)) return;
  db = event.target.result;

  const objectStore = db.createObjectStore("formInputs", {
    keyPath: "labelContent",
  });

  // Use transaction oncomplete to make sure the objectStore creation is
  // finished before adding data into it.
  objectStore.transaction.oncomplete = (event) => {
    if (!db) return;
    console.log("Object store created")
  };
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.ops === "UPDATE") {
    getData(request.label).then((val) => {
      console.log("on get", val);
      if (val) {
        updateData({
          labelContent: request.label,
          inputContent: request.input,
        }).then((val) => {
          console.log("on update", val);
          sendResponse({
            ops: "UPDATE",
            data: val,
          });
        });
      } else {
        addData({
          labelContent: request.label,
          inputContent: request.input,
        }).then((val) => {
          console.log("on add", val);
          sendResponse({
            ops: "UPDATE",
            data: val,
          });
        });
      }
    });
    return true;
  }

  if (request.ops === "DELETE") {
    removeData(request.label).then((val) =>
      sendResponse({ ops: "DELETE", data: val })
    );
    return true;
  }

  if (request.ops === "SEARCH") {
    searchData(request.label).then((val) =>
      sendResponse({ ops: "SEARCH", data: val })
    );
    return true;
  }
});

function getData(labelContent: string): Promise<IFormInput | null> {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve(null);
      return;
    }

    const transaction = db.transaction(["formInputs"]);
    const objectStore = transaction.objectStore("formInputs");

    const request = objectStore.get(labelContent);

    request.onsuccess = (event) => {
      if (!event.target || !(event.target instanceof IDBRequest)) return;

      const result = event.target.result;
      if (result && result.labelContent === labelContent) {
        resolve(result);
        return;
      }
      resolve(null);
      return;
    };
  });
}

function addData(formInput: IFormInput): Promise<IFormInput | null> {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve(null);
      return;
    }
    const transaction = db.transaction(["formInputs"], "readwrite");

    const objectStore = transaction.objectStore("formInputs");
    const request = objectStore.add(formInput);
    request.onerror = (event) => {
      resolve(null);
    };
    request.onsuccess = (event: Event) => {
      if (!event.target || !(event.target instanceof IDBRequest)) return;
      resolve(event.target.result);
      return;
    };
  });
}

// formInput -> bool
function updateData(formInput: IFormInput): Promise<IFormInput | null> {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve(null);
      return;
    }
    const objectStore = db
      .transaction(["formInputs"], "readwrite")
      .objectStore("formInputs");
    const request = objectStore.get(formInput.labelContent);
    request.onerror = (event) => {
      resolve(null);
      return;
    };

    request.onsuccess = (event) => {
      if (!event.target || !(event.target instanceof IDBRequest)) return;
      const data = event.target.result;
      data.inputContent = formInput.inputContent;

      // Put this updated object back into the database.
      const requestUpdate = objectStore.put(data);

      requestUpdate.onsuccess = (event) => {
        if (!event.target || !(event.target instanceof IDBRequest)) return;
        resolve(event.target.result);
        return;
      };
    };
  });
}

function removeData(
  labelContent: string
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve(null);
      return;
    }
    const request = db
      .transaction(["formInputs"], "readwrite")
      .objectStore("formInputs")
      .delete(labelContent);

    request.onerror = (event) => {
      resolve(null);
    };

    request.onsuccess = (event) => {
      resolve(labelContent);
    };
  });
}

function searchData(searchValue: string | null): Promise<IFormInput[]> {
  return new Promise((resolve, reject) => {
    const inputs: IFormInput[] = [];

    if (!db) {
      resolve([]);
      return;
    }

    if (!searchValue || searchValue === "") {
      resolve(inputs);
      return;
    }

    const transaction = db.transaction(["formInputs"]);
    const objectStore = transaction.objectStore("formInputs");

    objectStore.openCursor().onsuccess = (event) => {
      if (
        !(event.target instanceof IDBRequest) ||
        !(event.target.result instanceof IDBCursorWithValue)
      ) {
        resolve(inputs);
        return;
      }

      const cursor = event.target.result;

      if (!cursor.value) {
        cursor.continue();
      }

      const fullText = cursor.value.labelContent + cursor.value.inputContent;

      if (fullText.toLowerCase().includes(searchValue.toLowerCase())) {
        inputs.push(cursor.value);
      }

      cursor.continue();
    };
  });
}
