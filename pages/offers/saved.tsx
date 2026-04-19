import OffersList from "../../components/common/OffersList";
import {
    Box,
    Pagination,
} from "@mui/material";
import { useState } from "react";
import { useFetch } from "../../hooks";
import { useUser, useUserGuard } from "../../auth/client";
import { routes } from "../../const/routes";


export default function Saved() {
    const userUrl = `${routes.api.users.email}`;
    const { data: userApiData, mutate: updateUserData, isLoading: isUserLoading } = useFetch(userUrl);
    const userData = userApiData?.data;

    const [page, setPage] = useState(1);
    const user = useUser();
    const userId = user?.id;
    const { data: offersData, error: offersError, mutate: updateOfferData, isLoading: areOffersLoading } = useFetch(
        `${routes.api.offers.$}?page=${page}${userId ? `&savedBy=${userId}` : ""}`);

    const mutate = () => {
        updateOfferData();
        updateUserData();
    }
    const offers = offersData?.data;
    const maxPage = offersData?.maxPage || 1;
    const isLoading = isUserLoading || areOffersLoading
    useUserGuard(user => !!user);
    return (
        <Box margin="auto" sx={{ minHeight: "50%" }} padding={5}>
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
