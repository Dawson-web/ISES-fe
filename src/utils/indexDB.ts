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
  const id = Date.now() / 1000;
  return new Promise((resolve, reject) => {
    const text = db.transaction("draft", "readwrite");
    text.onerror = () => reject(text.error);
    text.oncomplete = () => resolve(id);
    text.objectStore("draft").put({ id, ...data });
  });
}
export async function delDraft(id: number) {
  const db = await indexDB();
  return new Promise((resolve, reject) => {
    const text = db.transaction("draft", "readwrite");
    text.onerror = () => reject(text.error);
    text.oncomplete = () => resolve(true);
    text.objectStore("draft").delete(id);
  });
}
export async function getDraft() {
  const db = await indexDB();
  return new Promise((resolve, reject) => {
    const text = db.transaction("draft", "readwrite");
    const req = text.objectStore("draft").getAll();
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      //console.log(req.result);
      resolve(req.result);
    };
  });
}
// 根据id获取草稿
export async function getDraftById(id: number) {
  const db = await indexDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("draft", "readonly");
    const req = tx.objectStore("draft").get(id);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}
