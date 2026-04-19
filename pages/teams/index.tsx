import {
    Container,
    Grid,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Slide,
} from '@mui/material';
import { useFetch } from '../../hooks';
import { useGetEmail, useUserGuard } from '../../auth/client';
import { routes } from '../../const/routes';
import { Team } from '../../types/Team';
import { useRouter } from 'next/router';
import LoaderCenter from '../../components/common/LoaderCenter';
import { useState } from 'react';
import TeamPage from '../../components/common/TeamPage';

export default function TeamsPage() {
    const { data: teamsData, isLoading: areTeamsLoading, mutate } = useFetch(routes.api.teams.$)
    const router = useRouter();
    const [selectedTeam, setSelectedTeam] = useState<Team | null | undefined>(null);

    const teams: Team[] = teamsData?.data || [];
    const handleCreateTeam = () => {
        router.push('/teams/add');
    };
    const email = useGetEmail();
    const isLoading = areTeamsLoading || !email;
    const myTeam = teams?.find(team => team?.members?.some(member => member?.email === email));

    const handleShowTeam = (team: Team) => {
        setSelectedTeam(team);
    };
    const handleEnterMyTeam = () => {
        setSelectedTeam(myTeam);
    };
    useUserGuard(user => !!user);

    return selectedTeam ? <TeamPage team={selectedTeam} mutate={mutate} back={() => setSelectedTeam(null)} /> : (
        <Container>
            {isLoading && <LoaderCenter />}
            <Slide in={!isLoading} mountOnEnter unmountOnExit direction='up'>
                <Grid container spacing={2} padding={5}>
                    <Grid item xs={12}>
                        <List>
                            {teams.map((team) =>
                                <ListItem key={team.name} button onClick={() => handleShowTeam(team)}>
                                    <ListItemText primary={<>
                                        <Typography>{team.name}</Typography>
                                        <Typography variant='body2'>{`Owner: ${team?.ownerEmail}`}</Typography>
                                    </>}
                                        secondary={`${team?.members?.length} ${team.members.length === 1 ? 'member' : 'members'}`} />
                                </ListItem>
                            )}
                        </List>
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <Button variant="contained" color="primary" onClick={() => {
                            if (!myTeam) {
                                handleCreateTeam()
                            }
                            else {
                                handleEnterMyTeam()
                            }
                        }}>
                            {myTeam ? `My team` : `Create a New Team`}
                        </Button>
                    </Grid>
                </Grid>
            </Slide>
        </Container>
    );
};