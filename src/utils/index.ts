const isMobile = () => {
  return window.innerWidth < 600;
};

/**
 * 将tiptap编辑器的JSON内容转换为纯文本
 * @param content tiptap编辑器的JSON内容
 * @returns 纯文本内容
 */
export const tiptapToText = (content: any): string => {
  if (!content) return '';
  
  // 如果是字符串,可能是HTML格式,直接返回
  if (typeof content === 'string') {
    return content.replace(/<[^>]+>/g, '');
  }

  // 处理JSON格式的内容
  let text = '';
  
  // 遍历content中的所有节点
  if (content.content) {
    content.content.forEach((node: any) => {
      // 如果是文本节点
      if (node.type === 'text' && node.text) {
        text += node.text + ' ';
      }
      // 如果是段落或其他包含子内容的节点
      else if (node.content) {
        text += tiptapToText(node) + ' ';
      }
    });
  }

  return text.trim();
};

export { isMobile };