import { Grid, ListItem, ListItemText } from '@mui/material';
import { Message } from '@prisma/client';
const convertDate = (date: string) => date.replace('T', ', ').slice(0, 17)
export default function Chat({ message }: { message: Message }) {
    return (<ListItem key={message.id} sx={{ width: '45%', margin: message?.isFromCompany ? "0 0 0 auto" : "0 auto 0 0" }}>
        <Grid container>
            <Grid item xs={12} textAlign={message?.isFromCompany ? "right" : "left"}>
                <ListItemText primary={message?.content}></ListItemText>
            </Grid>
            <Grid item xs={12} textAlign={message?.isFromCompany ? "right" : "left"}>
                <ListItemText secondary={convertDate(message?.date)}></ListItemText>
            </Grid>
        </Grid>
    </ListItem>
    );
}