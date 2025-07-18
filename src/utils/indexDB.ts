function indexDB(): Promise<IDBDatabase> {
  const request = indexedDB.open("EditDB", 1);
  return new Promise((resolve, reject) => {
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("draft")) {
        db.createObjectStore("draft", { keyPath: "id" });
      }
    };
  });
}
export async function saveDraft(data: any) {
  const db = await indexDB();
  return new Promise((resolve, reject) => {
    const text = db.transaction("draft", "readwrite");
    text.onerror = () => reject(text.error);
    text.oncomplete = () => resolve(true);
    text.objectStore("draft").put({ id: "articleid", ...data });
  });
}
export async function deleteDraft() {
  const db = await indexDB();
  return new Promise((resolve, reject) => {
    const text = db.transaction("draft", "readwrite");
    text.onerror = () => reject(text.error);
    text.oncomplete = () => resolve(true);
    text.objectStore("draft").delete("articleid");
  });
}
export async function getDraft() {
  const db = await indexDB();
  return new Promise((resolve, reject) => {
    const text = db.transaction("draft", "readwrite");
    const req = text.objectStore("draft").get("articleid");
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}
