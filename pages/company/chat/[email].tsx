import { Grid, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import { useEmployerGuard } from '../../../auth/client';
import Contacts from '../../../components/company/chat/Contacts/Contacts';
import Main from '../../../components/company/chat/Main/Main';
export default function Chat() {
    const router = useRouter();
    const chatUserEmail: string = router.query?.email as string || "";
    const isMain = chatUserEmail === "main";

    useEmployerGuard(employer => !!employer);
    return (
        <Grid container component={Paper}>
            <Contacts chatUserEmail={chatUserEmail} isMain={isMain} />
            <Main chatUserEmail={chatUserEmail} />
        </Grid >
    );
}