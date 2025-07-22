import { useEffect, useCallback } from "react";
import { getDraft, saveDraft, delDraft, getDraftById } from "@/utils/indexDB";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
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
  //const [hasDraft, setHasDraft] = useState(false);
  const pathname = useLocation().pathname;
  //const isSaved = useRef(false);
  //const isEditPage = pathname.endsWith("/edit");
  //console.log(isEditPage);
  const handleRouteChange = async () => {
    const id = Date.now();
    if (!window.location.pathname.endsWith("/edit")) {
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
  // 保存草稿
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
  //草稿提示
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
    async (id: number) => {
      const draft = await getDraftById(id);
      const { content, ...otherFields } = draft;
      if (draft) {
        setEditorContent(content);
        setOtherFields?.(otherFields as any);
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
    const id = Date.now();
    await saveDraft({
      id,
      content: getEditorContent(),
      ...getOtherFields?.(),
    });
  }, [getEditorContent, getOtherFields]);
  return { importDraft, deleteDraft, fetchAllDrafts, toSaveDraft };
}
