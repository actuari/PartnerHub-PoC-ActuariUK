import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn as nextAuthSignIn } from "next-auth/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { FormEvent, useState } from "react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";

export default function RegisterPage() {
  const router = useRouter();
  const callbackUrl =
    typeof router.query.callbackUrl === "string"
      ? router.query.callbackUrl
      : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const bridgeToNextAuth = async (idToken: string) => {
    const result = await nextAuthSignIn("firebase", {
      idToken,
      callbackUrl,
      redirect: false,
    });
    if (!result || result.error) {
      setError("Session creation failed. Please try again.");
      return;
    }
    router.push(result.url || callbackUrl);
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await bridgeToNextAuth(idToken);
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Google sign-up failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must have at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );
      await sendEmailVerification(result.user);
      setSuccess(
        "Account created! A verification email has been sent. Please check your inbox (and spam folder), verify your email, then sign in."
      );
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const code = err.code || "";
      if (code === "auth/email-already-in-use") {
        setError(
          "An account with this email already exists. Please sign in instead."
        );
      } else if (code === "auth/weak-password") {
        setError(
          "Password is too weak. Use at least 8 characters with a mix of letters and numbers."
        );
      } else if (code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError(err.message || "Registration failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minHeight="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding={2}
    >
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} mb={0.5}>
            Create account
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Register to get started. Any email domain is accepted.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogle}
                disabled={isLoading}
                sx={{ textTransform: "none", py: 1.2 }}
              >
                Sign up with Google
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider>or</Divider>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={handleRegister}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="email"
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Password (min. 8 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </Grid>
                  {error && (
                    <Grid item xs={12}>
                      <Alert severity="error">
                        {error}
                        {error.includes("already exists") && (
                          <>
                            {" "}
                            <NextLink
                              href="/auth/signin"
                              passHref
                              legacyBehavior
                            >
                              <MuiLink underline="always" fontWeight={600}>
                                Go to sign in
                              </MuiLink>
                            </NextLink>
                          </>
                        )}
                      </Alert>
                    </Grid>
                  )}
                  {success && (
                    <Grid item xs={12}>
                      <Alert severity="success">
                        {success}{" "}
                        <NextLink href="/auth/signin" passHref legacyBehavior>
                          <MuiLink underline="always" fontWeight={600}>
                            Go to sign in
                          </MuiLink>
                        </NextLink>
                      </Alert>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={
                        isLoading || !email || !password || !confirmPassword
                      }
                      sx={{ textTransform: "none", py: 1.2 }}
                    >
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" textAlign="center">
                Already have an account?{" "}
                <NextLink href="/auth/signin" passHref legacyBehavior>
                  <MuiLink underline="hover" fontWeight={600}>
                    Sign in
                  </MuiLink>
                </NextLink>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
