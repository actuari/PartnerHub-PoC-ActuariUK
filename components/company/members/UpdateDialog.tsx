import { Dialog, Card, CardContent, Grid, Typography, TextField, Button } from '@mui/material';
import { Employer } from '@prisma/client';
import React, { Dispatch, SetStateAction, useState } from 'react'
import { routes } from '../../../const/routes';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../../features/responseSnackbar/reducer';

export default function UpdateDialog({ employer, openUpdateDialog, setOpenUpdateDialog, updateEmployer }: { employer: Employer | undefined, openUpdateDialog: boolean, setOpenUpdateDialog: Dispatch<SetStateAction<boolean>>, updateEmployer: (id: number, newMember: any) => void }) {
    const [employerName, setEmployerName] = useState(employer?.name);
    const [employerSurname, setEmployerSurname] = useState(employer?.surname);
    const updateEmployerProfile = () => {
        updateEmployer(employer?.id || 0, {
            name: employerName,
            surname: employerSurname
        })
    }
    return (
        <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant='h4'>
                                Update your profile
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField value={employerName} onChange={(e) => setEmployerName(e.target.value)} placeholder="Name" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField value={employerSurname} onChange={(e) => setEmployerSurname(e.target.value)} placeholder="Name" />
                        </Grid>
                        <Grid item xs={12}>
                            <Button onClick={updateEmployerProfile}>Update</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Dialog>
    )
}
