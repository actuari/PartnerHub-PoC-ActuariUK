import { Avatar, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { getImageSrc } from '../../../hooks';

export default function CurrentContact({ isMain, companyName }: { isMain: boolean, companyName: string }) {
    return (isMain ? <></> : <List>
        <ListItemButton key={companyName} onClick={() => { }}>
            <ListItemIcon>
                <Avatar src={getImageSrc(companyName)} />
            </ListItemIcon>
            <ListItemText primary={companyName}></ListItemText>
        </ListItemButton>
    </List>)
}
