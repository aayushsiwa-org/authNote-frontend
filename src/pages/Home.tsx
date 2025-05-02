import { Container, Typography } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import NoteList from "../components/NoteList";
import NoteForm from "../components/NoteForm";

// type Note = { id: string; content: string };

export default function Home() {
    const { logout } = useAuth();
    const queryClient = useQueryClient();

    const { data: notes = [] } = useQuery("notes", async () => {
        const res = await api.get("/api/notes");
        return res.data;
    });

    const addNote = useMutation(
        (content: string) => api.post("/api/notes", { content }),
        { onSuccess: () => queryClient.invalidateQueries("notes") }
    );

    const deleteNote = useMutation(
        (id: string) => api.delete(`/api/notes/${id}`),
        { onSuccess: () => queryClient.invalidateQueries("notes") }
    );

    const editNote = useMutation(
        ({ id, content }: { id: string; content: string }) =>
            api.put(`/api/notes/${id}`, { content }),
        { onSuccess: () => queryClient.invalidateQueries("notes") }
    );

    return (
        <Container style={{ marginTop: "4rem" }}>
            <Typography variant="h4" gutterBottom>
                My Notes
            </Typography>
            <NoteForm onSubmit={(content) => addNote.mutate(content)} />
            <NoteList
                notes={notes}
                onDelete={(id) => deleteNote.mutate(id)}
                onEdit={(note) => {
                    const newContent = prompt("Edit your note:", note.content);
                    if (newContent !== null) {
                        editNote.mutate({ id: note.id, content: newContent });
                    }
                }}
            />
            <Typography
                variant="body2"
                sx={{ mt: 4, cursor: "pointer" }}
                onClick={logout}
            >
                Logout
            </Typography>
        </Container>
    );
}
