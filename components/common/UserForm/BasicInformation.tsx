import { Dispatch, SetStateAction, useState } from "react";
import { TextField, Grid, Input, IconButton, Box, Avatar, Badge } from "@mui/material";
import { getImageSrc } from "../../../hooks";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { routes } from "../../../const/routes";

export default function BasicInformation({ name, surname, email, setName, setSurname }: { name: string, surname: string, email: string, setName: Dispatch<SetStateAction<string>>, setSurname: Dispatch<SetStateAction<string>> }) {
    const [src, setSrc] = useState(getImageSrc(email));
    const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        // Handle file change here
        setSrc(_ => "data:,");
        const formData = new FormData();
        formData.append('file', event.target.files?.[0]!)
        await fetch(routes.api.users.image.upload, {
            method: 'POST',
            body: formData,
        })
        fetch(getImageSrc(email), {
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        })
            .then(() => setSrc(_ => getImageSrc(email)))
            .catch(() => setTimeout(() => setSrc(_ => getImageSrc(email)), 3000))
    }
    return (
        <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
                <Grid item xs>
                    <Box paddingY={1}>
                        <TextField
                            margin="normal"
                            label="Name"
                            fullWidth
                            variant="outlined"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </Box>
                    <Box paddingY={1}>
                        <TextField
                            label="Surname"
                            fullWidth
                            variant="outlined"
                            value={surname}
                            onChange={(event) => setSurname(event.target.value)}
                        />
                    </Box>
                    <Box paddingY={1}>
                        <TextField
                            disabled
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={email}
                        />
                    </Box>
                </Grid>
                <Grid item style={{ margin: 'auto', width: "200px" }}>
                    <Badge overlap="circular" sx={{ margin: 'auto' }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={<><Input
                            sx={{ display: 'none' }}
                            id="avatar-file"
                            type="file"
                            onChange={handleAvatarChange}
                        />
                            <label htmlFor="avatar-file">
                                <IconButton component="span">
                                    <Avatar>
                                        <FileUploadIcon />
                                    </Avatar>
                                </IconButton>
                            </label></>}>
                        <Avatar src={src} sx={{ margin: 'auto', height: '150px', width: '150px', border: '1px solid black' }} />
                    </Badge>
                </Grid>
            </Grid>
        </Grid>

    )
}
