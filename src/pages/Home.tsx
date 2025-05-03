import { Container, Typography, Button, Box } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import NoteList from "../components/NoteList";
import NoteDialog from "../components/NoteDialog";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";
import { Note } from "../components/types";
import { useNavigate } from "react-router-dom"; // for better navigation handling

export default function Home() {
    const { logout } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate(); // Use useNavigate instead of window.location
    const [open, setOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState<Note>({
        id: "",
        content: "",
    });

    // Fetch notes data
    const { data: notes = [], isLoading, isError } = useQuery("notes", async () => {
        const res = await api.get("/api/notes");
        return res.data;
    });

    // Mutation for adding a new note
    const addNote = useMutation(
        (content: string) => api.post("/api/notes", { content }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("notes");
            },
            onError: (error) => {
                console.error("Failed to add note:", error);
            },
        }
    );

    // Mutation for deleting a note
    const deleteNote = useMutation(
        (id: string) => api.delete(`/api/notes/${id}`),
        { onSuccess: () => queryClient.invalidateQueries("notes") }
    );

    // Mutation for editing a note
    const editNote = useMutation(
        ({ id, content }: { id: string; content: string }) =>
            api.put(`/api/notes/${id}`, { content }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("notes");
            },
            onError: (error) => {
                console.error("Failed to edit note:", error);
            },
        }
    );

    const handleOpen = () => {
        setCurrentNote({
            id: "",
            content: "",
            createdAt: new Date().toISOString(),
        });
        setOpen(true);
    };

    const handleSave = () => {
        if (!currentNote?.content.trim()) return;

        if (currentNote.id) {
            editNote.mutate({
                id: currentNote.id,
                content: currentNote.content,
            });
        } else {
            addNote.mutate(currentNote.content);
        }
        setOpen(false);
        setCurrentNote({
            id: "",
            content: "",
            createdAt: new Date().toISOString(),
        });
    };

    const handleLogout = () => {
        logout();
        navigate("/"); // React Router navigation instead of window.location.href
    };

    if (isLoading) return <Typography>Loading notes...</Typography>;
    if (isError) return <Typography>Error loading notes.</Typography>;

    return (
        <Container style={{ marginTop: "4rem" }}>
            <Box
                mb={3}
                component="section"
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h4" gutterBottom>
                    My Notes
                </Typography>
                <Button
                    onClick={handleOpen}
                    variant="contained"
                    sx={{ backgroundColor: "black" }}
                    startIcon={<AddCircleOutlineIcon />}
                >
                    New Note
                </Button>
            </Box>

            <NoteDialog
                isEditing={open}
                setIsEditing={setOpen}
                currentNote={currentNote}
                setCurrentNote={setCurrentNote}
                handleSave={handleSave}
            />

            <NoteList
                notes={notes}
                onDelete={(id) => deleteNote.mutate(id)}
                onEdit={(note) => {
                    setCurrentNote(note);
                    setOpen(true);
                }}
            />

            <Button
                variant="contained"
                sx={{ mt: 4, cursor: "pointer" }}
                onClick={handleLogout}
                color="error"
            >
                Logout
            </Button>
        </Container>
    );
}
