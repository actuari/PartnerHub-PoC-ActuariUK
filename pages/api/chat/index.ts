import { Server } from "socket.io";
import { prisma } from "../../../prisma";
import { ChatRoom } from "@prisma/client";
import { getEmailFromToken } from "../../../auth/server";
import { parseJson } from "../../../components/common/SingleOffer";
export default async function handler(req: any, res: any) {
  if (!res.socket?.server?.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", async (socket) => {
      const { token: tokenStr, isCompany: isCompanyStr } =
        socket.handshake.query;
      const token = tokenStr as string;
      let roomId: string;
      const isCompany: boolean = parseJson(isCompanyStr as string) || false;
      let initChatRooms: ChatRoom[];
      const email = await getEmailFromToken(token);
      //console.log("chat", email, isCompany);

      if (!email) {
        return;
      }
      if (isCompany) {
        const employerFromEmail = await prisma.employer.findUnique({
          where: {
            email,
          },
          include: {
            company: true,
          },
        });
        const companyName = employerFromEmail?.company?.name;
        if (!companyName) {
          return;
        }
        const chatRooms = await prisma.chatRoom.findMany({
          where: {
            companyName,
          },
          include: {
            messages: true,
          },
        });
        roomId = companyName;
        initChatRooms = chatRooms;
      } else {
        const chatRooms = await prisma.chatRoom.findMany({
          where: {
            userEmail: email,
          },
          include: {
            messages: true,
          },
        });
        roomId = email;
        initChatRooms = chatRooms;
      }
      socket.join(roomId);
      socket.emit("msgs", initChatRooms);
      socket.on("read-room", async ({ id }) => {
        const from = roomId;
        const to = id;
        const isFromCompany = !!isCompany;
        const companyName = isCompany ? from : to;
        const userEmail = isCompany ? to : from;
        const data = isFromCompany
          ? { seenByCompany: true }
          : { seenByUser: true };
        if (
          await prisma.chatRoom.count({
            where: {
              userEmail,
              companyName,
            },
          })
        )
          await prisma.chatRoom.update({
            where: {
              userEmail_companyName: {
                companyName,
                userEmail,
              },
            },
            data,
          });
        const msg = {
          from,
          to,
          isFromCompany,
          data,
        };
        socket.to(to).emit("update-room", msg);
        socket.emit("update-room", msg);
      });
      socket.on("send-msg", async (msgJson) => {
        const content = msgJson?.content;
        const from = roomId;
        const to = msgJson?.id;
        const date = new Date().toISOString();
        const isFromCompany = !!isCompany;
        const companyName = isCompany ? from : to;
        const userEmail = isCompany ? to : from;
        const updateSeen = isFromCompany
          ? {
              seenByUser: false,
            }
          : {
              seenByCompany: false,
            };
        //console.log(updateSeen);
        await prisma.chatRoom.upsert({
          where: {
            userEmail_companyName: {
              companyName,
              userEmail,
            },
          },
          update: updateSeen,
          create: {
            companyName,
            userEmail,
          },
        });
        await prisma.message.create({
          data: {
            content,
            date,
            chatRoomUserEmail: userEmail,
            chatRoomCompanyName: companyName,
            isFromCompany,
          },
        });
        const msg = {
          content,
          from,
          to,
          date,
          isFromCompany,
        };
        socket.to(to).emit("msg", msg);
        socket.emit("msg", msg);
        const msgUpdate = {
          from,
          to,
          isFromCompany,
          data: updateSeen,
        };
        socket.to(to).emit("update-room", msgUpdate);
        socket.emit("update-room", msgUpdate);
      });
    });
  }
  res.end();
}
