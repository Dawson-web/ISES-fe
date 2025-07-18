import { useState, useRef, useEffect, useCallback } from "react";
import { getDraft, saveDraft, deleteDraft } from "@/utils/indexDB";
import { useBlocker } from "react-router-dom";
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
  const isSaved = useRef(false);
  useEffect(() => {
    const CheckDraft = async () => {
      const draft = await getDraft();
      if (draft) {
        setHasDraft(true);
      }
    };
    CheckDraft();
  }, []);
  useEffect(() => {
    const handleRouteChange = async () => {
      if (window.confirm("保存草稿?")) {
        await saveDraft({
          content: getEditorContent(),
          ...getOtherFields(),
        });
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const unblock = history.block(handleRouteChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      unblock();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [getEditorContent, setEditorContent, getOtherFields]);
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
