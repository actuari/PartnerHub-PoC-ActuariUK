import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import { useContext } from "react";
import { ChatContext } from "../../../contexts/ChatContext";
import { useEmployer, useUser } from "../../../auth/client";
export default function UserMenu() {
    const router = useRouter();
    const userSite = useUser(true);
    const employer = useEmployer(true);
    const { chatRoomsDetails } = useContext(ChatContext);
    const notSeen = Object.values(chatRoomsDetails)
        .filter(({ seenByCompany, seenByUser }: { seenByCompany?: boolean, seenByUser?: boolean }) =>
            (userSite?.email && !seenByUser) || (employer?.email && !seenByCompany)
        ).length
    return (
        userSite?.name ?
            <>
                <Grid item>
                    <Button
                        variant="text"
                        onClick={() => {
                            router.replace(`/user/${userSite?.email}`)
                        }}
                        color="inherit"
                        sx={{ textTransform: "none" }}
                    >
                        <Typography>{userSite?.name}</Typography>
                    </Button>
                </Grid>
                <Grid item>
                    <Grid container spacing={3}>
                        <Grid item>
                            <IconButton color="inherit">
                                <Badge badgeContent={notSeen} color="error" onClick={() => router.push('/chat/main')}>
                                    <MessageOutlinedIcon />
                                </Badge>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            {/*<IconButton color="inherit">
                        <NotificationsOutlinedIcon />
                  </IconButton>*/}
                        </Grid>
                    </Grid>
                </Grid>
            </> : <></>
    )
}
