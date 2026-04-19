import OffersList from "../../components/common/OffersList";
import {
    Box,
    Grid,
    Grow,
    Tab,
    Tabs,
} from "@mui/material";
import { useState } from "react";
import { useUser, useUserGuard } from "../../auth/client";
import { useFetch, useIsDesktop } from "../../hooks";
import { routes } from "../../const/routes";
import { User } from "../../types/User/Detailed";


export default function Saved() {
    const userUrl = routes.api.users.email;
    const { data: userApiData, mutate, isLoading: isUserLoading } = useFetch(userUrl);
    const userData: User | undefined = userApiData?.data;
    const user = useUser();

    const details = userData?.chosenOffersDetails;
    const detailsAccepted = details?.filter(details => details.isAccepted);
    const detailsRejected = details?.filter(details => details.isRejected);
    const detailsPending = details?.filter(details => !(details.isAccepted || details.isRejected));
    const teamDetails = userData?.team?.chosenOffersDetails;
    const teamDetailsAccepted = teamDetails?.filter(details => details.isAccepted);
    const teamDetailsRejected = teamDetails?.filter(details => details.isRejected);
    const teamDetailsPending = teamDetails?.filter(details => !(details.isAccepted || details.isRejected));
    const detailsObject = {
        team: {
            all: teamDetails,
            rejected: teamDetailsRejected,
            pending: teamDetailsPending,
            accepted: teamDetailsAccepted
        },
        individual: {
            all: details,
            rejected: detailsRejected,
            pending: detailsPending,
            accepted: detailsAccepted
        }
    };
    const [applicationType, setApplicationType] = useState<"team" | "individual">("individual");
    const [applicationStatus, setApplicationStatus] = useState<"all" | "rejected" | "pending" | "accepted">("pending");
    const currentDetails = detailsObject[applicationType][applicationStatus]
    const currentOffers = currentDetails?.map(details => details?.offer) || []

    const isLoading = isUserLoading
    useUserGuard(user => !!user);
    const isDesktop = useIsDesktop();
    return (
        <Box margin="auto" sx={{ minHeight: "50%" }} padding={isDesktop ? 5 : 1}>
            <Grid container textAlign="center" paddingTop={isDesktop ? 5 : 2} spacing={2}>
                <Grow in={!isLoading} mountOnEnter unmountOnExit>
                    <Grid item xs={12}>
                        <Tabs value={applicationType} onChange={(e, v) => setApplicationType(v)} scrollButtons="auto" variant="scrollable">
                            <Tab label="Individual" value="individual" />
                            <Tab label="Team" value="team" />
                        </Tabs>
                    </Grid>
                </Grow>
                <Grow in={!isLoading} mountOnEnter unmountOnExit>
                    <Grid item xs={12}>
                        <Tabs value={applicationStatus} onChange={(e, v) => setApplicationStatus(v)} scrollButtons="auto" variant="scrollable">
                            <Tab label="All" value="all" />
                            <Tab label="Rejected" value="rejected" />
                            <Tab label="Pending" value="pending" />
                            <Tab label="Accepted" value="accepted" />
                        </Tabs>
                    </Grid>
                </Grow>
                <Grid item xs={12}>
                    <OffersList mutate={mutate} userData={userData} isLoading={isLoading}
                        offers={currentOffers} />
                </Grid>
            </Grid>
        </Box>
    );
}
