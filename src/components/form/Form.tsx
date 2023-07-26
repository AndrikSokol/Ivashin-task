import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { FC } from "react";
import { INote } from "../../types/notes.interface";
import Paper from "@mui/material/Paper";
import { useAppDispatch } from "../../hooks/redux";
import { addNote } from "../../slices/note.slice";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { dbName, dbVersion } from "../../constants/db.ts";

const form = {
  position: "absolute" as "absolute",
  top: "35%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
};

type FormProps = {
  handleClose: () => void;
};
const Form: FC<FormProps> = ({ handleClose }) => {
  const [note, setNote] = React.useState<INote>({
    title: "",
    body: "",
    hashtags: [],
  });
  const dispath = useAppDispatch();
  const [hashTags, setHashTags] = React.useState<string[]>([]);
  const [isSuccessful, setIsSuccessfull] = React.useState<boolean>();
  function findHashtags(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setHashTags([]);
    let text: string = event.target.value;
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      let word: string = words[i];
      if (word[0] === "#") {
        setHashTags((prev: string[]) => [...prev, word]);
      }
    }
    setNote((prev: INote) => ({ ...prev, hashtags: hashTags }));
  }
  function clearNoteState() {
    setNote({} as INote);
    setHashTags([]);
  }
  React.useEffect(() => {
    clearNoteState();
  }, [open]);

  function handleSuccessButton() {
    const dbPromise = indexedDB.open(dbName, dbVersion);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const transaction = db.transaction("notes", "readwrite");
      const noteData = transaction.objectStore("notes");
      const requestAdd = noteData.add({ ...note });
      console.log(requestAdd);
      requestAdd.onsuccess = (event) => {
        <Alert severity="success">successfull added in IndexedDB</Alert>;
      };
      requestAdd.onerror = (event) => {
        <Alert severity="warning">error to added in IndexedDB</Alert>;
      };
      handleClose();
    };
  }

  function handleChangeBody(event: React.ChangeEvent<HTMLTextAreaElement>) {
    findHashtags(event);
    setNote((prev: INote) => ({ ...prev, body: event.target.value }));
  }

  function handleChangeTitle(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setNote((prev: INote) => ({ ...prev, title: event.target.value }));
  }

  return (
    <Box sx={form}>
      <Typography
        sx={{ textAlign: "center" }}
        id="modal-modal-title"
        variant="h6"
        component="h2"
      >
        Заметка
      </Typography>
      <Typography id="modal-modal-description">
        Напишите нужную информацию в заметку!
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          marginBottom: 4,
        }}
      >
        <TextField
          id="outlined-basic"
          label="Заголовок заметки"
          variant="standard"
          value={note.title}
          onChange={handleChangeTitle}
        />
        <TextField
          id="outlined-multiline-flexible"
          variant="standard"
          label="текст заметки"
          multiline
          maxRows={6}
          value={note.body}
          onChange={handleChangeBody}
        />
        {hashTags && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              paddingY: 2,
              overflowX: "scroll",
            }}
          >
            {hashTags.map((hashTag) => (
              <Paper elevation={3} sx={{ padding: 1, borderRadius: "40%" }}>
                <Typography variant="subtitle2" sx={{ bg: "blue" }}>
                  {hashTag}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <Button onClick={handleClose} variant="outlined" color="error">
          Назад
        </Button>
        <Button
          onClick={handleSuccessButton}
          variant="contained"
          color="success"
        >
          Добавить
        </Button>
      </Box>
    </Box>
  );
};

export default Form;
