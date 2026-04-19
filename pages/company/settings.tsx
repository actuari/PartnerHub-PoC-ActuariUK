
import { getImageSrc, useFetch, useIsDesktop } from "../../hooks";
import { useEmployer, useEmployerGuard } from "../../auth/client";
import { routes } from "../../const/routes";
import LoaderCenter from "../../components/common/LoaderCenter";
import { Avatar, Badge, Box, Button, Card, CardContent, Grid, IconButton, Input, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Company } from "../../types/Company";
import TextEditor from "../../components/common/TextEditor";
import { useEffect, useState } from "react";
import { parseJson } from "../../components/common/SingleOffer";
import { addMessage } from "../../features/responseSnackbar/reducer";
import { useRouter } from "next/router";
import { FileUpload } from "@mui/icons-material";
export default function Account() {
    const employer = useEmployer();
    const { data: companyData, isLoading, mutate } = useFetch(`${routes.api.companies}/${employer?.companyId}`);
    const company: Company | undefined = companyData?.data;
    const [description, setDescription] = useState(parseJson(company?.description || ""));
    const [link, setLink] = useState(company?.link);
    const router = useRouter();
    const resetData = () => {
        setDescription(parseJson(company?.description || ""));
        setLink(company?.link)
    }
    const cancel = () => {
        resetData();
        router.push(`/company/${employer?.companyId}`)
    }
    useEffect(resetData, [company])
    const dispatch = useDispatch();
    const update = () => {
        fetch(`${routes.api.companies}/${employer?.companyId}`, {
            method: "PUT",
            body: JSON.stringify({
                name: company?.name,
                link,
                description: JSON.stringify(description)
            })
        }).then(data => {
            dispatch(addMessage({
                errorMessage: 'Failed to update company',
                successMessage: 'Successfully updated company information',
                isError: !data.ok,
                isSuccess: data.ok
            }))
            if (data.ok) {
                mutate();
                router.push(`/company/${employer?.companyId}`)
            }
        }).catch(() => {
            dispatch(addMessage({
                errorMessage: 'Failed to update company',
                successMessage: 'Successfully updated company information',
                isError: true,
                isSuccess: false
            }))
        })
    }
    const [src, setSrc] = useState(getImageSrc(employer?.company?.name || ""));
    useEmployerGuard(employer => !!employer && employer?.canUpdateCompanyDetails);

    const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        // Handle file change here
        setSrc(_ => "data:,");
        const formData = new FormData();
        formData.append('file', event.target.files?.[0]!)
        await fetch(`${routes.api.companies}/image/upload`, {
            method: 'POST',
            body: formData,
        })
        fetch(getImageSrc(employer?.company?.name || ""), {
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        })
            .then(() => setSrc(_ => getImageSrc(employer?.company?.name || "")))
            .catch(() => setTimeout(() => setSrc(_ => getImageSrc(employer?.company?.name || "")), 3000))
    }
    const isDesktop = useIsDesktop();
    return isLoading ? <LoaderCenter /> : company ? (
        <Box padding={isDesktop ? 10 : 0}>
            <Card>
                <CardContent>
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
                                            <FileUpload />
                                        </Avatar>
                                    </IconButton>
                                </label></>}>
                            <Avatar src={src} sx={{ margin: 'auto', height: '150px', width: '150px', border: '1px solid black' }} />
                        </Badge>
                    </Grid>
                    <Grid container spacing={3} justifyContent="space-around">
                        <Grid item xs={12} md={8}>
                            <Box paddingY={1}>
                                <TextField
                                    margin="normal"
                                    label="Name"
                                    fullWidth
                                    disabled
                                    variant="outlined"
                                    value={company?.name}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Box paddingY={1}>
                                <TextField
                                    margin="normal"
                                    label="Link"
                                    fullWidth
                                    variant="outlined"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <TextEditor handleContent={setDescription} value={description} />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Grid container justifyContent="space-between">
                                <Grid item xs={6}>
                                    <Button onClick={cancel}>Cancel</Button>
                                </Grid>
                                <Grid item xs={6} textAlign="right">
                                    <Button onClick={update}>Update</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    ) : <></>;
};