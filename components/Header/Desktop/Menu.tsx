import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import GoogleIcon from '@mui/icons-material/Google';
import { useRouter } from "next/router";
import LogoutIcon from '@mui/icons-material/Logout';
import SwitchAccount from "@mui/icons-material/SwitchAccount";
import { sessionDataToEmail, useEmployer, useHasBothAccounts, useUser } from "../../../auth/client";
import { signIn, signOut, useSession } from "next-auth/react";
import { setPriority } from "../../../features/userPriority/reducer";
import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import UserMenu from "./UserMenu";
import EmployerMenu from "./EmployerMenu";

export default function Menu() {
    const router = useRouter();
    const userSite = useUser(true);
    const employer = useEmployer(true);
    const hasBothAccounts = useHasBothAccounts(true);
    const { data: session, status } = useSession();
    const isLoading = (status === "loading" || !!sessionDataToEmail(session)) && !userSite && !employer && (!router.pathname || router.pathname !== "/register")
    const dispatch = useDispatch();

    return (
        <Grid container spacing={2} alignItems="center">
            <UserMenu />
            <EmployerMenu />
            <Grid item>
                {hasBothAccounts && <Tooltip title={`Switch to ${!!employer ? "student" : "employer"} account`}>
                    <IconButton onClick={() => dispatch(setPriority(!!employer ? "user" : "employer"))}>
                        <SwitchAccount />
                    </IconButton>
                </Tooltip>}
            </Grid>
            <Grid item>
                {(employer?.name || userSite?.name) ?
                    <IconButton
                        onClick={() => {
                            signOut();
                        }}
                        color="inherit"
                    >
                        <LogoutIcon />
                    </IconButton> :
                    router.pathname !== "/register" ?
                        <IconButton onClick={() => signIn()}>
                            <GoogleIcon />
                        </IconButton>
                        : <></>}
            </Grid>
            <Grid item>
                {isLoading && <CircularProgress size="1rem" />}
            </Grid>
        </Grid>
    )
}
