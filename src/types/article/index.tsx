export interface IArticleForm {
  title: string;
  content: string;
  type: string;
  cover?: string;
  category?: string;
  contentType?: string;
  tags?: string[];
  excerpt?: string;
}