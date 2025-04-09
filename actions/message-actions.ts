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
    status: "ONGOING" | "COMPLETED";
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

type RideMember = {
  id: string;
  fullname: string;
  email: string;
  isOwner: boolean;
};

type RideDetails = {
  id: string;
  source: string;
  destination: string;
  date: Date;
  time: string;
  carClass: string;
  carModel: string;
  totalSeats: number;
  seatsLeft: number;
  rideCost: number;
  genderPref: string;
  airConditioning: boolean;
  descText: string;
  status: "ONGOING" | "COMPLETED";
  members: RideMember[];
};

export async function getUserChats(): Promise<Chat[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    console.error("Unauthorized - No user session found");
    throw new Error("You must be logged in to view chats");
  }

  try {
    console.log("Fetching chats for user:", session.user.email);

    // 1. First get the user ID from email
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      console.error("User not found for email:", session.user.email);
      throw new Error("User not found in database");
    }

    console.log("Found user ID:", user.id);

    // 2. Fetch chat rooms for this user
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
                status: true,
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

    console.log(`Found ${chatRooms.length} chat rooms`);

    // 3. Transform the data
    const result = chatRooms.map((chatRoomUser) => {
      const ride = chatRoomUser.chatRoom.ride;
      const lastMessage = chatRoomUser.chatRoom.messages[0];

      return {
        id: chatRoomUser.chatRoom.id,
        ride: {
          id: ride.id,
          source: ride.source,
          destination: ride.destination,
          date: ride.date,
          time: ride.time,
          seatsLeft: ride.seats_left,
          status: ride.status,
        },
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              author: {
                fullname: lastMessage.author.fullname,
              },
            }
          : undefined,
        unreadCount: 0,
      };
    });

    console.log("Successfully processed chat rooms");
    return result;
  } catch (error) {
    console.error("Detailed error in getUserChats:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
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
      include: {
        chatRoom: {
          include: {
            ride: {
              select: {
                status: true,
              },
            },
          },
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
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    const chatRoom = await db.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: {
        ride: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!chatRoom) {
      throw new Error("Chat room not found");
    }

    if (chatRoom.ride.status === "COMPLETED") {
      throw new Error("Cannot send messages to completed rides");
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
    throw error;
  }
}

export async function getRideDetails(rideId: string): Promise<RideDetails> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("You must be logged in to view ride details");
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const ride = await db.ride.findUnique({
      where: { id: rideId },
      select: {
        id: true,
        source: true,
        destination: true,
        date: true,
        time: true,
        car_class: true,
        car_model: true,
        total_seats: true,
        seats_left: true,
        ride_cost: true,
        gender_pref: true,
        air_conditioning: true,
        desc_text: true,
        status: true,
        creatorId: true,
        creator: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
        passengers: {
          select: {
            user: {
              select: {
                id: true,
                fullname: true,
                email: true,
              },
            },
          },
          where: {
            NOT: {
              userId: user.id, // Exclude creator from passengers list
            },
          },
        },
      },
    });

    if (!ride) {
      throw new Error("Ride not found");
    }

    const isPassenger = ride.passengers.some((p) => p.user.id === user.id);
    if (ride.creatorId !== user.id && !isPassenger) {
      throw new Error("You don't have access to this ride");
    }

    // Create members list ensuring owner only appears once
    const members: RideMember[] = [
      {
        id: ride.creator.id,
        fullname: ride.creator.fullname,
        email: ride.creator.email,
        isOwner: true,
      },
      ...ride.passengers.map((p) => ({
        id: p.user.id,
        fullname: p.user.fullname,
        email: p.user.email,
        isOwner: false,
      })),
    ];

    return {
      id: ride.id,
      source: ride.source,
      destination: ride.destination,
      date: ride.date,
      time: ride.time,
      carClass: ride.car_class,
      carModel: ride.car_model,
      totalSeats: ride.total_seats,
      seatsLeft: ride.seats_left,
      rideCost: ride.ride_cost,
      genderPref: ride.gender_pref,
      airConditioning: ride.air_conditioning,
      descText: ride.desc_text,
      status: ride.status,
      members,
    };
  } catch (error) {
    console.error(`Error fetching ride details for ${rideId}:`, error);
    throw error;
  }
}
