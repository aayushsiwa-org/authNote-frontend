import { Button, Container, Typography } from '@mui/material';

export default function Login() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Welcome to Notely</Typography>
      <Button variant="contained" onClick={() => window.location.href = 'https://authnote-backend.onrender.com/auth/google'}>
        Sign in with Google
      </Button>
    </Container>
  );
}