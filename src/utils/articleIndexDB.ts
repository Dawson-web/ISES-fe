import { toastMessage } from "@/components/toast";
import { IArticleFiled } from "@/types/article";
import { Editor } from "@tiptap/react";

// 数据库名称和版本
const DB_NAME = "articleDB";
const DB_VERSION = 1;
const STORE_NAME = "articles";

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

      request.onsuccess = (event) => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
          });
          objectStore.createIndex("title", "title", { unique: false });
          objectStore.createIndex("content", "content", { unique: false });
          objectStore.createIndex("type", "type", { unique: false });
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

// 文章操作方法
async function addArticleToDB(article: Omit<IArticleFiled, "id">) {
  try {
    // 先删除旧记录
    await executeTransaction("readwrite", (store) => store.delete(0));

    // 添加新记录（强制指定id为0）
    await executeTransaction("readwrite", (store) =>
      store.put({ ...article, id: 0 } as IArticleFiled)
    );

    toastMessage.success("文章已加入记录库");
  } catch (error) {
    console.error("数据写入失败:", error);
    toastMessage.error("文章保存失败");
  }
}

async function deleteArticleFromDB() {
  try {
    await executeTransaction("readwrite", (store) => store.delete(0));
    console.log("数据删除成功");
  } catch (error) {
    console.error("数据删除失败:", error);
  }
}

async function readArticleFromDB(
  setArticle: React.Dispatch<React.SetStateAction<IArticleFiled>>,
  editor: Editor
) {
  try {
    const article = await executeTransaction<IArticleFiled>(
      "readonly",
      (store) => store.get(0)
    );
    console.log("读取文章成功:", article);

    if (article) {
      setArticle(article);
      editor?.commands.setContent(article.content);
      toastMessage.success("记录文章读取成功");
    } else {
      toastMessage.info("未找到历史记录");
    }
  } catch (error) {
    console.error("记录文章读取失败:", error);
    toastMessage.error("记录文章读取失败");
  }
}

export { addArticleToDB, deleteArticleFromDB, readArticleFromDB };
