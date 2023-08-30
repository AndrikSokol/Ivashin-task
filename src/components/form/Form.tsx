import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { INote, INoteData } from "../../types/notes.interface";
import Paper from "@mui/material/Paper";
import { useAppDispatch } from "../../hooks/redux";
import { addNote, editNote } from "../../slices/note.slice";
import Button from "@mui/material/Button";
import { dbName, dbVersion } from "../../constants/db.ts";
import { uid } from "react-uid";

const form = {
  position: "absolute" as "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
};

type FormProps = {
  handleClose: () => void;
  noteForEdit: INoteData | undefined;
  ref?: ForwardedRef<HTMLFormElement>;
};
const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ handleClose, noteForEdit }, ref) => {
    const [note, setNote] = useState<INote>({
      title: "",
      body: "",
      hashtags: [],
    });
    const dispath = useAppDispatch();
    const [hashTags, setHashTags] = useState<string[]>([]);
    const [errorTitleText, setErrorTitleText] = useState<string>("");
    const [errorBodyText, setErrorBodyText] = useState<string>("");

    useEffect(() => {
      if (noteForEdit !== undefined) {
        setNote((prev) => ({
          ...prev,
          title: noteForEdit.title,
          body: noteForEdit.body,
          hashtags: noteForEdit.hashtags,
        }));
        findHashtags(noteForEdit.body);
      }
    }, [noteForEdit]);

    useEffect(() => {
      if (hashTags.length > 0) {
        setNote((prev: INote) => ({ ...prev, hashtags: hashTags }));
      }
    }, [hashTags]);

    function findHashtags(text: string) {
      const words = text.split(" ");
      const currentHashTag: string[] = [];
      for (let i = 0; i < words.length; i++) {
        let word: string = words[i];
        if (word[0] === "#") {
          currentHashTag.push(word);
        }
      }
      setHashTags(currentHashTag);
    }

    function handleSuccessButton() {
      const isTitleValid = validateInput("title", note.title);
      const isBodyValid = validateInput("body", note.body);
      if (!isTitleValid || !isBodyValid) {
        return;
      }
      const dbPromise = indexedDB.open(dbName, dbVersion);
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        const transaction = db.transaction("notes", "readwrite");
        const noteData = transaction.objectStore("notes");
        const requestAdd = noteData.add({ ...note });
        console.log(requestAdd);
        requestAdd.onsuccess = () => {
          dispath(addNote({ ...note, id: Number(requestAdd.result) }));
        };
        requestAdd.onerror = () => {
          console.log("error to add");
        };
        handleClose();
      };
    }

    function handleEditButton() {
      // if (!validateTitleInput() || !validateBodyInput()) {
      //   return;
      // }
      const dbPromise = indexedDB.open(dbName, dbVersion);
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        const transaction = db.transaction("notes", "readwrite");
        const noteData = transaction.objectStore("notes");
        const requestUpdate = noteData.put({ ...note, id: noteForEdit?.id });
        requestUpdate.onsuccess = () => {
          dispath(editNote({ ...note, id: Number(requestUpdate.result) }));
        };
        requestUpdate.onerror = () => {
          console.log("error to edit");
        };
        handleClose();
      };
    }

    function handleChangeBody(event: React.ChangeEvent<HTMLTextAreaElement>) {
      let text: string = event.target.value;
      findHashtags(text);
      setNote((prev: INote) => ({
        ...prev,
        body: event.target.value,
      }));
    }

    function handleChangeTitle(event: React.ChangeEvent<HTMLTextAreaElement>) {
      setNote((prev: INote) => ({ ...prev, title: event.target.value }));
    }

    // const validateTitleInput = () => {
    //   if (note.title.length === 0) {
    //     setErrorTitleText("Поле не может быть пустым.");
    //     return false;
    //   } else {
    //     setErrorTitleText("");
    //     return true;
    //   }
    // };

    // const validateBodyInput = () => {
    //   if (note.body.length === 0) {
    //     setErrorBodyText("Поле не может быть пустым.");
    //     return false;
    //   } else {
    //     setErrorBodyText("");
    //     return true;
    //   }
    // };

    const validateInput = (fieldName: string, value: string) => {
      if (value.length === 0) {
        switch (fieldName) {
          case "title":
            setErrorTitleText("Заголовок не может быть пустым.");
            break;
          case "body":
            setErrorBodyText("Поле не может быть пустым.");
            break;
          // Add more cases for other fields if needed.
          default:
            break;
        }
        return false;
      } else {
        switch (fieldName) {
          case "title":
            setErrorTitleText("");
            break;
          case "body":
            setErrorBodyText("");
            break;
          // Add more cases for other fields if needed.
          default:
            break;
        }
        return true;
      }
    };

    return (
      <Box sx={form} ref={ref} tabIndex={-1}>
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
            error={Boolean(errorTitleText)}
            helperText={errorTitleText}
          />
          <TextField
            id="outlined-multiline-flexible"
            variant="standard"
            label="текст заметки"
            multiline
            maxRows={6}
            value={note.body}
            onChange={handleChangeBody}
            error={Boolean(errorBodyText)}
            helperText={errorBodyText}
          />
          {hashTags.length > 0 && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                paddingY: 2,
                overflowX: "scroll",
              }}
            >
              {hashTags.map((hashTag) => (
                <Paper
                  elevation={3}
                  sx={{ padding: 1, borderRadius: "40%" }}
                  key={uid(hashTag)}
                >
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
          {noteForEdit ? (
            <Button
              onClick={handleEditButton}
              variant="contained"
              color="success"
            >
              Изменить
            </Button>
          ) : (
            <Button
              onClick={handleSuccessButton}
              variant="contained"
              color="success"
            >
              Добавить
            </Button>
          )}
        </Box>
      </Box>
    );
  }
);

export default Form;
