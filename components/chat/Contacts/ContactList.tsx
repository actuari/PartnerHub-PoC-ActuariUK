import { Avatar, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { getImageSrc } from '../../../hooks';
import { useContext } from 'react';
import { ChatContext } from '../../../contexts/ChatContext';
import { useRouter } from 'next/router';

export default function ContactList({ searchText }: { searchText: string }) {
    const { chatRoomsDetails } = useContext(ChatContext);
    const router = useRouter();
    return (
        <List>
            {
                Object.values(chatRoomsDetails)?.filter(chatRoom => chatRoom?.companyName?.toLowerCase()?.includes(searchText.toLowerCase())).map((chatRoom, idx) => <ListItemButton key={idx} onClick={() => router.replace(`/chat/${chatRoom?.companyName}`)} sx={!chatRoom?.seenByUser ? { color: '#2E89FF', background: '#eeeeee' } : {}}>
                    <ListItemIcon>
                        <Avatar src={getImageSrc(chatRoom?.companyName)} />
                    </ListItemIcon>
                    <ListItemText primary={chatRoom?.companyName}>{chatRoom?.companyName}</ListItemText>
                </ListItemButton>)
            }
        </List>
    )
}
