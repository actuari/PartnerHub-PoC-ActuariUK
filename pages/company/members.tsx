import { Box, Grow } from '@mui/material';
import { Employer } from '@prisma/client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEmployer, useEmployerGuard } from '../../auth/client';
import { useFetch, useIsDesktop } from '../../hooks';
import LoaderCenter from '../../components/common/LoaderCenter';
import { routes } from '../../const/routes';
import { addMessage } from '../../features/responseSnackbar/reducer';
import UpdateDialog from '../../components/company/members/UpdateDialog';
import MembersList from '../../components/company/members/MembersList';
import InviteForm from '../../components/company/members/InviteForm';

export default function Details() {
    const employer = useEmployer();
    const company = employer?.company;
    const { data: companyData, mutate, isLoading } = useFetch(`${routes.api.companies}/${company?.id}`);
    const companyCurrent = companyData?.data;
    const members: Employer[] = companyCurrent?.members || []
    const memberCurrent = members.find(member => member.email === employer?.email);
    const dispatch = useDispatch();
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

    const updateEmployer = (id: number, newMember: any) => {
        fetch(`${routes.api.employers.$}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(newMember)
        })
            .then(data => {
                dispatch(addMessage({ isSuccess: data.ok, isError: !data.ok, successMessage: "Updated user permissions", errorMessage: "Failed to update user permissions" }))
                mutate();
                if (data.ok) {
                    setOpenUpdateDialog(false);
                }
            }).catch(() => {
                dispatch(addMessage({ isSuccess: false, isError: true, successMessage: "Updated user permissions", errorMessage: "Failed to update user permissions" }))
            })
    }

    const isDesktop = useIsDesktop();
    useEmployerGuard(employer => !!employer);
    return (
        <Box margin="auto" width={isDesktop ? "70%" : "100%"} padding={isDesktop ? 5 : 2}>
            {isLoading && <LoaderCenter />}
            <UpdateDialog employer={employer} openUpdateDialog={openUpdateDialog} setOpenUpdateDialog={setOpenUpdateDialog} updateEmployer={updateEmployer} />
            <Grow in={true} mountOnEnter unmountOnExit>
                <Box>
                    <MembersList employer={employer} memberCurrent={memberCurrent} members={members} setOpenUpdateDialog={setOpenUpdateDialog} updateEmployer={updateEmployer} />
                    <InviteForm memberCurrent={memberCurrent} company={company} mutate={mutate} />
                </Box>
            </Grow>
        </Box>
    )
}
