import { Button, Card, CardContent, Typography, Grid } from "@mui/material";

type Note = {
    id: string;
    content: string;
};

type Props = {
    notes: Note[];
    onDelete: (id: string) => void;
    onEdit: (note: Note) => void;
};

export default function NoteList({ notes, onDelete, onEdit }: Props) {
    return (
        <Grid container spacing={2}>
            {notes.map((note) => (
                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                    }}
                >
                    <Card
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            p: 2,
                            boxShadow: 3,
                            transition: "0.3s",
                            "&:hover": {
                                boxShadow: 6,
                            },
                        }}
                        key={note.id}
                    >
                        <CardContent>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {note.content}
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => onEdit(note)}
                                sx={{ mr: 1 }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => onDelete(note.id)}
                            >
                                Delete
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
