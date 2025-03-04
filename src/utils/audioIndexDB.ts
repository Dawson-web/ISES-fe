import { toastMessage } from "@/components/toast";

// 数据库名称和版本
const DB_NAME = "audioDB";
const DB_VERSION = 1;
const STORE_NAME = "audios";

// 全局数据库实例Promise
let dbPromise: Promise<IDBDatabase>;

// 初始化数据库并返回Promise实例
function getDatabase(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error("Database error:", event);
        reject(new Error("Database error"));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
          });
          // 创建索引
          objectStore.createIndex("chatId", "chatId", { unique: false });
          objectStore.createIndex("createdAt", "createdAt", { unique: false });
        }
      };
    });
  }
  return dbPromise;
}

// 通用数据库操作函数
async function executeTransaction<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await getDatabase();
  const transaction = db.transaction(STORE_NAME, mode);
  const objectStore = transaction.objectStore(STORE_NAME);
  const request = operation(objectStore);

  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.onerror = () => reject(transaction.error);
  });
}

// 音频数据接口
interface IAudioData {
  id: string;
  blob: Blob;
  duration: number;
  chatId: string;
  createdAt: string;
}

// 保存音频数据
async function saveAudioToDB(audioData: Omit<IAudioData, "id">) {
  try {
    const id = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await executeTransaction("readwrite", (store) =>
      store.put({ ...audioData, id } as IAudioData)
    );
    return id;
  } catch (error) {
    console.error("音频数据保存失败:", error);
    toastMessage.error("音频保存失败");
    throw error;
  }
}

// 获取音频数据
async function getAudioFromDB(id: string): Promise<IAudioData | undefined> {
  try {
    const audioData = await executeTransaction<IAudioData>(
      "readonly",
      (store) => store.get(id)
    );
    return audioData;
  } catch (error) {
    console.error("音频数据读取失败:", error);
    toastMessage.error("音频读取失败");
    throw error;
  }
}

// 删除音频数据
async function deleteAudioFromDB(id: string) {
  try {
    await executeTransaction("readwrite", (store) => store.delete(id));
    console.log("音频数据删除成功");
  } catch (error) {
    console.error("音频数据删除失败:", error);
    toastMessage.error("音频删除失败");
    throw error;
  }
}

// 获取聊天记录的所有音频
async function getChatAudiosFromDB(chatId: string): Promise<IAudioData[]> {
  try {
    const db = await getDatabase();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const objectStore = transaction.objectStore(STORE_NAME);
    const index = objectStore.index("chatId");
    const request = index.getAll(chatId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("获取聊天音频列表失败:", error);
    toastMessage.error("获取音频列表失败");
    throw error;
  }
}

// 清理过期的音频数据（例如30天前的）
async function cleanupOldAudios(daysToKeep: number = 30) {
  try {
    const db = await getDatabase();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);
    const index = objectStore.index("createdAt");

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const request = index.openKeyCursor(
      IDBKeyRange.upperBound(cutoffDate.toISOString())
    );

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        objectStore.delete(cursor.primaryKey);
        cursor.continue();
      }
    };
  } catch (error) {
    console.error("清理过期音频失败:", error);
  }
}

export {
  cleanupOldAudios,
  deleteAudioFromDB,
  getAudioFromDB,
  getChatAudiosFromDB,
  saveAudioToDB,
  type IAudioData,
};
