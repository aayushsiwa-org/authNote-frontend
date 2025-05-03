import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Note } from "./types";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

type Props = {
    isEditing: boolean;
    setIsEditing: (open: boolean) => void;
    currentNote: Note;
    setCurrentNote: (note: Note) => void;
    handleSave: () => void;
};

export default function NoteDialog({
    isEditing,
    setIsEditing,
    currentNote,
    setCurrentNote,
    handleSave,
}: Props) {
    const originalContentRef = useRef<string>("");
    const [hasChanged, setHasChanged] = useState<boolean>(false);

    // When the dialog opens, store the original content
    useEffect(() => {
        if (isEditing) {
            originalContentRef.current = currentNote?.content || "";
            setHasChanged(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing]);

    useEffect(() => {
        const contentChanged =
            currentNote?.content !== originalContentRef.current;
        setHasChanged(contentChanged);

        console.log(`Content changed: ${contentChanged}`);
    }, [currentNote?.content]);

    const handleKeyDown = (e: KeyboardEvent) => {
        const isMac = navigator.platform.toLowerCase().includes("mac");
        const saveCombo = isMac ? e.metaKey : e.ctrlKey;
        if (saveCombo && e.key === "Enter") {
            e.preventDefault();
            // Only save if content has changed and is not empty
            if (
                currentNote?.content?.trim() &&
                (hasChanged || !currentNote.id)
            ) {
                handleSave();
            }
        }
    };

    const handleContentChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setCurrentNote({
            ...currentNote,
            content: e.target.value,
        });
    };

    // Determine if save should be disabled:
    // - Disable if content is empty
    // - Disable if existing note and content hasn't changed
    const isSaveDisabled =
        !currentNote?.content?.trim() || (!!currentNote?.id && !hasChanged);

    return (
        <Dialog
            open={isEditing}
            onClose={() => setIsEditing(false)}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                {currentNote?.id ? "Edit Note" : "Create New Note"}
                <IconButton
                    aria-label="close"
                    onClick={() => setIsEditing(false)}
                    size="small"
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="note-content"
                    label="Note"
                    type="text"
                    fullWidth
                    multiline
                    rows={6}
                    value={currentNote?.content || ""}
                    onChange={handleContentChange}
                    onKeyDown={handleKeyDown}
                    variant="outlined"
                />
                <Typography variant="caption" color="text.secondary">
                    Press Ctrl+Enter (or Cmd+Enter) to save.
                    {currentNote?.id && !hasChanged && (
                        <span> No changes detected.</span>
                    )}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                    variant="contained"
                    color="primary"
                >
                    Save Note
                </Button>
            </DialogActions>
        </Dialog>
    );
}
