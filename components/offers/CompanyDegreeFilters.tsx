import {
    Autocomplete, Grid, InputLabel,
    MenuItem,
    OutlinedInput, Select,
    TextField,
    Typography
} from "@mui/material";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { Company } from "@prisma/client";
import { useIsDesktop } from "../../hooks";
type Props = {
    degreeNames: string[],
    degreeName: string,
    companies: Company[],
    setPage: Dispatch<SetStateAction<number>>,
    updateCompanies: (companies: string[]) => void,
    selectedCompanies: string[]
}
export default function CompanyDegreeFilters({ degreeNames, degreeName, companies, setPage, updateCompanies, selectedCompanies }: Props) {
    const router = useRouter();
    const resetPagination = () => setPage(1);
    const isDesktop = useIsDesktop();
    return (
        <Grid container paddingY={2} spacing={isDesktop ? 3 : 2} alignItems={"flex-end"}>
            <Grid item xs={12} md={6}>
                <InputLabel id="degreeslabel">Degrees</InputLabel>
                <Select
                    labelId="degreeslabel"
                    fullWidth
                    value={degreeName}
                    onChange={(value) => {
                        router.replace(`/offers/${value.target.value?.toLowerCase()}`)
                        resetPagination();
                    }}
                    input={<OutlinedInput />}
                    renderValue={(value) => (
                        <Typography display="inline">{value}</Typography>
                    )}
                >
                    {['all', ...degreeNames]?.map((degreeName: string) => (
                        <MenuItem key={degreeName} value={degreeName}>
                            {degreeName}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item xs={12} md={6}>
                <Autocomplete
                    multiple
                    value={selectedCompanies}
                    onChange={(event, newValue) => {
                        updateCompanies(newValue);
                    }}
                    options={companies?.map((company) => company?.name)}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Companies"
                            variant="outlined"
                        />
                    )}
                />
            </Grid>
        </Grid>
    )
}
