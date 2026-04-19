import { Avatar, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { ChatContext } from '../../../../contexts/ChatContext';
import { getImageSrc } from '../../../../hooks';
const convertDate = (date: string) => date.replace('T', ', ').slice(0, 17)
export default function Chat({ chatUserEmail, isMain, searchText }: { chatUserEmail: string, isMain: boolean, searchText: string }) {
    const router = useRouter();
    const { chatRoomsDetails } = useContext(ChatContext);

    return (
        <List>
            {
                Object.values(chatRoomsDetails)?.filter(chatRoom => chatRoom?.userEmail?.toLowerCase()?.includes(searchText.toLowerCase())).map((chatRoom, idx) => <ListItemButton key={idx} onClick={() => router.replace(`/company/chat/${chatRoom?.userEmail}`)} sx={!chatRoom?.seenByCompany ? { color: '#2E89FF', background: '#eeeeee' } : {}}>
                    <ListItemIcon>
                        <Avatar src={getImageSrc(chatRoom?.userEmail)} />
                    </ListItemIcon>
                    <ListItemText primary={chatRoom?.userEmail}>{chatRoom?.userEmail}</ListItemText>
                </ListItemButton>)
            }
        </List>
    );
}