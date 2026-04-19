import { Box, List } from '@mui/material';
import { useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../../../../contexts/ChatContext';
import { Message } from '@prisma/client';
import MessageItem from './MessageItem';
export default function Chat({ chatUserEmail }: { chatUserEmail: string }) {
    const { chatRoomsDetails } = useContext(ChatContext);

    const bot = useRef<HTMLElement>();
    const scrollBot = () => {
        bot?.current?.scrollIntoView({ behavior: 'smooth' })
    }
    useEffect(scrollBot)
    const messages: Message[] = chatRoomsDetails[chatUserEmail]?.messages || [];
    return (
        <List>
            {
                [messages?.map(message => <MessageItem message={message} key={message?.id} />),
                <Box ref={bot} key={-1} />
                ]
            }
        </List>
    );
}