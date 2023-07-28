export interface INoteData {
  id: string;
  title: string;
  body: string;
  hashtags: string[];
}

export type INote = Omit<INoteData, "id">;
