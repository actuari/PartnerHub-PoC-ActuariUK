import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Sites from "./Sites";
import Menu from "./Menu";

export default function Header() {

    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Grid
                container
                spacing={1}
                paddingX={4}
                paddingTop={1.5}
                paddingBottom={0}
                alignItems="center"
                justifyContent="space-between"
            >
                <Grid item>
                    <Sites />
                </Grid>
                <Grid item>
                    <Menu />
                </Grid>
            </Grid >
        </AppBar >
    );
}