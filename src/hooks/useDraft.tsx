import { useState, useEffect, useCallback } from "react";
import { getDraft, saveDraft, deleteDraft } from "@/utils/indexDB";
import { useLocation } from "react-router-dom";
export function useDraft({
  getEditorContent,
  setEditorContent,
}: //getOtherFields,
//setOtherFields,
{
  getEditorContent: () => any;
  setEditorContent: (data: any) => void;
  //getOtherFields?: () => any; // 获取其他字段（如标题、标签等）
  //setOtherFields?: (fields: any) => void;
}) {
  const [hasDraft, setHasDraft] = useState(false);
  const pathname = useLocation().pathname;
  //const isSaved = useRef(false);
  //const isEditPage = pathname.endsWith("/edit");
  //console.log(isEditPage);
  const handleRouteChange = async () => {
    if (!window.location.pathname.endsWith("/edit")) {
      if (window.confirm("保存草稿?")) {
        await saveDraft({
          id: "articleid",
          content: getEditorContent(),
          //...getOtherFields?.(),
        });
      } else {
        await deleteDraft();
      }
    }
  };
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
    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [getEditorContent, setEditorContent]);

  useEffect(() => {
    return () => {
      handleRouteChange();
    };
  }, [pathname]);

  const importDraft = useCallback(async () => {
    const draft = await getDraft();
    const { content } = draft;
    if (draft) {
      setEditorContent(content);
      //setOtherFields?.(otherFields);
    }
  }, [setEditorContent]);

  const deleteDraft = useCallback(async () => {
    await deleteDraft();
    setHasDraft(false);
  }, []);

  return { hasDraft, importDraft, deleteDraft };
}
