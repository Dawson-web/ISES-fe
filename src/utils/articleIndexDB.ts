import { toastMessage } from "@/components/toast";
import { IArticleFiled } from "@/types/article";
import { Editor } from "@tiptap/react";

const ArticleIndexDB = window.indexedDB;

function createArticleDB() {
  const request = ArticleIndexDB.open("articleDB", 1); // 打开数据库||创建数据库

  request.onerror = (event) => {
    console.log("Database error:", event);
  };

  request.onsuccess = () => {
    console.log("Database opened successfully");
  };

  request.onupgradeneeded = (event) => {
    // @ts-expect-error 屏蔽event.target.result的类型错误
    const db = event.target.result;
    const objectStore = db.createObjectStore("articles", { keyPath: "id" });
    objectStore.createIndex("title", "title", { unique: false });
    objectStore.createIndex("content", "content", { unique: false });
    objectStore.createIndex("type", "type", { unique: false });
  };
  return request;
}

async function addArticleToDB(
  article: IArticleFiled,
  request: IDBOpenDBRequest
) {
  deleteArticleFromDB(request);
  request.onsuccess = (event) => {
    // @ts-expect-error 屏蔽event.target.result的类型错误
    const db = event.target.result;
    // 开启一个事务
    const transaction = db.transaction(["articles"], "readwrite");
    const objectStore = transaction.objectStore("articles");
    objectStore.put({ ...article, id: 0 });
    // toastMessage.success("文章已加入记录库");

    transaction.onerror = (error: string) => {
      console.error("数据库操作失败:", error);
    };
  };

  request.onerror = function () {
    console.log("数据写入失败");
  };
}

async function deleteArticleFromDB(request: IDBOpenDBRequest) {
  request.onsuccess = function (event) {
    // @ts-expect-error 屏蔽event.target.result的类型错误
    const db = event.target.result;
    db.transaction(["articles"], "readwrite").objectStore("articles").delete(0);
    console.log("数据删除成功");
  };
}

async function readArticleFromDB(
  setArticle: React.Dispatch<React.SetStateAction<IArticleFiled>>,
  editor: Editor
) {
  const request = ArticleIndexDB.open("articleDB", 1);

  request.onsuccess = (event) => {
    // @ts-expect-error 屏蔽event.target.result的类型错误
    const db = event.target.result;
    const transaction = db.transaction(["articles"], "readonly");
    const objectStore = transaction.objectStore("articles");
    const request = objectStore.get(0);

    request.onsuccess = () => {
      console.log("Data read successfully:", request.result);
      setArticle(request.result as IArticleFiled);
      editor?.commands.setContent(request.result?.content || "");
      toastMessage.success("记录文章读取成功");
    };
    request.onerror = () => {
      console.log("Data read error:");
      toastMessage.error("记录文章读取失败");
    };
  };
}

export {
  addArticleToDB,
  createArticleDB,
  deleteArticleFromDB,
  readArticleFromDB,
};
