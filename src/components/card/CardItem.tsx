import React, { FC } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { INote, INoteData } from "../../types/notes.interface";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteNote } from "../../slices/note.slice";
import { useAppDispatch } from "../../hooks/redux";
import { dbName, dbVersion } from "../../constants/db.ts";

type CardItemProps = {
  note: INoteData;
  handleOpen: () => void;
  setNoteForEdit: React.Dispatch<React.SetStateAction<INoteData | undefined>>;
};

const CardItem: FC<CardItemProps> = ({ note, handleOpen, setNoteForEdit }) => {
  const dispath = useAppDispatch();
  const handleDeleteButton = () => {
    const dbPromise = indexedDB.open(dbName, dbVersion);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const transaction = db.transaction("notes", "readwrite");
      const noteData = transaction.objectStore("notes");
      let requestDelete = noteData.delete(note.id);
      console.log(note.id);
      requestDelete.onsuccess = () => {
        dispath(deleteNote(note));
      };
    };
  };

  return (
    <Card sx={{ minWidth: 250 }}>
      <CardContent>
        <Typography sx={{ textAlign: "center" }} variant="h5" component="div">
          {note.title}
        </Typography>
        <Typography variant="body2">{note.body}</Typography>
        <Typography variant="body2">
          Хеш теги: {note.hashtags.join(" ")}
        </Typography>
      </CardContent>
      <CardActions>
        {/* <Button size="small" variant="outlined">
          Подробнее
        </Button> */}
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={() => {
            setNoteForEdit(note);

            handleOpen();
          }}
        >
          Редактировать
        </Button>
        <Button
          onClick={handleDeleteButton}
          startIcon={<DeleteIcon />}
          size="small"
          variant="outlined"
          color="error"
        >
          Удалить
        </Button>
      </CardActions>
    </Card>
  );
};

export default CardItem;
