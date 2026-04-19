import {
    Box, Grid, IconButton, List,
} from "@mui/material";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import React, { useEffect, useState } from "react";
import { User } from "../../types/User/Basic";
import { Team } from "../../types/Team";
import TeamDetails from "./TeamDetails";
import UserSummary from "./UserSummary";
function areUsers(applicants: User[] | Team[]): applicants is User[] {
    return (applicants?.at(0) as User)?.degree !== undefined || !applicants?.length;
}

function ApplicantDisplay(props: { applicants: User[] | Team[]; status: "all" | "rejected" | "pending" | "accepted"; canManageCandidates: boolean; onAction: (action: string, email: string) => void }) {
    const { applicants, status, canManageCandidates, onAction } = props;
    const leftAction = status === "pending" ? "reject" : status === "accepted" ? "return" : undefined;
    const rightAction = status === "pending" ? "accept" : status === "rejected" ? "return" : undefined;
    const [idx, setIdx] = useState(0);
    const decreaseIdx = () => setIdx(idx => idx - 1);
    const increaseIdx = () => setIdx(idx => idx + 1);
    useEffect(() => {
        setIdx(0);
    }, [status])
    if (areUsers(applicants)) {
        return <List sx={{ maxHeight: 500, overflowY: 'auto' }}>
            {
                applicants?.map(applicant =>
                    <Box bgcolor="white" margin={2} key={applicant?.id}>
                        <Grid container justifyContent="center">
                            <Grid item xs={12}><UserSummary user={applicant} /></Grid>
                            <Grid item xs={12}>
                                {canManageCandidates && leftAction && <IconButton color={rightAction ? 'error' : "default"} onClick={() => onAction(leftAction, applicant?.email)}>
                                    <KeyboardDoubleArrowLeftIcon />
                                </IconButton>}
                                {canManageCandidates && rightAction && <IconButton color={leftAction ? 'success' : "default"} onClick={() => onAction(rightAction, applicant?.email)}>
                                    <KeyboardDoubleArrowRightIcon />
                                </IconButton>}
                            </Grid>
                        </Grid>
                    </Box>)
            }
        </List>
    }
    const applicant = (applicants as Team[])?.at(idx);
    return <Grid container sx={{ background: 'white' }} alignItems="center">
        <Grid item xs={1}>
            <IconButton disabled={idx === 0} onClick={decreaseIdx}>
                <NavigateBeforeIcon fontSize="large" />
            </IconButton>
        </Grid>
        <Grid item xs={10}>
            <Grid container justifyContent="center">
                <Grid item xs={12}>{applicant && <TeamDetails team={applicant!}>
                    <>
                        {canManageCandidates && leftAction && <IconButton color={rightAction ? 'error' : "default"} onClick={() => onAction(leftAction, applicant?.ownerEmail!)}>
                            <KeyboardDoubleArrowLeftIcon />
                        </IconButton>}
                        {canManageCandidates && rightAction && <IconButton color={leftAction ? 'success' : "default"} onClick={() => onAction(rightAction, applicant?.ownerEmail!)}>
                            <KeyboardDoubleArrowRightIcon />
                        </IconButton>}
                    </>
                </TeamDetails>}</Grid>
            </Grid>
        </Grid>
        <Grid item xs={1}>
            <IconButton disabled={idx === (applicants as Team[])?.length - 1} onClick={increaseIdx}>
                <NavigateNextIcon fontSize="large" />
            </IconButton >
        </Grid>
    </Grid>
}

export default ApplicantDisplay;