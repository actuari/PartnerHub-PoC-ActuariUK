import { Divider, Grid } from '@mui/material';
import Chat from './Chat';
import MessageSend from './MessageSend';
import { useIsDesktop } from '../../../../hooks';
export default function Main({ chatUserEmail }: { chatUserEmail: string }) {
    const isDesktop = useIsDesktop();
    return (
        <Grid item xs={isDesktop ? 9 : 11}>
            <Chat chatUserEmail={chatUserEmail} />
            <Divider />
            <MessageSend chatUserEmail={chatUserEmail} />
        </Grid>
    );
}