export interface INoteData {
  id: number;
  title: string;
  body: string;
  hashtags: string[];
}

export type INote = Omit<INoteData, "id">;
