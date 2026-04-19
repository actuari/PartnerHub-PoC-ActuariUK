import { CircularProgress, Grid } from "@mui/material";

export default function LoaderCenter() {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={2}>
        <CircularProgress size="50%" />
      </Grid>
    </Grid>
  );
}
