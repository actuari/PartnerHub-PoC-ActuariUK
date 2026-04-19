import { Grid, Autocomplete, TextField } from '@mui/material'
import { Degree } from '@prisma/client'
import { useFetch } from '../../../hooks'
import { routes } from '../../../const/routes'
import LoaderCenter from '../LoaderCenter'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Major } from '../../../types/Major'

export default function OfferProperties({ major, setMajor, degree, setDegree }: { major: Major | null, setMajor: Dispatch<SetStateAction<Major | null>>, degree: Degree | null, setDegree: Dispatch<SetStateAction<Degree | null>> }) {
    const { data: degreesResponse, isLoading: areDegreesLoading } = useFetch(routes.api.degrees)
    const degreesList: Degree[] = degreesResponse?.data || []
    const { data: majorsResponse, isLoading: areMajorsLoading } = useFetch(routes.api.majors.$)
    const majorsList: Major[] = majorsResponse?.data || []
    const isLoading = areDegreesLoading || areMajorsLoading;
    useEffect(() => {
        if (!degree && degreesList.length > 0) {
            setDegree(degreesList[0]);
        }
    }, [degree, degreesList, setDegree]);
    return isLoading ? <LoaderCenter /> : (
        <Grid container spacing={2}
            mt={2}
        >
            {/*
            <Grid item xs={12} md={6}>
                <Autocomplete
                    value={major}
                    onChange={(event, newValue) => {
                        setMajor(newValue);
                    }}
                    fullWidth
                    options={majorsList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            label="Select Major"
                            variant="outlined"
                        />
                    )}
                />
            </Grid>
            */}
            {/*
            <Grid item xs={12} md={6}>
                <Autocomplete
                    value={degree}
                    onChange={(event, newValue) => {
                        setDegree(newValue);
                    }}
                    fullWidth
                    options={degreesList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            label="Select Degree"
                            variant="outlined"
                        />
                    )}
                />
            </Grid>
            */}
        </Grid>

    )
}
