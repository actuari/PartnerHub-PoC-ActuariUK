import { useState } from 'react';
import {
    Container,
    Grid,
    Typography,
    Button,
    Input,
    InputLabel,
} from '@mui/material';
import TextEditor from '../../components/common/TextEditor';
import EditorContent from '../../components/common/EditorContent';
import { convertToRaw, EditorState } from 'draft-js';
import { routes } from '../../const/routes';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../features/responseSnackbar/reducer';
import { useRouter } from 'next/router';
import { useUserGuard } from '../../auth/client';

const TeamsPage = () => {
    const [name, setName] = useState("");
    const [content, setContent] = useState(convertToRaw(EditorState.createEmpty().getCurrentContent()));
    const dispatch = useDispatch();
    const router = useRouter();

    const handleCreateTeam = () => {
        fetch(routes.api.teams.create, {
            method: "POST",
            body: JSON.stringify({
                name,
                description: JSON.stringify(content)
            })
        })
            .then(data => {
                dispatch(addMessage({
                    errorMessage: 'Failed to create team',
                    isError: !data.ok,
                    isSuccess: data.ok,
                    successMessage: 'Successfully created new team'
                }))
                if (data.ok) {
                    router.push('/teams')
                }
            })
            .catch(() => {
                dispatch(addMessage({
                    errorMessage: 'Failed to create team',
                    isError: true,
                    isSuccess: false,
                    successMessage: 'Successfully created new team'
                }))
            })
    };
    const handleContentChange = setContent;
    useUserGuard(user => !!user);

    return (
        <Container maxWidth="md">
            <Grid container spacing={2} padding={5}>
                <Grid item xs={12}>
                    <Input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <InputLabel>Description:</InputLabel>
                    <TextEditor handleContent={handleContentChange} value={content} />
                </Grid>
                <Grid item xs={12}>
                    <Typography>Previev:</Typography>
                    <EditorContent content={content} />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleCreateTeam}>
                        Create
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default TeamsPage;
