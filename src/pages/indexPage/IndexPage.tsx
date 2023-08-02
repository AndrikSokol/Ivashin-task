import Button from "@mui/material/Button";
import CardItem from "../../components/card/CardItem";
import Modal from "@mui/material/Modal";
import React, { useRef } from "react";
import { useAppDispatch } from "../../hooks/redux";
import Form from "../../components/form/Form";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { dbName, dbVersion } from "../../constants/db.ts";
import { INoteData } from "../../types/notes.interface.ts";
import { addNote } from "../../slices/note.slice.ts";
import { IndexedDB } from "../../database/indexedDB.ts";
import MultipleSelectCheckmarks from "../../components/multipleSelectCheckmarks/MultipleSelectCheckmarks.tsx";

const IndexPage = () => {
  const [noteForEdit, setNoteForEdit] = React.useState<INoteData | undefined>(
    undefined
  );
  const [open, setOpen] = React.useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [sortedNotes, setSortedNotes] = React.useState<INoteData[]>([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispath = useAppDispatch();

  React.useEffect(() => {
    IndexedDB.createCollectionsInIndexedDB();
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
      const transaction = db.transaction("notes", "readonly");
      const noteData = transaction.objectStore("notes");
      let requestGetAll = noteData.getAll();
      requestGetAll.onsuccess = () => {
        dispath(addNote(requestGetAll.result));
      };
    };
  };

  return (
    <>
      <MultipleSelectCheckmarks setSortedNotes={setSortedNotes} />
      <Button sx={{ marginY: 2 }} onClick={handleOpen} variant="outlined">
        Добавить заметку
      </Button>
      <Container>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          {noteForEdit !== undefined ? (
            <Form
              ref={formRef}
              handleClose={handleClose}
              noteForEdit={noteForEdit}
            />
          ) : (
            <Form
              ref={formRef}
              handleClose={handleClose}
              noteForEdit={undefined}
            />
          )}
        </Modal>
        <Grid container spacing={2}>
          {sortedNotes &&
            sortedNotes.map((note) => (
              <Grid item xs={12} md={4} lg={3} key={note.id}>
                <CardItem
                  note={note}
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
