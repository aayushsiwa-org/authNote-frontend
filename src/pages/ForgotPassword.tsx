import {
    Button,
    Container,
    Typography,
    Box,
    TextField,
    Alert,
    Snackbar,
    Link,
    Paper,
} from "@mui/material";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link as RouterLink } from "react-router-dom";

// Add this API function to your axios.js file
// export const requestPasswordReset = async (email) => {
//   try {
//     await api.post('/auth/forgot-password', { email });
//     return true;
//   } catch (err) {
//     console.error("Password reset request error:", err?.response?.data || err);
//     throw new Error(err?.response?.data?.message || "Failed to request password reset");
//   }
// };

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPassword() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Forgot Password
            </Typography>

            <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
                {!success ? (
                    <>
                        <Typography variant="body1" paragraph>
                            Enter your email address and we'll send you a link
                            to reset your password.
                        </Typography>

                        <Formik
                            initialValues={{
                                email: "",
                            }}
                            validationSchema={ForgotPasswordSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    // Uncomment when you implement the API function
                                    // await requestPasswordReset(values.email);

                                    // For now, just simulate success
                                    console.log(
                                        "Password reset requested for:",
                                        values.email
                                    );
                                    setTimeout(() => {
                                        setSuccess(true);
                                    }, 1000);
                                } catch (err: any) {
                                    setError(
                                        err?.message ||
                                            "Failed to request password reset"
                                    );
                                    setOpenSnackbar(true);
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ errors, touched, isSubmitting }) => (
                                <Form>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        gap={2}
                                    >
                                        <Field
                                            name="email"
                                            type="email"
                                            as={TextField}
                                            label="Email"
                                            error={
                                                touched.email &&
                                                Boolean(errors.email)
                                            }
                                            helperText={
                                                touched.email && errors.email
                                            }
                                            fullWidth
                                        />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                            fullWidth
                                        >
                                            {isSubmitting
                                                ? "Sending..."
                                                : "Reset Password"}
                                        </Button>

                                        <Box textAlign="center" mt={1}>
                                            <Typography variant="body2">
                                                Remember your password?{" "}
                                                <Link
                                                    component={RouterLink}
                                                    to="/login"
                                                    color="primary"
                                                >
                                                    Back to login
                                                </Link>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </>
                ) : (
                    <Box textAlign="center" py={2}>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Check your email for a password reset link!
                        </Alert>

                        <Typography variant="body1" paragraph>
                            We've sent an email to the address you provided with
                            instructions to reset your password.
                        </Typography>

                        <Typography variant="body2" paragraph>
                            Didn't receive an email? Check your spam folder or{" "}
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSuccess(false);
                                }}
                                color="primary"
                            >
                                try again
                            </Link>
                        </Typography>

                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Back to Login
                        </Button>
                    </Box>
                )}
            </Paper>

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
