import { useCallback } from 'react';
import {
    Container,
    Grid,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Grow,
} from '@mui/material';
import EditorContent from './EditorContent';
import { routes } from '../../const/routes';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../features/responseSnackbar/reducer';
import { useGetEmail } from '../../auth/client';
import { Team } from '../../types/Team';
import { RemoveCircleOutline } from '@mui/icons-material';
import { AnyAction, Dispatch } from 'redux';
import LoaderCenter from './LoaderCenter';
import { parseJson } from './SingleOffer';
const joinTeam = (ownerEmail: string, dispatch: Dispatch<AnyAction>, back: () => void, mutate: (route: string) => void) => {
    fetch(`${routes.api.teams.join}/${ownerEmail}`, {
        method: "POST",
    })
        .then(data => {
            dispatch(addMessage({
                errorMessage: 'Failed to join team',
                isError: !data.ok,
                isSuccess: data.ok,
                successMessage: 'Successfully joined new team'
            }))
            if (data.ok) {
                mutate(routes.api.teams.$);
                back()
            }
        })
        .catch(() => {
            dispatch(addMessage({
                errorMessage: 'Failed to join team',
                isError: true,
                isSuccess: false,
                successMessage: 'Successfully joined new team'
            }))
        })
};
const leaveTeam = (dispatch: Dispatch<AnyAction>, back: () => void, mutate: (route: string) => void) => {
    fetch(routes.api.teams.leave, {
        method: "POST",
    })
        .then(data => {
            dispatch(addMessage({
                errorMessage: 'Failed to leave team',
                isError: !data.ok,
                isSuccess: data.ok,
                successMessage: 'Successfully left team'
            }))
            if (data.ok) {
                mutate(routes.api.teams.$);
                back();
            }
        })
        .catch(() => {
            dispatch(addMessage({
                errorMessage: 'Failed to leave team',
                isError: true,
                isSuccess: false,
                successMessage: 'Successfully left team'
            }))
        })
};
const removeUser = (userEmail: string, dispatch: Dispatch<AnyAction>, mutate: (route: string) => void, ownerEmail: string) => {
    fetch(`${routes.api.teams.remove}/${userEmail}`, {
        method: "POST",
    })
        .then(data => {
            dispatch(addMessage({
                errorMessage: 'Failed to remove user',
                isError: !data.ok,
                isSuccess: data.ok,
                successMessage: 'Successfully removed user'
            }))
            if (data.ok) {
                mutate(routes.api.teams.$);
            }
        })
        .catch(() => {
            dispatch(addMessage({
                errorMessage: 'Failed to remove user',
                isError: true,
                isSuccess: false,
                successMessage: 'Successfully removed user'
            }))
        })
};
const TeamsPage = (props: { team: Team; mutate: (url: string) => void; back: () => void }) => {
    const dispatch = useDispatch();
    const { team, mutate, back } = props || {};
    const ownerEmail = team?.ownerEmail;
    const { name, description } = team || {};
    const content = parseJson(description || "");
    const email = useGetEmail();
    const isOwner = email === team?.ownerEmail;
    const isMember = team?.members?.some(member => member?.email === email);
    const handleJoinTeam = useCallback(() => joinTeam(ownerEmail, dispatch, back, mutate), [ownerEmail, dispatch, back, mutate]);
    const handleLeaveTeam = useCallback(() => leaveTeam(dispatch, back, mutate), [dispatch, back, mutate]);
    const handleRemoveUser = useCallback((userEmail: string) => removeUser(userEmail, dispatch, mutate, ownerEmail), [dispatch, mutate, ownerEmail]);
    const isLoading = !email
    return (
        <Container maxWidth="md">
            <Grow in={!isLoading} mountOnEnter unmountOnExit>
                <Grid container spacing={2} padding={5}>
                    <Grid item xs={12}>
                        <Typography variant='h3'>{name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <EditorContent content={content} />
                    </Grid>
                    {isLoading ? <LoaderCenter /> : isOwner && <><Grid item xs={12}>
                        <Typography>Members</Typography>
                    </Grid>
                        <Grid item xs={12}>
                            <List>
                                {
                                    team?.members?.map(member => <ListItem key={member?.id}>
                                        <ListItemText primary={`${member.name} ${member.surname}`} secondary={member.email} />
                                        <IconButton onClick={() => handleRemoveUser(member.email)} disabled={member?.email === ownerEmail}>
                                            <RemoveCircleOutline />
                                        </IconButton>
                                    </ListItem>)
                                }
                            </List>
                        </Grid></>}
                    <Grid item xs={12}>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Button variant="outlined" color="primary" onClick={back}>
                                    Back
                                </Button>
                            </Grid>
                            <Grid item>
                                {!isLoading && <Button variant="contained" color="primary" onClick={isMember ? handleLeaveTeam : handleJoinTeam}>
                                    {isMember ? 'Leave' : 'Join'}
                                </Button>}
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </Grow>
        </Container>
    );
};

export default TeamsPage;
