import React, { FC } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { INote } from "../../types/notes.interface";
import DeleteIcon from "@mui/icons-material/Delete";

type CardItemProps = {
  note: INote;
};

const CardItem: FC<CardItemProps> = ({ note }) => {
  const handleDeleteButton = () => {};
  return (
    <Card sx={{ minWidth: 250 }}>
      <CardContent>
        <Typography sx={{ textAlign: "center" }} variant="h5" component="div">
          {note.title}
        </Typography>
        <Typography variant="body2">{note.body}</Typography>
      </CardContent>
      <CardActions>
        {/* <Button size="small" variant="outlined">
          Подробнее
        </Button> */}
        <Button size="small" variant="contained" color="success">
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
