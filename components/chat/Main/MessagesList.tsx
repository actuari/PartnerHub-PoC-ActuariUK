import { List } from '@mui/material';
import { useContext, useEffect, useRef } from 'react';
import { Message } from '@prisma/client';
import { Box } from '@mui/system';
import MessageItem from './MessageItem';
import { ChatContext } from '../../../contexts/ChatContext';

export default function MessagesList({ companyName }: { companyName: string }) {
    const { chatRoomsDetails } = useContext(ChatContext);
    const messages: Message[] = chatRoomsDetails[companyName]?.messages || [];
    const bot = useRef<HTMLElement>();
    const scrollBot = () => {
        bot?.current?.scrollIntoView({ behavior: 'smooth' })
    }
    useEffect(scrollBot)
    return (<List>
        {
            [messages?.map(message => <MessageItem message={message} key={message?.id} />),
            <Box ref={bot} key={-1} />
            ]
        }
    </List>
    )
}