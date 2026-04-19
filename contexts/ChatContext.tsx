import { createContext, useEffect, useState } from "react";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Prisma } from "@prisma/client";
import io, { Socket } from "socket.io-client";
import { useEmployer, useGetEmail, useGetToken } from "../auth/client";
import { routes } from "../const/routes";
type ChatRoomWithMessages = Prisma.ChatRoomGetPayload<{
    include: {
        messages: true;
    };
}>;
type ChatRoomsWithMessages = {
    [email: string]: ChatRoomWithMessages;
};
type SocketType = Socket<DefaultEventsMap, DefaultEventsMap> | null
type ContextType = { socket: SocketType, chatRoomsDetails: ChatRoomsWithMessages }
export const ChatContext = createContext<ContextType>({ socket: null, chatRoomsDetails: {} });
export const ChatProvider = (props: any) => {
    const [socket, setSocket] = useState<SocketType>(null);
    const token = useGetToken();
    const email = useGetEmail();
    const isCompany = !!useEmployer();
    const [chatRoomsDetails, setChatRoomsDetails] =
        useState<ChatRoomsWithMessages>({});
    useEffect(() => {
        if (!token) {
            return
        }
        fetch(routes.api.chat).then(() => {
            setSocket(io({
                query: { token, isCompany: JSON.stringify(isCompany) }
            }))
        })
        return () => {
            socket?.disconnect()
        }
    }, [token, isCompany]);
    useEffect(() => {
        socket?.on('connect', () => {
        })

        return () => {
            socket?.off("connect");
            socket?.removeAllListeners("connect");
        };
    }, [socket]);
    useEffect(() => {
        if (!email) {
            return;
        }
        socket?.on("msg", (data) => {
            const companyName = data?.isFromCompany ? data?.from : data?.to
            const userEmail = data?.isFromCompany ? data?.to : data?.from
            const userId = isCompany ? userEmail : companyName

            setChatRoomsDetails((details) => ({
                ...details,
                [userId]: {
                    ...details[userId],
                    messages: details[userId]?.messages?.length
                        ? [...details[userId]?.messages, data]
                        : [data],
                },
            }));
        });

        return () => {
            socket?.off("msg");
            socket?.removeAllListeners("msg");
        };
    }, [socket, email]);
    useEffect(() => {
        if (!email) {
            return;
        }
        socket?.on("msgs", (data) => {
            setChatRoomsDetails(
                Object.fromEntries(
                    data.map((chatRoom: ChatRoomWithMessages) => [
                        isCompany ? chatRoom.userEmail : chatRoom.companyName,
                        chatRoom,
                    ])
                )
            );
        });
        return () => {
            socket?.off("msgs");
            socket?.removeAllListeners("msgs");
        };
    }, [socket, email]);
    useEffect(() => {
        if (!email) {
            return;
        }
        socket?.on("update-room", (data) => {
            const companyName = data?.isFromCompany ? data?.from : data?.to
            const userEmail = data?.isFromCompany ? data?.to : data?.from
            const userId = (isCompany) ? userEmail : companyName

            setChatRoomsDetails((details) => ({
                ...details,
                [userId]: {
                    ...details[userId],
                    ...data?.data
                },
            }));
        });

        return () => {
            socket?.off("update-room");
            socket?.removeAllListeners("update-room");
        };
    }, [socket, email]);
    return (
        <ChatContext.Provider value={{ socket, chatRoomsDetails }}>
            {props?.children}
        </ChatContext.Provider>
    )
}