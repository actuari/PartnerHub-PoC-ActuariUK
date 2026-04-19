import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import { useContext } from "react";
import { ChatContext } from "../../../contexts/ChatContext";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import { useEmployer, useUser } from "../../../auth/client";

export default function EmployerMenu() {
    const router = useRouter();
    const userSite = useUser(true);
    const employer = useEmployer(true);
    const { chatRoomsDetails } = useContext(ChatContext);
    const notSeen = Object.values(chatRoomsDetails)
        .filter(({ seenByCompany, seenByUser }: { seenByCompany?: boolean, seenByUser?: boolean }) =>
            (userSite?.email && !seenByUser) || (employer?.email && !seenByCompany)
        ).length
    return (
        employer?.name ?
            <>
                <Grid item>
                    <Button
                        variant="text"
                        onClick={() => {
                            router.replace(`/company/${employer?.companyId}`)
                        }}
                        color="inherit"
                        sx={{ textTransform: "none" }}
                    >
                        <Typography>{employer?.name}</Typography>
                    </Button>
                </Grid>
                <Grid item>
                    <Grid container spacing={3}>
                        {employer?.canUpdateCompanyDetails && <Grid item>
                            <IconButton color="inherit" onClick={() => router.push('/company/settings')}>
                                <SettingsOutlined />
                            </IconButton>
                        </Grid>}
                        <Grid item>
                            <IconButton color="inherit" onClick={() => router.push('/company/chat/main')}>
                                <Badge badgeContent={notSeen} color="error">
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
