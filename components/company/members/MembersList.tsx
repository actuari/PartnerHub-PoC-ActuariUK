import { List, Box, Grid, Typography, IconButton, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { Employer } from '@prisma/client'
import { Update } from '@mui/icons-material';

export default function MembersList({ members, employer, memberCurrent, updateEmployer, setOpenUpdateDialog }: { members: Employer[]; employer: Employer | undefined; memberCurrent: Employer | undefined; updateEmployer: (id: number, newMember: any) => void; setOpenUpdateDialog: Dispatch<SetStateAction<boolean>> }) {
    return (
        <List>
            {
                members.map(member =>
                    <Box
                        key={member?.id}
                        sx={{
                            margin: "10px",
                            padding: "10px",
                            boxShadow: "0px 0px 1px rgba(40, 41, 61, 0.08), 0px 0.5px 2px rgba(96, 97, 112, 0.16)",
                            borderRadius: "12px 12px 0px 0px"
                        }}
                    >
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant="h6" display="inline">{`${member.name} ${member.surname}`}</Typography>
                                {member.email === employer?.email && <IconButton onClick={() => setOpenUpdateDialog(true)}>
                                    <Update />
                                </IconButton>}
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2">{member.email}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormGroup>
                                    <FormControlLabel disabled={member.id == employer?.id || !memberCurrent?.canManagePermissions} control={
                                        <Checkbox checked={member?.canAddOffers} size='small' onChange={(ev, val) => updateEmployer(member?.id, {
                                            canAddOffers: val
                                        })} />
                                    } label={<Typography variant="subtitle2">Adding offers</Typography>} />
                                    <FormControlLabel disabled={member.id == employer?.id || !memberCurrent?.canManagePermissions} control={
                                        <Checkbox checked={member?.canManageCandidates
                                        } size='small' />} label={
                                            <Typography variant="subtitle2">
                                                Accepting/Rejecting candidates
                                            </Typography>} onChange={(ev, val) => updateEmployer(member?.id, {
                                                canManageCandidates: val
                                            })} />
                                    <FormControlLabel disabled={member.id == employer?.id || !memberCurrent?.canManagePermissions} control={
                                        <Checkbox checked={member?.canManagePermissions
                                        } size='small' />} label={
                                            <Typography variant="subtitle2">
                                                Permission Management
                                            </Typography>} onChange={(ev, val) => updateEmployer(member?.id, {
                                                canManagePermissions: val
                                            })} />
                                    <FormControlLabel disabled={member.id == employer?.id || !memberCurrent?.canManagePermissions} control={
                                        <Checkbox checked={member?.canUpdateCompanyDetails
                                        } size='small' />} label={
                                            <Typography variant="subtitle2">
                                                Updating Company Details
                                            </Typography>} onChange={(ev, val) => updateEmployer(member?.id, {
                                                canUpdateCompanyDetails: val
                                            })} />
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </Box>)
            }
        </List>

    )
}
