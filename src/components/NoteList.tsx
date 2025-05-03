import React, { useState, useCallback } from "react";
import {
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    CardActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Note } from "./types";
import NoteView from "./NoteView";

type Props = {
    notes: Note[];
    onDelete: (id: string) => void;
    onEdit: (note: Note) => void;
};

const getRandomColor = (id: string) => {
    const colors = [
        "#FFFBEB", // amber-50
        "#EFF6FF", // blue-50
        "#ECFDF5", // emerald-50
        "#FFF1F2", // rose-50
        "#F5F3FF", // violet-50
        "#ECFEFF", // cyan-50
    ];
    const index =
        id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        colors.length;
    return colors[index];
};

const getRandomColorDark = (id: string) => {
    const hoverColors = [
        // amber-100
        "#FDE68A",
        // blue-100
        "#BFDBFE",
        // emerald-100
        "#BBF7D0",
        // rose-100
        "#FECACA",
        // violet-100
        "#E0C5FF",
        // cyan-100
        "#A5F3FC",
    ];
    const index =
        id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        hoverColors.length;
    return hoverColors[index];
};

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });


const formatPreview = (content: string) => {
    // show only the first 150 characters of the content
    const preview =
        content.length > 150 ? content.slice(0, 150) + "..." : content;
    return preview.split("\n").map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));
};

const NoteList = React.memo(({ notes, onDelete, onEdit }: Props) => {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [viewOpen, setViewOpen] = useState(false);

    const handleEditClick = useCallback(
        (note: Note) => {
            console.log("Edit clicked for note:", note);
            setViewOpen(false);
            onEdit(note);
        },
        [onEdit]
    );

    const handleDeleteClick = useCallback(
        (id: string) => {
            onDelete(id);
        },
        [onDelete]
    );

    return (
        <>
            <Grid container spacing={2}>
                {notes.map((note) => (
                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 4,
                        }}
                        key={note.id}
                    >
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                transition: "0.3s",
                                backgroundColor: getRandomColor(note.id),
                                "&:hover": {
                                    backgroundColor: getRandomColorDark(
                                        note.id
                                    ),
                                },
                                "&:hover .MuiCardActions-root": {
                                    backgroundColor: getRandomColor(note.id),
                                },
                                borderColor: getRandomColorDark(note.id),
                                borderWidth: 2,
                                borderStyle: "solid",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setSelectedNote(note);
                                setViewOpen(true);
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 1,
                                        fontSize: "0.8rem",
                                        fontStyle: "italic",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                    component="span"
                                >
                                    <CalendarMonthIcon
                                        fontSize="small"
                                        sx={{ mr: 0.5 }}
                                    />
                                    {formatDate(note.createdAt || "")}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        wordBreak: "break-word",
                                    }}
                                    component="div"
                                >
                                    {formatPreview(note.content)}
                                </Typography>
                            </CardContent>
                            <CardActions
                                sx={{
                                    borderTop: "1px solid #e0e0e0",
                                    display: "flex",
                                    justifyContent: "end",
                                    backgroundColor: "white",
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(note);
                                    }}
                                    sx={{
                                        mr: 1,
                                        color: "black",
                                        borderColor: "black",
                                    }}
                                    endIcon={<EditIcon />}
                                    aria-label={`Edit note ${note.id}`}
                                >
                                    Edit
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(note.id);
                                    }}
                                    aria-label={`Delete note ${note.id}`}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {viewOpen && selectedNote && (
                <NoteView
                    isOpen={viewOpen}
                    setIsOpen={setViewOpen}
                    note={selectedNote}
                    onEdit={handleEditClick}
                />
            )}
        </>
    );
});

export default NoteList;
