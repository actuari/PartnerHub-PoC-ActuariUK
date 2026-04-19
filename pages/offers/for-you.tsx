import useSwr from "swr";
import OffersList from "../../components/common/OffersList";
import {
    Autocomplete,
    Box,
    Button,
    Chip,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Pagination,
    Select,
    SelectChangeEvent,
    TextField,
    Zoom,
} from "@mui/material";
import { useState } from "react";
import { Company } from "@prisma/client";
import { useUser, useUserGuard } from "../../auth/client";
import { useFetch, useIsDesktop } from "../../hooks";
import { routes } from "../../const/routes";
import { Search } from "@mui/icons-material";

export default function Home() {
    const userUrl = routes.api.users.email;
    const { data: userApiData, mutate: updateUserData, isLoading: isUserLoading } = useFetch(userUrl);
    const userData = userApiData?.data;
    const [page, setPage] = useState(1);
    const { data, error, isLoading: areCompaniesLoading } = useFetch(routes.api.companies);
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
    const user = useUser();
    const degree = user?.degree?.name
    const major = user?.major
    const majorName = major?.name
    const majorCategory = major?.category?.name
    const offersUrl = `${routes.api.offers.$}?degree=${degree}&page=${page}&companies=${selectedCompanies.join(",")}&majors=${(majorName) ? encodeURIComponent(majorName) : ""}&majorCategories=${(majorCategory) ? encodeURIComponent(majorCategory) : ""}`;
    const { data: offersData, error: offersError, mutate: updateOfferData, isLoading: areOffersLoading } = useFetch(offersUrl);
    const companies: Company[] = data?.data;
    const offers = offersData?.data;
    const maxPage = offersData?.maxPage || 1;
    const handleChange = (_: any, values: string[]) => {
        setSelectedCompanies(values);
        setPage(1);
    };
    const mutate = () => {
        updateOfferData();
        updateUserData();
    }
    const isLoading = isUserLoading || areCompaniesLoading || areOffersLoading
    useUserGuard(user => !!user);
    const isDesktop = useIsDesktop();
    return (
        <Box margin="auto" sx={{ minHeight: "50%" }} padding={isDesktop ? 5 : 2}>
            <Zoom in={true} mountOnEnter unmountOnExit>
                <Box mb={2}>
                    <Autocomplete
                        options={companies?.map(company => company.name) || []}
                        //groupBy={(option) => option.type}
                        //getOptionLabel={(option) => option.title}
                        value={selectedCompanies}
                        onChange={handleChange}
                        multiple
                        sx={{
                            "& fieldset": { border: 'none', borderBottom: '1px solid black', borderRadius: 0 },
                        }}
                        renderInput={(params) => <TextField {...params} label="Search for a company" InputProps={{
                            ...params?.InputProps,
                            startAdornment: (
                                <>
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                    {params?.InputProps?.startAdornment}
                                </>
                            ),
                        }} />}
                    />
                </Box>
            </Zoom>
            <OffersList offers={offers || []} mutate={mutate} userData={userData} isLoading={isLoading} />
            <Pagination
                count={maxPage}
                page={page}
                onChange={(e, v) => setPage(v)}
                sx={{ marginTop: '10px' }}
            />
        </Box>
    );
}
