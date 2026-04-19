import {
    Box, Grid, Grow, Tab, Tabs,
} from "@mui/material";
import { useRouter } from "next/router";
import SingleOffer from "../../../components/common/SingleOffer";
import { useEmployer, useEmployerGuard } from "../../../auth/client";
import { useFetch } from "../../../hooks";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { Offer } from "../../../types/Offer/WithApplicants";
import { addMessage } from "../../../features/responseSnackbar/reducer";
import { User } from "../../../types/User/Basic";
import { routes } from "../../../const/routes";
import { Team } from "../../../types/Team";
import LoaderCenter from "../../../components/common/LoaderCenter";
import ApplicantDisplay from "../../../components/common/ApplicantDisplay";

export default function Home() {
    const router = useRouter();
    const { data: offerData, error: offersError, mutate, isLoading } = useFetch(
        `${routes.api.offers.$}/${router.query?.id}/candidates`
    );
    const dispatch = useDispatch();
    const offer: Offer | undefined = offerData?.data;
    const details = offer?.singleApplicationsDetails?.map(details => ({
        isAccepted: details.isAccepted,
        isRejected: details.isRejected,
        ...details.user
    })) || []
    const detailsAccepted = details?.filter(details => details.isAccepted);
    const detailsRejected = details?.filter(details => details.isRejected);
    const detailsPending = details?.filter(details => !(details.isAccepted || details.isRejected));
    const teamDetails: (Team & { isAccepted: boolean; isRejected: boolean })[] = offer?.teamApplicationsDetails?.map(details => ({
        isAccepted: details.isAccepted,
        isRejected: details.isRejected,
        ...details.team
    })) || []
    const teamDetailsAccepted = teamDetails?.filter(teamDetails => teamDetails.isAccepted);
    const teamDetailsRejected = teamDetails?.filter(teamDetails => teamDetails.isRejected);
    const teamDetailsPending = teamDetails?.filter(teamDetails => !(teamDetails.isAccepted || teamDetails.isRejected));
    const detailsObject = {
        team: {
            all: teamDetails,
            rejected: teamDetailsRejected,
            pending: teamDetailsPending,
            accepted: teamDetailsAccepted
        },
        single: {
            all: details,
            rejected: detailsRejected,
            pending: detailsPending,
            accepted: detailsAccepted
        }
    };
    const [applicationType, setApplicationType] = useState<"team" | "single">("single");
    const [applicationStatus, setApplicationStatus] = useState<"all" | "rejected" | "pending" | "accepted">("pending");
    const applicationActionGenerator = (action: string, email: string) => {
        fetch(`${routes.api.applications[applicationType].$}/${action}/${offer?.id}`, {
            method: "PUT",
            body: email
        })
            .then(data => {
                mutate();
                dispatch(addMessage({ isSuccess: data.ok, isError: !data.ok, successMessage: 'Successfully moved candidate', errorMessage: 'Failed to move candidate' }));
            })
            .catch(() => {
                mutate();
                dispatch(addMessage({ isSuccess: false, isError: true, successMessage: 'Successfully moved candidate', errorMessage: 'Failed to move candidate' }));
            })
    }

    const currentDetails: User[] | Team[] = detailsObject[applicationType][applicationStatus]
    const currentApplicants = currentDetails || []
    const employer = useEmployer();
    const canManageCandidates = employer?.canManageCandidates
    useEmployerGuard(employer => !!employer);

    return (
        <Box margin="auto" sx={{ minHeight: "50%" }} padding={5}>
            {offer && <SingleOffer offer={offer} />}
            <Grid container textAlign="center" paddingTop={5} spacing={2}>
                <Grow in={!isLoading} mountOnEnter unmountOnExit>
                    <Grid item xs={12}>
                        <Tabs value={applicationType} onChange={(e, v) => setApplicationType(v)}>
                            <Tab label="Individual" value="single" />
                            <Tab label="Team" value="team" />
                        </Tabs>
                    </Grid>
                </Grow>
                <Grow in={!isLoading} mountOnEnter unmountOnExit>
                    <Grid item xs={12}>
                        <Tabs value={applicationStatus} onChange={(e, v) => setApplicationStatus(v)}>
                            <Tab label="All" value="all" />
                            <Tab label="Rejected" value="rejected" />
                            <Tab label="Pending" value="pending" />
                            <Tab label="Accepted" value="accepted" />
                        </Tabs>
                    </Grid>
                </Grow>
                <Grid item xs={12}>
                    <ApplicantDisplay applicants={currentApplicants} status={applicationStatus} canManageCandidates={canManageCandidates || false} onAction={applicationActionGenerator} />
                </Grid>
                <Grid item xs={12}>
                    {
                        isLoading && <LoaderCenter />
                    }
                </Grid>
            </Grid>
        </Box>
    );
}