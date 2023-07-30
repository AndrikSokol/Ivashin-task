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
import { IndexedDB } from "../../database/indexedDB.ts";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const IndexPage = () => {
  const [noteForEdit, setNoteForEdit] = React.useState<INoteData | undefined>(
    undefined
  );

  const [open, setOpen] = React.useState(false);
  const [uniqueHashTags, setUniqueHashTags] = React.useState<string[]>([]);
  const [sortedNotes, setSortedNotes] = React.useState<INoteData[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispath = useAppDispatch();
  const notes = useAppSelector((state) => state.note.notes);
  React.useEffect(() => {
    IndexedDB.createCollectionsInIndexedDB();
    getAllNote();
  }, []);

  React.useEffect(() => {
    if (open === false) {
      setNoteForEdit(undefined);
    }
  }, [open]);

  React.useEffect(() => {
    const hashTags: string[] = [];
    for (let note of notes) {
      hashTags.push(...note.hashtags);
    }
    console.log(hashTags);
    setUniqueHashTags([...new Set(hashTags)]);
    console.log(uniqueHashTags);
  }, [notes]);

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

  const [personName, setPersonName] = React.useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // React.useEffect(() => {
  //   if (personName.length > 0) {
  //     setSortedNotes(
  //       notes.filter((note) =>
  //         note.hashtags.some((tag) => personName.includes(tag))
  //       )
  //     );
  //   }
  // }, [personName]);

  const filterNotesByPersonNames = (notes, personName) => {
    return notes.filter((note) =>
      note.hashtags.some((tag) => personName.includes(tag))
    );
  };

  return (
    <>
      <div>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel>Tag</InputLabel>
          <Select
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="HashTags" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {uniqueHashTags.map((uniqueHashTag) => (
              <MenuItem key={uniqueHashTag} value={uniqueHashTag}>
                <Checkbox checked={personName.indexOf(uniqueHashTag) > -1} />
                <ListItemText primary={uniqueHashTag} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
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
          {sortedNotes &&
            sortedNotes.map((note) => (
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
