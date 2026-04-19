import { Avatar, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { getImageSrc } from '../../../../hooks';
const convertDate = (date: string) => date.replace('T', ', ').slice(0, 17)
export default function Chat({ chatUserEmail, isMain }: { chatUserEmail: string, isMain: boolean }) {
    return (
        isMain ? <></> : <List>
            <ListItemButton key={chatUserEmail} onClick={() => { }}>
                <ListItemIcon>
                    <Avatar src={getImageSrc(chatUserEmail)} />
                </ListItemIcon>
                <ListItemText primary={chatUserEmail} />
            </ListItemButton>
        </List>
    );
}