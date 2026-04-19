import { Grid } from '@mui/material';
import MessagesList from './MessagesList';

export default function Chat({ companyName }: { companyName: string }) {
    return (
        <Grid container alignItems="flex-end" sx={{ height: '80vh', overflowY: 'scroll' }}>
            <Grid item xs={12}>
                <MessagesList companyName={companyName} />
            </Grid>
        </Grid>
    )
}