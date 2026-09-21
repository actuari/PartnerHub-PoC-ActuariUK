import { SimCardDownload } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemIcon, ListItemText } from "@mui/material";
import { useRouter } from "next/router";
import { getCvSrc, getImageSrc } from "../../hooks";
import { User } from "../../types/User/Basic";

interface UserSummaryProps {
    user: User;
}

function UserSummary({ user }: UserSummaryProps) {
    const router = useRouter();
    return (
        <ListItem>
            <ListItemAvatar>
                <IconButton onClick={() => router.push(`/user/${user.email}`)}>
                    <Avatar src={getImageSrc(user.email)} />
                </IconButton>
            </ListItemAvatar>
            <ListItemText primary={`${user.name} ${user.surname}`} />
            <ListItemIcon>
                <IconButton download href={getCvSrc(user.email)} target="_blank">
                    <SimCardDownload />
                </IconButton>
            </ListItemIcon>
        </ListItem>
    );
}

export default UserSummary;
