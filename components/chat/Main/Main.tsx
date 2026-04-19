import { Divider, Grid } from '@mui/material';
import Chat from './Chat';
import MessageSender from './MessageSender';
import { useIsDesktop } from '../../../hooks';

function Main({ companyName, isMain }: { companyName: string, isMain: boolean }) {
    const isDesktop = useIsDesktop();
    return isMain ? <></> : <Grid item xs={isDesktop ? 9 : 11}>
        <Chat companyName={companyName} />
        <Divider />
        <MessageSender companyName={companyName} />
    </Grid>
}
export default Main;