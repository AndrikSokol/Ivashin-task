import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { FC } from "react";
import { useAppSelector } from "../../hooks/redux";
import { INoteData } from "../../types/notes.interface";

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

type MultipleSelectCheckmarksProps = {
  setSortedNotes: React.Dispatch<React.SetStateAction<INoteData[]>>;
};
const MultipleSelectCheckmarks: FC<MultipleSelectCheckmarksProps> = ({
  setSortedNotes,
}) => {
  const [currentHashTags, setCurrentHashTags] = React.useState<string[]>([]);
  const [uniqueHashTags, setUniqueHashTags] = React.useState<string[]>([]);
  const notes = useAppSelector((state) => state.note.notes);
  const handleChange = (event: SelectChangeEvent<typeof currentHashTags>) => {
    const {
      target: { value },
    } = event;
    setCurrentHashTags(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  console.log(notes);
  React.useEffect(() => {
    const hashTags: string[] = [];
    for (let note of notes) {
      hashTags.push(...note.hashtags);
    }
    console.log(hashTags);
    setUniqueHashTags([...new Set(hashTags)]);

    console.log("uniqueHashTags" + uniqueHashTags);
  }, [notes]);

  React.useEffect(() => {
    setCurrentHashTags(
      currentHashTags.filter((currentHashTag) => {
        uniqueHashTags.includes(currentHashTag);
      })
    );
  }, [uniqueHashTags]);

  React.useEffect(() => {
    if (currentHashTags.length > 0) {
      filterNotesByCurrentHashTags();
    } else {
      setSortedNotes(notes);
    }

    console.log(currentHashTags);
  }, [currentHashTags, notes]);

  const filterNotesByCurrentHashTags = () => {
    return setSortedNotes(
      notes.filter((note: INoteData) =>
        note.hashtags.some((tag) => currentHashTags.includes(tag))
      )
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel>hashTags</InputLabel>
        <Select
          multiple
          value={currentHashTags}
          onChange={handleChange}
          input={<OutlinedInput label="HashTags" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {uniqueHashTags.map((uniqueHashTag) => (
            <MenuItem key={uniqueHashTag} value={uniqueHashTag}>
              <Checkbox checked={currentHashTags.indexOf(uniqueHashTag) > -1} />
              <ListItemText primary={uniqueHashTag} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultipleSelectCheckmarks;
