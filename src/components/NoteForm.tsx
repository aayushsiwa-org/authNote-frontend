import { useState } from "react";
import { TextField, Button, Fab, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type Props = {
    onSubmit: (content: string) => void;
    initial?: string;
};

export default function NoteForm({ onSubmit, initial = "" }: Props) {
    const [content, setContent] = useState(initial);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onSubmit(content);
            setContent("");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Note"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    margin="normal"
                />
                <Button variant="contained" type="submit">
                    Save
                </Button>
            </form>

            <Box
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                }}
            >
                <Fab color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
            </Box>
        </>
    );
}
