import { useState, useRef, useEffect, useCallback } from "react";
import { getDraft, saveDraft } from "@/utils/indexDB";
import { useLocation } from "react-router-dom";

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
  const [hasDraft, setHasDraft] = useState(false);
  const pathname = useLocation().pathname;

// 检查是否存在草稿
  useEffect(() => {
    const CheckDraft = async () => {
      const draft = await getDraft();
      if (draft) {
        setHasDraft(true);
      }
    };
    CheckDraft();
  }, []);

  const handleRouteChange = async () => {
    if (window.confirm("保存草稿?")) {
      await saveDraft({
        content: getEditorContent(),
        ...getOtherFields?.(),
      });
    }
  };

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
  }, [getEditorContent, setEditorContent, getOtherFields]);

  useEffect(() => {
    return () => {
      handleRouteChange();
    };
  }, [pathname]);

  // 导入草稿
  const importDraft = useCallback(async () => {
    const draft = await getDraft();
    if (draft) {
      setEditorContent(draft.content);
      setOtherFields?.(draft);
    }
  }, [setEditorContent, setOtherFields]);

  const deleteDraft = useCallback(async () => {
    await deleteDraft();
    setHasDraft(false);
  }, []);

  return { hasDraft, importDraft, deleteDraft };
}
