import { useEffect, useCallback, useRef } from "react";
import { getDraft, saveDraft, delDraft, getDraftById } from "@/utils/indexDB";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Message } from "@arco-design/web-react";

export function useDraft({
  getEditorContent,
  setEditorContent,
  getOtherFields,
  setOtherFields,
}: {
  getEditorContent: () => any;
  setEditorContent: (data: any) => void;
  getOtherFields?: () => any; // 获取其他字段（如标题、标签等）
  setOtherFields?: (fields: any) => void;
}) {
  const pathname = useLocation().pathname;
  const isSaved = useRef(false);
  const lastValues = useRef<any>(null);
  const lastId = useRef<number | null>(null);
  //草稿对比函数
  const SameValue = () => {
    const currentValues = {
      content: getEditorContent(),
      ...getOtherFields?.(),
    };
    //console.log(isEqual(lastValues, currentValues));
    if (lastValues.current) {
      return (
        JSON.stringify(lastValues.current) === JSON.stringify(currentValues)
      );
    }
  };
  //路由切换函数
  const handleRouteChange = async () => {
    const content = getEditorContent();
    const Paragraph = content?.content?.[0];
    const Text = Paragraph?.content?.[0]?.text;
    //if (Text === "开始你的创作..." || !Text) {
    //  Message.info("内容不能为空，无法保存草稿");
    //  return;
    // }
    //if (SameValue()) {
    //  Message.info("内容未发生变化，无需保存");
    // return;
    //}
    const id = lastId.current ?? Date.now();
    if (
      !window.location.pathname.endsWith("/edit") &&
      !isSaved.current &&
      !SameValue() &&
      Text &&
      Text !== "开始你的创作..."
    ) {
      toast("您是否要保存草稿？", {
        action: (
          <div className="flex gap-2">
            <button
              onClick={async () => {
                await saveDraft({
                  id,
                  content: getEditorContent(),
                  ...getOtherFields?.(),
                });
                isSaved.current = false;
                lastValues.current = {
                  content: getEditorContent(),
                  ...getOtherFields?.(),
                };
                lastId.current = null;
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              保存
            </button>
            <button
              onClick={async () => {
                await deleteDraft(id);
              }}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              不保存
            </button>
          </div>
        ),
        duration: 2000,
      });
    }
  };
  // 检查是否存在草稿
  //useEffect(() => {
  //  const CheckDraft = async () => {
  //    const draft = await getDraft();
  //   if (draft) {
  //     setHasDraft(true);
  //   }
  // };
  // CheckDraft();
  //}, []);

  //刷新页面提示
  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [getEditorContent, setEditorContent]);
  //切换路由提示
  useEffect(() => {
    return () => {
      handleRouteChange();
    };
  }, [pathname]);
  //获取所有草稿
  const fetchAllDrafts = useCallback(async () => {
    const drafts = await getDraft();
    return drafts;
  }, []);
  // 导入草稿
  const importDraft = useCallback(
    async (Id: number) => {
      const draft = await getDraftById(Id);
      console.log(draft);
      const { id, content, ...otherFields } = draft as any;
      if (draft) {
        setEditorContent(content);
        setOtherFields?.(otherFields as any);
        lastValues.current = {
          content,
          ...otherFields,
        };
        lastId.current = id;
        console.log(lastValues.current);
      }
    },
    [setEditorContent, setOtherFields]
  );
  //删除草稿
  const deleteDraft = useCallback(async (id: number) => {
    await delDraft(id);
  }, []);
  //单独保存草稿的功能
  const toSaveDraft = useCallback(async () => {
    const content = getEditorContent();
    const Paragraph = content?.content?.[0];
    const Text = Paragraph?.content?.[0]?.text;
    if (Text === "开始你的创作..." || !Text) {
      Message.info("内容不能为空，无法保存草稿");
      return;
    }
    if (SameValue()) {
      Message.info("内容未发生变化，无需保存");
      return;
    }
    const id = lastId.current ?? Date.now();
    await saveDraft({
      id,
      content: getEditorContent(),
      ...getOtherFields?.(),
    });
    isSaved.current = true;
    lastValues.current = { content: getEditorContent(), ...getOtherFields?.() };
    lastId.current = null;
  }, [getEditorContent, getOtherFields]);
  return { importDraft, deleteDraft, fetchAllDrafts, toSaveDraft, lastId };
}
