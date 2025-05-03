import {
    Button,
    Container,
    Typography,
    Box,
    TextField,
    Divider,
    Alert,
    Snackbar,
    Link,
} from "@mui/material";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { register } from "../api/axios";
import { Link as RouterLink } from "react-router-dom"; // Assuming you're using React Router

// Validation schema
const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, "Username too short")
        .max(20, "Username too long")
        .notOneOf(["admin"], "Nice try 😏")
        .required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
});

export default function SignUp() {
    const [error, setError] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const BE_URL =
        import.meta.env.VITE_MODE === "production"
            ? import.meta.env.VITE_BE_URL // Use deployed URL in production
            : "http://localhost:5000";
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Welcome to Notely
            </Typography>
            <Typography variant="h5" gutterBottom>
                Create an account
            </Typography>
            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                }}
                validationSchema={SignupSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        // Map form fields to match the backend expectations
                        const registrationData = {
                            username: values.name, // Changed from name to username
                            email: values.email,
                            password: values.password,
                            // No need to send confirmPassword to the backend
                        };
                        await register(registrationData);
                        // Success handling will be managed by the register function
                        // which redirects to home page
                    } catch (err: unknown) {
                        setError(
                            err instanceof Error
                                ? err.message
                                : "Registration failed"
                        );
                        setOpenSnackbar(true);
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Field
                                name="name"
                                as={TextField}
                                label="Username"
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                fullWidth
                            />
                            <Field
                                name="email"
                                type="email"
                                as={TextField}
                                label="Email"
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                fullWidth
                            />
                            <Field
                                name="password"
                                type="password"
                                as={TextField}
                                label="Password"
                                error={
                                    touched.password && Boolean(errors.password)
                                }
                                helperText={touched.password && errors.password}
                                fullWidth
                            />
                            <Field
                                name="confirmPassword"
                                type="password"
                                as={TextField}
                                label="Confirm Password"
                                error={
                                    touched.confirmPassword &&
                                    Boolean(errors.confirmPassword)
                                }
                                helperText={
                                    touched.confirmPassword &&
                                    errors.confirmPassword
                                }
                                fullWidth
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Signing Up..." : "Sign Up"}
                            </Button>

                            {/* Login link */}
                            <Box textAlign="center" mt={1}>
                                <Typography variant="body2">
                                    Already have an account?{" "}
                                    <Link
                                        component={RouterLink}
                                        to="/login"
                                        color="primary"
                                    >
                                        Login
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Form>
                )}
            </Formik>
            <Divider sx={{ my: 4 }}>OR</Divider>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
            >
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                        (window.location.href = `${BE_URL}/auth/google`)
                    }
                    fullWidth
                >
                    Continue with Google
                </Button>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
}
