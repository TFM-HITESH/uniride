"use server";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

type Chat = {
  id: string;
  ride: {
    id: string;
    source: string;
    destination: string;
    date: Date;
    time: string;
    seatsLeft: number;
  };
  lastMessage?: {
    content: string;
    createdAt: Date;
    author: {
      fullname: string;
    };
  };
  unreadCount: number;
};

type Message = {
  id: string;
  content: string;
  author: {
    id: string;
    fullname: string;
    email: string;
  };
  createdAt: Date;
};

export async function getUserChats(): Promise<Chat[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    console.error("Unauthorized - No session found");
    throw new Error("You must be logged in to view chats");
  }

  try {
    // First get the user ID from email
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    const chatRooms = await db.chatRoomUser.findMany({
      where: { userId: user.id },
      include: {
        chatRoom: {
          include: {
            ride: {
              select: {
                id: true,
                source: true,
                destination: true,
                date: true,
                time: true,
                seats_left: true,
              },
            },
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
              include: {
                author: {
                  select: {
                    fullname: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        chatRoom: {
          messages: {
            _count: "desc",
          },
        },
      },
    });

    return chatRooms.map((chatRoomUser) => ({
      id: chatRoomUser.chatRoom.id,
      ride: {
        id: chatRoomUser.chatRoom.ride.id,
        source: chatRoomUser.chatRoom.ride.source,
        destination: chatRoomUser.chatRoom.ride.destination,
        date: chatRoomUser.chatRoom.ride.date,
        time: chatRoomUser.chatRoom.ride.time,
        seatsLeft: chatRoomUser.chatRoom.ride.seats_left,
      },
      lastMessage: chatRoomUser.chatRoom.messages[0]
        ? {
            content: chatRoomUser.chatRoom.messages[0].content,
            createdAt: chatRoomUser.chatRoom.messages[0].createdAt,
            author: {
              fullname: chatRoomUser.chatRoom.messages[0].author.fullname,
            },
          }
        : undefined,
      unreadCount: 0,
    }));
  } catch (error) {
    console.error("Error fetching user chats:", error);
    throw new Error("Failed to fetch chats. Please try again.");
  }
}

export async function getChatMessages(chatRoomId: string): Promise<Message[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    console.error("Unauthorized - No session found for messages");
    throw new Error("You must be logged in to view messages");
  }

  try {
    // First get the user ID from email
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    const chatRoomUser = await db.chatRoomUser.findUnique({
      where: {
        userId_chatRoomId: {
          userId: user.id,
          chatRoomId,
        },
      },
    });

    if (!chatRoomUser) {
      console.error(`User ${user.id} not authorized for chat ${chatRoomId}`);
      throw new Error("You don't have access to this chat");
    }

    return await db.message.findMany({
      where: { chatRoomId },
      include: {
        author: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    console.error(`Error fetching messages for chat ${chatRoomId}:`, error);
    throw new Error("Failed to load messages. Please try again.");
  }
}

export async function sendMessage(
  chatRoomId: string,
  content: string
): Promise<Message> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    console.error("Unauthorized - No session found for sending");
    throw new Error("You must be logged in to send messages");
  }

  try {
    // First get the user ID from email
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    const chatRoomUser = await db.chatRoomUser.findUnique({
      where: {
        userId_chatRoomId: {
          userId: user.id,
          chatRoomId,
        },
      },
    });

    if (!chatRoomUser) {
      console.error(`User ${user.id} not authorized to send to ${chatRoomId}`);
      throw new Error("You don't have access to this chat");
    }

    return await db.message.create({
      data: {
        content,
        chatRoomId,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(`Error sending message to ${chatRoomId}:`, error);
    throw new Error("Failed to send message. Please try again.");
  }
}
