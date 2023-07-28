import Button from "@mui/material/Button";
import CardItem from "../../components/card/CardItem";
import style from "./IndexPage.module.scss";
import Modal from "@mui/material/Modal";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import Form from "../../components/form/Form";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { dbName, dbVersion } from "../../constants/db.ts";
import { INote, INoteData } from "../../types/notes.interface.ts";
import { addNote } from "../../slices/note.slice.ts";
const idb = window.indexedDB;

const createCollectionsInIndexedDB = () => {
  if (!idb) {
    console.log("browser doesnt support IndexedDB");
  }

  const request = idb.open(dbName, dbVersion);

  request.onerror = (event) => {
    console.error(`Error opening database: ${event}`);
  };

  request.onsuccess = (event) => {
    const db = request.result;
    console.log("Database opened successfully!", db);
  };

  request.onupgradeneeded = () => {
    const db = request.result;
    const objectStore = db.createObjectStore("notes", {
      keyPath: "id",
      autoIncrement: true,
    });
  };
};
const IndexPage = () => {
  const [noteForEdit, setNoteForEdit] = React.useState<INoteData | undefined>(
    undefined
  );
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispath = useAppDispatch();
  const notes = useAppSelector((state) => state.note.notes);
  React.useEffect(() => {
    createCollectionsInIndexedDB();
    getAllNote();
  }, []);

  React.useEffect(() => {
    if (open === false) {
      setNoteForEdit(undefined);
    }
  }, [open]);

  const getAllNote = () => {
    const dbPromise = indexedDB.open(dbName, dbVersion);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const transaction = db.transaction("notes", "readwrite");
      const noteData = transaction.objectStore("notes");
      let requestGetAll = noteData.getAll();
      requestGetAll.onsuccess = () => {
        dispath(addNote(requestGetAll.result));
      };
    };
  };

  return (
    <>
      <Button sx={{ marginY: 2 }} onClick={handleOpen} variant="outlined">
        Добавить заметку
      </Button>
      <Container>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          {noteForEdit !== undefined ? (
            <Form handleClose={handleClose} noteForEdit={noteForEdit} />
          ) : (
            <Form handleClose={handleClose} noteForEdit={undefined} />
          )}
        </Modal>
        <Grid container spacing={2}>
          {notes &&
            notes.map((note) => (
              <Grid>
                <CardItem
                  note={note}
                  key={note.id}
                  handleOpen={handleOpen}
                  setNoteForEdit={setNoteForEdit}
                />
              </Grid>
            ))}
        </Grid>
      </Container>
    </>
  );
};

export default IndexPage;
