import { Grid } from '@mui/material';
import MessagesList from './MessagesList';
export default function Chat({ chatUserEmail }: { chatUserEmail: string }) {
    return (
        <Grid container alignItems="flex-end" sx={{ height: '80vh', overflowY: 'scroll' }}>
            <Grid item xs={12}>
                <MessagesList chatUserEmail={chatUserEmail} />
            </Grid>
        </Grid>
    );
}