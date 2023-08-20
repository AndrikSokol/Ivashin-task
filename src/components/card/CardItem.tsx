import React, { FC, useEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { INoteData } from "../../types/notes.interface";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteNote } from "../../slices/note.slice";
import { useAppDispatch } from "../../hooks/redux";
import { dbName, dbVersion } from "../../constants/db.ts";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import style from "./card.module.scss";
type CardItemProps = {
  note: INoteData;
  handleOpen: () => void;
  setNoteForEdit: React.Dispatch<React.SetStateAction<INoteData | undefined>>;
};

const CardItem: FC<CardItemProps> = ({ note, handleOpen, setNoteForEdit }) => {
  const dispath = useAppDispatch();
  const [fadeIn, setFadeIn] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const handleDeleteButton = () => {
    const dbPromise = indexedDB.open(dbName, dbVersion);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const transaction = db.transaction("notes", "readwrite");
      const noteData = transaction.objectStore("notes");
      let requestDelete = noteData.delete(note.id);
      requestDelete.onsuccess = () => {
        dispath(deleteNote(note));
      };
    };
  };

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 100);
  }, []);

  return (
    <Card
      sx={{
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
        position: "relative",
      }}
    >
      <ArrowUpwardIcon
        sx={{
          cursor: "pointer",
          position: "absolute",
          right: "0",
          top: "0",
          transform: showFullText ? "" : "translateY(-90%)",
          transition: "transform .5s ease",
        }}
        onClick={() => {
          setShowFullText(false);
        }}
      ></ArrowUpwardIcon>
      <CardContent
        sx={{ minHeight: "150px" }}
        className={showFullText ? "" : style["expandable-content"]}
      >
        <Typography sx={{ textAlign: "center" }} variant="h5" component="div">
          {note.title}
        </Typography>
        <Typography
          sx={{
            textAlign: "justify",
            maxHeight: showFullText ? "none" : "120px",
            overflow: "hidden",
          }}
          variant="body2"
        >
          {note.body}
        </Typography>
        <Typography sx={{ fontWeight: "500" }} variant="body2">
          {note.hashtags.length > 0 && <>Хеш теги: {note.hashtags.join(" ")}</>}
        </Typography>
      </CardContent>
      <CardActions>
        {note.body.length > 150 && !showFullText ? (
          <Button
            variant="contained"
            size="small"
            onClick={() => setShowFullText(true)}
          >
            Подробнее
          </Button>
        ) : (
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
        )}

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
