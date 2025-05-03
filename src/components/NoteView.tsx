import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    Typography,
} from "@mui/material";
import { Close, Edit } from "@mui/icons-material";
import { Note } from "./types";

type Props = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    note: Note | null;
    onEdit: (note: Note) => void;
};

export default function NoteView({ isOpen, setIsOpen, note, onEdit }: Props) {
    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    Note Details
                    <IconButton onClick={() => setIsOpen(false)} size="small">
                        <Close />
                    </IconButton>
                </Typography>
                {note?.createdAt && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, fontStyle: "italic" }}
                    >
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </Typography>
                )}
            </DialogTitle>
            <DialogContent>
                <Typography
                    variant="body1"
                    sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                    {note?.content}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Edit />}
                    onClick={() => note && onEdit(note)}
                >
                    Edit
                </Button>
                <Button variant="outlined" onClick={() => setIsOpen(false)}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
