import OffersList from "../common/OffersList";
import {
    Autocomplete,
    Box, Button, Chip, Grow, InputAdornment, Menu, MenuItem, Pagination, TextField, Typography
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Company, Degree, MajorCategory } from "@prisma/client";
import { useFetch, useIsDesktop } from "../../hooks";
import { useSWRConfig } from "swr";
import { routes } from "../../const/routes";
import { Offer } from "../../types/Offer/WithoutApplicants";
import { Major } from "../../types/Major";
import { KeyboardArrowDown, Search } from "@mui/icons-material";
const MajorCategoryChip = ({ label, selected, onClick }: { label: string, selected: boolean; onClick: () => void }) => {
    return (
        <Chip onClick={onClick} label={label} sx={selected ? { background: 'black', color: 'white', margin: '4px', fontSize: '16px' } : { background: 'white', margin: '4px', border: '0.5px solid #28293D', fontSize: '16px' }} />
    )
}
const MajorCategoryChips = ({ majorsCategoriesList, majorsCategories, onClick }: { majorsCategoriesList: MajorCategory[]; majorsCategories: string[]; onClick: (name: string) => void }) => {
    const majorsCategoriesListNames = majorsCategoriesList.map(majorCategory => majorCategory.name)?.filter(majorCategoryName => !!majorCategoryName);

    return (
        <Box my={3}>
            <MajorCategoryChip label="All" selected={!majorsCategories?.length} onClick={() => onClick("All")} />
            {
                majorsCategoriesListNames.map(majorCategoryName => <MajorCategoryChip key={majorCategoryName} label={majorCategoryName} onClick={() => onClick(majorCategoryName)} selected={majorsCategories?.includes(majorCategoryName)} />)
            }
        </Box>
    )
}
export default function Offers(props: { degreeName: string, degrees: Degree[], majors: Major[], majorCategories: MajorCategory[] }) {
    const router = useRouter();
    const { mutate: swrmutate } = useSWRConfig();
    const [page, setPage] = useState(1);
    const { data: companiesData, error, isLoading: areCompaniesLoading } = useFetch(routes.api.companies);
    const userUrl = routes.api.users.email;
    const { data: userApiData, isLoading: isUserLoading } = useFetch(userUrl);
    const userData = userApiData?.data;
    const queryParams = useMemo(() => router.query || {}, [router]);
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
    const [majorNames, setMajors] = useState<string[]>([]);
    const [majorCategories, setMajorCategories] = useState<string[]>([]);
    const [degreesMenuOpen, setDegreesMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const filters = `companies=${selectedCompanies.join(",")}&majors=${majorNames ? encodeURIComponent(majorNames.join(',')) : ""}&majorCategories=${majorCategories ? encodeURIComponent(majorCategories.join(',')) : ""}`
    useEffect(() => {
        const { companies: companiesString, majors: majorsString, majorCategories: majorCategoriesString } = queryParams
        setSelectedCompanies((companiesString as string)?.split(',')?.filter(companyName => !!companyName) || []);
        setMajors((majorsString as string)?.split(',')?.filter(majorName => !!majorName) || []);
        setMajorCategories((majorCategoriesString as string)?.split(',')?.filter(majorCategoryName => !!majorCategoryName) || []);
    }, [queryParams]);

    const offerUrl = `${routes.api.offers.$}?degree=${props.degreeName}&page=${page}&${filters}`

    const { data: offersData, error: offersError, isLoading: areOffersLoading } = useFetch(offerUrl);
    const companies: Company[] = companiesData?.data;
    const degrees = props.degrees;
    const degreeNames = degrees?.map((degree: Degree) => degree?.name) || [];
    const offers: Offer[] | undefined = offersData?.data;
    const offersCount = offersData?.count || 0;
    const maxPage = offersData?.maxPage || 1;

    const resetPagination = () => setPage(1);

    const majorsList: Major[] = props.majors || []
    const majorsCategoriesList: MajorCategory[] = props.majorCategories || []
    const mutate = () => {
        swrmutate(offerUrl);
        swrmutate(userUrl);
    }
    const updateFilters = (companies: string[], majorNames: string[], majorCategories: string[]) => {
        router.replace({
            query: {
                companies: companies?.join(','),
                majors: majorNames?.join(','),
                majorCategories: majorCategories?.join(',')
            }
        });
        resetPagination();
    }
    const updateMajorCategories = (majorCategories: string[]) => updateFilters(selectedCompanies, majorNames, majorCategories);
    const isLoading = areCompaniesLoading || areOffersLoading
    const isDesktop = useIsDesktop();

    const onMajorCategoryClick = (category: string) => {
        if (category === "All") {
            updateMajorCategories([]);
            return;
        }
        if (majorCategories.includes(category)) {
            updateMajorCategories(majorCategories.filter(c => c !== category));
            return;
        }
        updateMajorCategories([...majorCategories, category])
    }
    return (
        <Box margin="auto" sx={{ minHeight: "50%" }} padding={isDesktop ? 5 : 2}>
            <Grow in={!isLoading} mountOnEnter unmountOnExit>
                <Box my={3}>
                    {/*
                    <Button sx={{ textTransform: 'capitalize' }}
                        id="degree-button"
                        aria-controls={degreesMenuOpen ? 'degree-menu' : undefined}
                        onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setDegreesMenuOpen(true)
                        }}>
                        <Box>
                            <Typography textAlign="left" sx={{ fontSize: 14, marginBottom: -2 }}>{`${offersCount}`} offers</Typography>
                            <Typography variant="caption" fontSize={48}>{props.degreeName}</Typography>
                            <KeyboardArrowDown sx={{ fontSize: 48 }} />
                        </Box>
                    </Button>
                    <Menu id="degree-menu" anchorEl={anchorEl} open={degreesMenuOpen} onClose={() => setDegreesMenuOpen(false)} MenuListProps={{
                        'aria-labelledby': 'degree-button'
                    }}>
                        {
                            degreeNames?.concat(["All"])?.map(degreeName => <MenuItem key={degreeName} onClick={() => router.push(`/offers/${degreeName.toLowerCase()}`)}>{degreeName}</MenuItem>)
                        }
                    </Menu>
                    */}
                    <Typography variant="caption" fontSize={48}>{`${offersCount}`} Offers</Typography>
                    {/* <MajorCategoryChips majorsCategoriesList={majorsCategoriesList} majorsCategories={majorCategories} onClick={onMajorCategoryClick} /> */}
                    <Autocomplete
                        options={companies?.map(company => company.name) || []}
                        //groupBy={(option) => option.type}
                        //getOptionLabel={(option) => option.title}
                        value={selectedCompanies}
                        onChange={(e, v) => {
                            updateFilters(v, majorNames, majorCategories);
                        }}
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
            </Grow>
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
