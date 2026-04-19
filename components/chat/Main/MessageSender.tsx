import { Fab, Grid, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { ChatContext } from '../../../contexts/ChatContext';

export default function MessageSender({ companyName }: { companyName: string }) {
    const [msg, setMsg] = useState("");
    const { socket } = useContext(ChatContext);

    return (<Grid container style={{ padding: '20px' }}>
        <Grid item xs={11}>
            <TextField onFocus={() => socket?.emit('read-room', {
                id: companyName
            })} id="outlined-basic-email" label="Type Something" fullWidth value={msg} onChange={(e) => setMsg(e.target.value)} />
        </Grid>
        <Grid item xs={1}>
            <Fab color="primary" aria-label="send" onClick={() => {
                socket?.emit('send-msg', {
                    id: companyName,
                    content: msg
                })
                setMsg("");
            }
            }>
                <SendIcon />
            </Fab>
        </Grid>
    </Grid>
    )
}