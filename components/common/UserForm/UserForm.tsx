import React, { useState } from "react";
import { TextField, Button, Grid, Input, IconButton, CircularProgress, Card, CardContent } from "@mui/material";
import { University, Degree, Major } from "@prisma/client";
import { getCvSrc } from "../../../hooks";
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { User } from "../../../types/User/Basic";
import { routes } from "../../../const/routes";
import TextEditor from "../TextEditor";
import { parseJson } from "../SingleOffer";
import { UserCreate } from "../../../types/User/Create";
import BasicInformation from "./BasicInformation";

interface Props {
    user: User | {
        email: string,
        name: string,
        surname: string
    },
    email: string,
    universitiesList: University[],
    degreesList: Degree[],
    majorsList: Major[],
    action: (user: UserCreate) => void,
    actionString: string,
    cancelAction: () => void
}
const Update = ({ user,
    email,
    universitiesList,
    degreesList,
    majorsList,
    action,
    actionString,
    cancelAction
}: Props) => {
    const [name, setName] = useState(user?.name)
    const [surname, setSurname] = useState(user?.surname)
    const [university, setUniversity] = useState<University | null>((user as User)?.university || null)
    const [degree, setDegree] = useState<Degree | null>((user as User)?.degree || null)
    const [major, setMajor] = useState<Major | null>((user as User)?.major || null)
    const [year, setYear] = useState(`${(user as User)?.year}`);
    const [bioState, setBioState] = useState(parseJson((user as User)?.bio || ""));

    const [cvFound, setCvFound] = useState<{ isLoading: boolean, isSuccess: boolean, isError: boolean }>({
        isLoading: false, isSuccess: false, isError: false
    });
    const handleCvChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setCvFound({
            isLoading: true,
            isSuccess: false,
            isError: false,
        })
        // Handle file change here
        const formData = new FormData();
        formData.append('file', event.target.files?.[0]!)

        fetch(routes.api.users.cv.upload, {
            method: 'POST',
            body: formData,
        }).then(data => {
            setCvFound({
                isError: !data.ok,
                isSuccess: data.ok,
                isLoading: false
            })
        }).catch(() => setCvFound({
            isError: true,
            isSuccess: false,
            isLoading: false
        }))
    }
    const newUser = {
        email,
        name,
        surname,
        universityId: university?.id!,
        degreeId: degree?.id!,
        majorId: major?.id!,
        year: Number.parseInt(year),
        bio: JSON.stringify(bioState)
    }
    return <Card>
        <CardContent>
            <Grid container spacing={3} justifyContent="space-around">
                <BasicInformation email={email} name={name} setName={setName} setSurname={setSurname} surname={surname} />
                {/*
                <Grid item xs={12} md={8}>
                    <Autocomplete
                        value={university}
                        onChange={(event, newValue) => {
                            setUniversity(newValue);
                        }}
                        options={universitiesList}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select University"
                                variant="outlined"
                            />
                        )}
                    />
                </Grid>
                */}
                {/*
                <Grid item xs={12} md={8}>
                    <Autocomplete
                        value={degree}
                        onChange={(event, newValue) => {
                            setDegree(newValue);
                        }}
                        options={degreesList}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Degree"
                                variant="outlined"
                            />
                        )}
                    />
                </Grid>
                */}
                {/*
                <Grid item xs={12} md={8}>
                    <Autocomplete
                        value={major}
                        onChange={(event, newValue) => {
                            setMajor(newValue);
                        }}
                        options={majorsList}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Major"
                                variant="outlined"
                            />
                        )}
                    />
                </Grid>
                */}
                <Grid item xs={12} md={8}>
                    <Grid container justifyContent="space-between">
                        {/*
                        <Grid item xs={6}>
                            <TextField
                                label="Year"
                                variant="outlined"
                                value={year}
                                InputProps={{ inputProps: { type: "number", min: 1, max: 10 } }}
                                onChange={(event) => setYear(event.target.value)}
                            />
                        </Grid>
                        */}
                        <Grid item xs={12} textAlign="right">
                            <Input
                                sx={{ display: 'none' }}
                                id="cv-file"
                                type="file"
                                onChange={handleCvChange}
                            />
                            <label htmlFor="cv-file">
                                <Button variant="contained" color="primary" component="span">
                                    CV
                                </Button>
                            </label>
                            {cvFound.isLoading ? <CircularProgress /> : <IconButton disabled={!cvFound.isSuccess} download href={getCvSrc(email)} target="_blank">
                                <FileDownloadDoneIcon color={cvFound.isSuccess ? 'success' : cvFound.isError ? 'error' : 'disabled'} />
                            </IconButton>}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={8}>
                    <TextEditor handleContent={setBioState} value={bioState} />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Grid container justifyContent="space-between">
                        <Grid item xs={6}>
                            <Button onClick={cancelAction}>Cancel</Button>
                        </Grid>
                        <Grid item xs={6} textAlign="right">
                            <Button disabled={!degree || !university} onClick={() => action(newUser)}>{actionString}</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </CardContent>
    </Card >
};

export default Update;
