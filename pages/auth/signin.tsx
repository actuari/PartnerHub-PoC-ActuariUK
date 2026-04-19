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
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";

export default function SignInPage() {
  const router = useRouter();
  const callbackUrl =
    typeof router.query.callbackUrl === "string"
      ? router.query.callbackUrl
      : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await bridgeToNextAuth(idToken);
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Google sign-in failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      if (!result.user.emailVerified) {
        setError(
          "Your email is not verified yet. Check your inbox for a verification link."
        );
        setIsLoading(false);
        return;
      }
      const idToken = await result.user.getIdToken();
      await bridgeToNextAuth(idToken);
    } catch (err: any) {
      const code = err.code || "";
      if (
        code === "auth/user-not-found" ||
        code === "auth/invalid-credential"
      ) {
        setError(
          "No account found with this email, or wrong password. Check your credentials or register a new account."
        );
      } else if (code === "auth/wrong-password") {
        setError("Wrong password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many login attempts. Try again later.");
      } else {
        setError(err.message || "Sign-in failed.");
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
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Welcome back. Log in to your account.
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
                Continue with Google
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider>or</Divider>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={handleSignIn}>
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
                      label="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </Grid>
                  {error && (
                    <Grid item xs={12}>
                      <Alert severity="error">{error}</Alert>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={isLoading || !email || !password}
                      sx={{ textTransform: "none", py: 1.2 }}
                    >
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" textAlign="center">
                Don&apos;t have an account?{" "}
                <NextLink href="/auth/register" passHref legacyBehavior>
                  <MuiLink underline="hover" fontWeight={600}>
                    Register
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
