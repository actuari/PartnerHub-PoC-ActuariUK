import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Thesys from "../../../assets/Thesys.png";
import GoogleIcon from '@mui/icons-material/Google';
import { useRouter } from "next/router";
import { useState } from "react";
import { sessionDataToEmail, useEmployer, useGetEmail, useHasBothAccounts, useUser } from "../../../auth/client";
import { signIn, useSession } from "next-auth/react";
import { Avatar, CircularProgress, Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { getImageSrc } from "../../../hooks";
import MenuIcon from '@mui/icons-material/Menu';
import UserMenu from "./UserMenu";
import EmployerMenu from "./EmployerMenu";
import UserSites from "./UserSites";
import EmployerSites from "./EmployerSites";
import Image from "next/image";

export default function Header() {
    const router = useRouter();
    const userSite = useUser(true);
    const employer = useEmployer(true);
    const hasBothAccounts = useHasBothAccounts(true);
    const { data: session, status } = useSession();
    const isLoading = (status === "loading" || !!sessionDataToEmail(session)) && !userSite && !employer && (!router.pathname || router.pathname !== "/register")
    const email = useGetEmail();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Grid container
                spacing={3}
                paddingX={3}
                paddingTop={1.5}
                paddingBottom={0}
                alignItems="center"
                justifyContent="space-between">
                <Grid item>
                    <IconButton onClick={() => setMenuOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                </Grid>
                <Grid item>
                    <Button
                        variant="text"
                        onClick={() => {
                            router.replace("/")
                        }}
                        color="inherit"
                        sx={{ textTransform: "none" }}
                    >
                        <Image src={Thesys} alt="logo" />
                    </Button>
                </Grid>
                <Grid item>
                    {!!userSite ? <IconButton onClick={handleClick}>
                        <Avatar src={getImageSrc(email!)} />
                    </IconButton> : employer ?
                        <IconButton onClick={handleClick}>
                            <Avatar src={getImageSrc(employer?.company?.name)} />
                        </IconButton> : router.pathname !== "/register" ?
                            <IconButton onClick={() => signIn()}>
                                <GoogleIcon />
                            </IconButton>
                            : <></>}
                    {isLoading && <CircularProgress size="1rem" />}
                </Grid>
            </Grid>
            {!!userSite ? <UserMenu anchorEl={anchorEl} email={email} employer={employer} hasBothAccounts={hasBothAccounts} setAnchorEl={setAnchorEl} /> :
                employer ? <EmployerMenu anchorEl={anchorEl} employer={employer} hasBothAccounts={hasBothAccounts} setAnchorEl={setAnchorEl} /> : <></>}
            {!!userSite ? <UserSites menuOpen={menuOpen} setMenuOpen={setMenuOpen} /> : employer ? <EmployerSites employer={employer} menuOpen={menuOpen} setMenuOpen={setMenuOpen} /> : <Drawer
                anchor="top"
                open={menuOpen}
                onClick={() => setMenuOpen(false)}
                onClose={() => setMenuOpen(false)}
            >
                <List>
                    <ListItemButton onClick={() => router.push("/offers/all")}>
                        <ListItemText primary={"Offers"} />
                    </ListItemButton>
                </List>
            </Drawer>}
        </AppBar >
    );
}