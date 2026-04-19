import OffersList from "../../components/common/OffersList";
import {
    Box,
    Button,
    Grid,
    Pagination,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useFetch } from "../../hooks";
import { useEmployer, useEmployerGuard } from "../../auth/client";
import { routes } from "../../const/routes";
export default function Home() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const employer = useEmployer();
    const company = employer?.company
    const { data: offersData, error: offersError, mutate, isLoading: areOffersLoading } = useFetch(
        `${routes.api.offers.$}?page=${page}&companies=${company?.name}`,
        {
            refreshWhenOffline: true,
            refreshWhenHidden: true,
            revalidateOnFocus: true,
            revalidateOnMount: true,
            revalidateIfStale: true,
            revalidateOnReconnect: true,
            refreshInterval: 5000
        }
    );


    const navigateBack = useCallback(() => router.replace("/"), [router]);
    const navigateToAddOffer = useCallback(
        () => router.push("/offers/add"),
        [router]
    );
    const { data: currentEmployerData } =
        useFetch(routes.api.employers.email);
    const currentEmployer = currentEmployerData?.data;
    const canAddOffers = currentEmployer?.canAddOffers

    const offers = offersData?.data;
    const maxPage = offersData?.maxPage || 1;
    const isLoading = areOffersLoading
    useEmployerGuard(employer => !!employer);
    return (
        <Box margin="auto" sx={{ minHeight: "50%" }} padding={5}>

            <OffersList offers={offers || []} mutate={mutate} isLoading={isLoading} />
            <Grid
                container
                justifyContent="space-between"
                alignItems="flex-end"
                mt={5}
            >
                <Grid item>
                    <Pagination
                        count={maxPage}
                        page={page}
                        onChange={(e, v) => setPage(v)}
                    />
                </Grid>
                <Grid item>
                    <Button
                        disabled={!canAddOffers}
                        color="success"
                        variant="contained"
                        onClick={navigateToAddOffer}
                    >
                        Add new offer
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
