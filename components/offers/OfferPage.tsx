import {
    Box, Button, Grid, IconButton, Slide, Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import SingleOffer from "../common/SingleOffer";
import { useEmployer, useUser } from "../../auth/client";
import { useFetch, useIsDesktop } from "../../hooks";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { addMessage } from "../../features/responseSnackbar/reducer";
import { Offer } from "@prisma/client";
import GoogleIcon from '@mui/icons-material/Google';
import { SingleApplicationDetails } from "../../types/ApplicationDetails/Single";
import { routes } from "../../const/routes";
import { User } from "../../types/User/Detailed";
import LoaderCenter from "../../components/common/LoaderCenter";
import { signIn } from "next-auth/react";
import { KeyboardArrowRightOutlined } from "@mui/icons-material";
export default function Home({ id, onClose }: { id: string, onClose: () => void }) {
    const router = useRouter();
    const { data: offerData, error: offersError, mutate: updateOfferData, isLoading: isOfferLoading } = useFetch(
        `${routes.api.offers.$}/${id}`
    );
    const userUrl = routes.api.users.email;
    const { data: userApiData, mutate: updateUserData, isLoading: isUserLoading } = useFetch(userUrl);
    const userData: User | undefined = userApiData?.data;
    const mutate = useCallback(() => {
        updateOfferData();
        updateUserData();
    }, [updateOfferData, updateUserData])
    const user = useUser();
    const employer = useEmployer();
    const userId = user?.id;
    const offer = offerData?.data;
    const team = userData?.team;
    const hasAppliedAsTeam = team?.chosenOffersDetails?.map(details => details?.offer)?.some(chosenOffer => chosenOffer?.id === offer?.id);
    const chosenOffers: Offer[] = userData?.chosenOffersDetails?.map((details: SingleApplicationDetails) => details?.offer) || []
    const hasApplied = chosenOffers.some(chosenOffer => chosenOffer?.id === offer?.id);
    const canModify = offer?.employer?.id === employer?.company?.id;
    const dispatch = useDispatch();
    const applyToOffer = useCallback((offerId: number, userId: number) => {
        fetch(`${routes.api.offers.apply.single}/${offerId}`, {
            method: "PUT",
            body: JSON.stringify(userId)
        })
            .then(() => {
                mutate();
                dispatch(addMessage({ isSuccess: true, isError: false, successMessage: "Successfully applied", errorMessage: "Failed to apply" }));
            })
            .catch(() => {
                mutate();
                dispatch(addMessage({ isSuccess: false, isError: true, successMessage: "Successfully applied", errorMessage: "Failed to apply" }));
            })

    }, [dispatch, mutate]);
    const applyToOfferAsTeam = (offerId: number) => {
        fetch(`${routes.api.offers.apply.team}/${offerId}`, {
            method: "PUT",
        })
            .then(() => {
                mutate();
                dispatch(addMessage({ isSuccess: true, isError: false, successMessage: "Successfully applied", errorMessage: "Failed to apply" }));
            })
            .catch(() => {
                mutate();
                dispatch(addMessage({ isSuccess: false, isError: true, successMessage: "Successfully applied", errorMessage: "Failed to apply" }));
            })

    }
    const isLoading = isOfferLoading
    const isDesktop = useIsDesktop();
    return (
        <Box margin="0 auto" sx={{ minHeight: "50%" }}>
            {isLoading && <LoaderCenter />}
            <IconButton style={{ margin: '32px' }} onClick={onClose} sx={{ background: '#EBEBF0', borderRadius: '5px' }}><KeyboardArrowRightOutlined /></IconButton>
            <Slide in={!!offer && !isLoading} mountOnEnter unmountOnExit direction="right">
                <Box>
                    {offer && <SingleOffer offer={offer} detailed userId={userId} mutate={mutate} userData={userData} />}
                </Box>
            </Slide>
            <Grid container justifyContent="space-between" padding={4}>
                <Grid item>
                    {!isLoading && <Grid container justifyContent="right">
                        <Grid item>
                            {canModify && <Button onClick={() => router.push(`/offers/${id}/candidates`)}>Who applied?</Button>}
                        </Grid>
                        <Grid item>
                            {userId && <Button disabled={hasApplied} onClick={() => {
                                if (!userId) {
                                    return;
                                }
                                applyToOffer(offer?.id, userId);
                            }}>{hasApplied ? "Already applied" : "Apply individually"}</Button>}
                        </Grid>
                        {team && <Grid item>
                            {userId && <Button disabled={hasAppliedAsTeam} onClick={() => {
                                if (!userId) {
                                    return;
                                }
                                applyToOfferAsTeam(offer?.id);
                            }}>{hasAppliedAsTeam ? "Team applied" : "Apply as a team"}</Button>}
                        </Grid>}
                        <Grid item>
                            {!(user || employer) && <Button variant="outlined"
                                sx={{ textTransform: 'none' }} onClick={() => signIn()}>
                                <Typography display="inline" marginRight={2}>Sign in to apply</Typography>
                                <GoogleIcon color="inherit" />
                            </Button>}
                        </Grid>
                    </Grid>}
                </Grid>
            </Grid>

        </Box>
    );
}
