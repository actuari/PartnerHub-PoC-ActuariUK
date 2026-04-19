import { Box, Grid, Typography, TextField, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material'
import { useIsDesktop } from '../../../hooks'
import { Company, Employer } from '@prisma/client';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { routes } from '../../../const/routes';
import { addMessage } from '../../../features/responseSnackbar/reducer';

export default function InviteForm({ memberCurrent, mutate, company }: { memberCurrent: Employer | undefined, mutate: () => void, company: Company | undefined }) {
    const isDesktop = useIsDesktop();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [canAddOffers, setCanAddOffers] = useState(false);
    const [canManageCandidates, setCanManageCandidates] = useState(false);
    const [canManagePermissions, setCanManagePermissions] = useState(false);
    const [canUpdateCompanyDetails, setCanUpdateCompanyDetails] = useState(false);
    const dispatch = useDispatch();
    const clearInput = () => {
        setName("");
        setSurname("");
        setEmail("");
        setCanAddOffers(false);
        setCanManageCandidates(false);
        setCanManagePermissions(false);
        setCanUpdateCompanyDetails(false);
    }
    const addMember = () => {
        fetch(`${routes.api.companies}/${company?.id}/members/add`, {
            method: 'POST',
            body: JSON.stringify({
                name,
                surname,
                email,
                canAddOffers,
                canManageCandidates,
                canManagePermissions,
                canUpdateCompanyDetails
            })
        }).then(data => {
            mutate();
            clearInput();
            dispatch(addMessage({ isSuccess: data.ok, isError: !data.ok, successMessage: "Added new member", errorMessage: "Failed to add a new member" }));
        }).catch(() => {
            dispatch(addMessage({ isSuccess: false, isError: true, successMessage: "Added new member", errorMessage: "Failed to add a new member" }));
        })
    }
    return (
        <Box
            sx={{
                margin: isDesktop ? "10px" : 0,
                padding: "10px",
                boxShadow: "0px 0px 1px rgba(40, 41, 61, 0.08), 0px 0.5px 2px rgba(96, 97, 112, 0.16)",
                borderRadius: "12px 12px 0px 0px"
            }}
        >

            <Grid container spacing={2} padding={isDesktop ? 2 : 0} textAlign={isDesktop ? "left" : "center"}>
                <Grid item xs={12}>
                    <Typography variant="h6">Invite new member:</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth={isDesktop} value={name} placeholder="Name" onChange={ev => setName(ev.target.value)} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth={isDesktop} value={surname} placeholder="Surname" onChange={ev => setSurname(ev.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth={isDesktop} value={email} placeholder="Email" onChange={ev => setEmail(ev.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <FormGroup>
                        <FormControlLabel style={{ margin: 'auto' }} disabled={!memberCurrent?.canAddOffers && !memberCurrent?.canManagePermissions} control={
                            <Checkbox checked={canAddOffers} size='small'
                                onChange={(_, v) => setCanAddOffers(v)} />
                        } label={<Typography variant="subtitle2">Adding offers</Typography>} />
                        <FormControlLabel style={{ margin: 'auto' }} disabled={!memberCurrent?.canManageCandidates && !memberCurrent?.canManagePermissions} control={
                            <Checkbox checked={canManageCandidates
                            } size='small' onChange={(_, val) => setCanManageCandidates(val)} />} label={
                                <Typography variant="subtitle2">
                                    Accepting/Rejecting candidates
                                </Typography>} />
                        <FormControlLabel style={{ margin: 'auto' }} disabled={!memberCurrent?.canManagePermissions} control={
                            <Checkbox checked={canManagePermissions
                            } size='small' />} label={
                                <Typography variant="subtitle2">
                                    Permission Management
                                </Typography>} onChange={(_, val) => setCanManagePermissions(val)} />
                        <FormControlLabel style={{ margin: 'auto' }} disabled={!memberCurrent?.canManagePermissions} control={
                            <Checkbox checked={canUpdateCompanyDetails
                            } size='small' />} label={
                                <Typography variant="subtitle2">
                                    Updating Company Details
                                </Typography>} onChange={(_, val) => setCanUpdateCompanyDetails(val)} />
                    </FormGroup>
                </Grid>
                <Grid item xs={12}>
                    <Button variant='contained' onClick={addMember}>Add</Button>
                </Grid>
            </Grid>
        </Box>
    )
}
