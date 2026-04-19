import {
    Autocomplete, Grid, TextField
} from "@mui/material";
import { Major, MajorCategory } from "@prisma/client";
import { useIsDesktop } from "../../hooks";
type Props = {
    majorsList: Major[],
    majorsCategoriesList: MajorCategory[],
    updateMajors: (majors: string[]) => void,
    majorNames: string[],
    majorCategories: string[],
    updateMajorCategories: (majorCategories: string[]) => void
}
export default function MajorFilters({ majorsList, majorsCategoriesList, updateMajors, majorNames, majorCategories, updateMajorCategories }: Props) {
    const isDesktop = useIsDesktop();
    return (
        <Grid container paddingY={isDesktop ? 2 : 0} spacing={isDesktop ? 3 : 2}>
            <Grid item xs={12} md={6}>
                <Autocomplete
                    multiple
                    value={majorNames}
                    onChange={(event, newValue) => {
                        updateMajors(newValue);
                    }}
                    options={majorsList?.map(major => major?.name)}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Major"
                            variant="outlined"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Autocomplete
                    multiple
                    value={majorCategories}
                    onChange={(event, newValue) => {
                        updateMajorCategories(newValue);
                    }}
                    options={majorsCategoriesList?.map(majorCategory => majorCategory?.name)}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Major Category"
                            variant="outlined"
                        />
                    )}
                />
            </Grid>
        </Grid>
    )
}
