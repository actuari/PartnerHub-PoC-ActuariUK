import { Grid, Paper } from '@mui/material';
import { useUserGuard } from '../../auth/client';
import Contacts from '../../components/chat/Contacts/Contacts';
import Main from '../../components/chat/Main/Main';
import { useRouter } from 'next/router';

export default function Chat() {
    const router = useRouter();
    const companyName: string = router.query?.companyName as string || "";
    const isMain = companyName === "main";
    useUserGuard(user => !!user);
    return (
        <Grid container component={Paper}>
            <Contacts companyName={companyName} isMain={isMain} />
            <Main companyName={companyName} isMain={isMain} />
        </Grid >
    );
}