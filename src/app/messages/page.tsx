"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Crown, Loader2 } from "lucide-react";
import { format, isWithinInterval, subHours } from "date-fns";
import {
  getUserChats,
  getChatMessages,
  sendMessage,
  getRideDetails,
} from "@/../actions/message-actions";
import ColourAvatar from "@/components/colour-avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { processName } from "@/lib/utils";
import debounce from "lodash/debounce";

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

type Message = {
  id: string;
  content: string;
  author: {
    id: string;
    fullname: string;
    email: string;
  };
  createdAt: Date;
  isOptimistic?: boolean;
};

const RideDetailsSidebar = memo(
  ({
    selectedChat,
    // eslint-disable-next-line
    chats,
    isRideDetailsLoading,
    rideDetails,
    showReminder,
  }: {
    selectedChat: string | null;
    // eslint-disable-next-line
    chats: any[];
    isRideDetailsLoading: boolean;
    rideDetails: RideDetails | null;
    showReminder: boolean;
  }) => {
    if (!selectedChat) return null;

    return (
      <div className="hidden lg:block w-[350px] border-l">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {isRideDetailsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2 pt-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </div>
              </div>
            ) : rideDetails ? (
              <>
                {showReminder && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Upcoming Ride!</AlertTitle>
                    <AlertDescription>
                      Your ride is in less than 6 hours. Get ready!
                    </AlertDescription>
                  </Alert>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Ride Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">From</span>
                      <span className="font-medium">{rideDetails.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">To</span>
                      <span className="font-medium">
                        {rideDetails.destination}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">
                        {format(rideDetails.date, "PPP")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{rideDetails.time}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Car</span>
                      <span className="font-medium">
                        {rideDetails.carModel} ({rideDetails.carClass})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seats</span>
                      <span className="font-medium">
                        {rideDetails.totalSeats - rideDetails.seatsLeft}/
                        {rideDetails.totalSeats} taken
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost</span>
                      <span className="font-medium">
                        ${rideDetails.rideCost}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AC</span>
                      <span className="font-medium">
                        {rideDetails.airConditioning ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender Pref</span>
                      <span className="font-medium capitalize">
                        {rideDetails.genderPref.toLowerCase()}
                      </span>
                    </div>
                    {rideDetails.descText && (
                      <>
                        <Separator className="my-2" />
                        <div>
                          <p className="text-muted-foreground">Notes</p>
                          <div className="relative group max-w-[250px]">
                            <p className="text-sm text-muted-foreground mt-1 text-ellipsis overflow-hidden whitespace-nowrap">
                              {rideDetails.descText}
                            </p>
                            {rideDetails.descText.length > 50 && (
                              <div className="absolute z-10 mt-4 transition-all duration-200 ease-out opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 pointer-events-none bg-popover text-popover-foreground text-xs p-3 rounded-md shadow-md whitespace-normal w-64 break-words border">
                                {rideDetails.descText}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      Ride Members ({rideDetails.members.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {rideDetails.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <ColourAvatar name={member.fullname} />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {member.fullname}
                            </span>
                            {member.isOwner && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">
                  Failed to load ride details
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }
);

RideDetailsSidebar.displayName = "RideDetailsSidebar";

export default function MessagesPage() {
  // eslint-disable-next-line
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);
  const [isRideDetailsLoading, setIsRideDetailsLoading] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [lastPollTime, setLastPollTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const currentUserId = processName(session?.user.name);

  // Fetch user's chats
  useEffect(() => {
    const loadChats = async () => {
      try {
        const userChats = await getUserChats();
        const ongoingChats = userChats.filter(
          (chat) => chat.ride.status === "ONGOING"
        );
        const completedChats = userChats
          .filter((chat) => chat.ride.status === "COMPLETED")
          .sort(
            (a, b) =>
              new Date(b.ride.date).getTime() - new Date(a.ride.date).getTime()
          )
          .slice(0, 5);

        setChats([...ongoingChats, ...completedChats]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading chats:", error);
        setIsLoading(false);
      }
    };
    loadChats();
  }, []);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (!selectedChat) return;

    const loadMessages = async () => {
      setIsMessagesLoading(true);
      try {
        const chatMessages = await getChatMessages(selectedChat);
        setMessages(chatMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsMessagesLoading(false);
      }
    };
    loadMessages();
  }, [selectedChat]);

  // Poll for new messages
  useEffect(() => {
    if (!selectedChat) return;

    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    let isUserAtBottom = true;
    let prevScrollHeight = messagesContainer.scrollHeight;

    const checkScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
      isUserAtBottom = scrollHeight - (scrollTop + clientHeight) < 100;
    };

    messagesContainer.addEventListener("scroll", checkScrollPosition, {
      passive: true,
    });

    const pollMessages = async () => {
      try {
        const now = Date.now();
        if (now - lastPollTime < 3500) return;

        const newMessages = await getChatMessages(selectedChat);
        setLastPollTime(now);

        setMessages((prev) => {
          if (JSON.stringify(newMessages) !== JSON.stringify(prev)) {
            return newMessages;
          }
          return prev;
        });

        if (!isUserAtBottom) {
          const newScrollHeight = messagesContainer.scrollHeight;
          messagesContainer.scrollTop += newScrollHeight - prevScrollHeight;
        }
        prevScrollHeight = messagesContainer.scrollHeight;
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    const pollInterval = setInterval(pollMessages, 4000);
    return () => {
      clearInterval(pollInterval);
      messagesContainer.removeEventListener("scroll", checkScrollPosition);
    };
  }, [selectedChat, lastPollTime]);

  // Update last message in sidebar
  useEffect(() => {
    if (messages.length > 0 && selectedChat) {
      const lastMessage = messages[messages.length - 1];
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChat
            ? {
                ...chat,
                lastMessage: {
                  content: lastMessage.content,
                  createdAt: lastMessage.createdAt,
                  author: {
                    fullname: lastMessage.author.fullname,
                  },
                },
              }
            : chat
        )
      );
    }
  }, [messages, selectedChat]);

  // Fetch ride details when chat is selected
  useEffect(() => {
    if (!selectedChat) return;

    const loadRideDetails = async () => {
      setIsRideDetailsLoading(true);
      try {
        const chat = chats.find((c) => c.id === selectedChat);
        if (chat) {
          const details = await getRideDetails(chat.ride.id);
          setRideDetails(details);

          const rideDateTime = new Date(chat.ride.date);
          const [hours, minutes] = chat.ride.time.split(":").map(Number);
          rideDateTime.setHours(hours, minutes, 0, 0);

          const sixHoursBefore = subHours(rideDateTime, 6);
          setShowReminder(
            isWithinInterval(new Date(), {
              start: sixHoursBefore,
              end: rideDateTime,
            })
          );
        }
      } catch (error) {
        console.error("Error loading ride details:", error);
      } finally {
        setIsRideDetailsLoading(false);
      }
    };

    if (
      !rideDetails ||
      rideDetails.id !== chats.find((c) => c.id === selectedChat)?.ride.id
    ) {
      loadRideDetails();
    }
    // eslint-disable-next-line
  }, [selectedChat]);

  // Auto-scroll to bottom on new messages if at bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  // eslint-disable-next-line
  const debouncedSendMessage = useCallback(
    debounce(async (chatId: string, messageContent: string) => {
      try {
        const sentMessage = await sendMessage(chatId, messageContent);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id.startsWith("temp-")
              ? { ...sentMessage, isOptimistic: false }
              : msg
          )
        );
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) =>
          prev.filter((msg) => !msg.id.startsWith("temp-"))
        );
      } finally {
        setIsSendingMessage(false);
      }
    }, 500),
    []
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || isSendingMessage) return;

    const selectedChatData = chats.find((chat) => chat.id === selectedChat);
    if (selectedChatData?.ride.status === "COMPLETED") {
      alert("Cannot send messages for completed rides");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    setIsSendingMessage(true);

    // Optimistic update
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        content: newMessage,
        author: {
          id: "current-user-id",
          fullname: currentUserId || "You",
          email: "",
        },
        createdAt: new Date(),
        isOptimistic: true,
      },
    ]);

    // Update last message in sidebar
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat
          ? {
              ...chat,
              lastMessage: {
                content: newMessage,
                createdAt: new Date(),
                author: {
                  fullname: "You",
                },
              },
            }
          : chat
      )
    );

    setNewMessage("");
    debouncedSendMessage(selectedChat, newMessage);
  };

  const MessageSkeleton = ({
    isCurrentUser = false,
  }: {
    isCurrentUser?: boolean;
  }) => (
    <div className={`flex gap-3 ${isCurrentUser ? "justify-end" : ""}`}>
      {!isCurrentUser && <Skeleton className="h-8 w-8 rounded-full" />}
      <Skeleton
        className={`h-16 w-3/4 rounded-lg ${isCurrentUser ? "ml-auto" : ""}`}
      />
    </div>
  );

  const ChatSkeleton = () => (
    <div className="p-4 border-b">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
        </div>
        <Skeleton className="h-6 w-10 rounded-full" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left sidebar skeleton */}
        <div className="hidden md:block w-[350px] border-r">
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-32" />
          </div>
          <ScrollArea className="h-[calc(100%-57px)]">
            {[...Array(5)].map((_, i) => (
              <ChatSkeleton key={i} />
            ))}
          </ScrollArea>
        </div>

        {/* Main area skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="border-b p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </div>

          <ScrollArea className="flex-1 p-4" ref={messagesContainerRef}>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <MessageSkeleton key={i} isCurrentUser={i % 3 === 0} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>

        {/* Right sidebar skeleton */}
        <div className="hidden lg:block w-80 border-l">
          <div className="p-4 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2 pt-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentChat = chats.find((chat) => chat.id === selectedChat);
  const isChatCompleted = currentChat?.ride.status === "COMPLETED";

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Sidebar (Chat List) */}
      <div className="hidden md:block w-[350px] border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <ScrollArea className="h-[calc(100%-57px)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 border-b cursor-pointer hover:bg-accent ${
                selectedChat === chat.id ? "bg-accent" : ""
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">
                  {chat.ride.source} to {chat.ride.destination}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(chat.ride.date), "MMM d, yyyy")} •{" "}
                  {chat.ride.time}
                  {chat.lastMessage && (
                    <p className="truncate mt-1">
                      <span className="font-medium">
                        {chat.lastMessage.author.fullname}:
                      </span>{" "}
                      {chat.lastMessage.content}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="px-2 py-0.5 text-xs">
                    {chat.ride.seatsLeft} seat
                    {chat.ride.seatsLeft !== 1 ? "s" : ""}
                  </Badge>
                  {chat.ride.status === "ONGOING" ? (
                    <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">
                      Ongoing
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-600 text-white text-xs px-2 py-0.5">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Messages</h2>
            </div>
            <ScrollArea className="h-[calc(100%-57px)]">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 border-b cursor-pointer hover:bg-accent ${
                    selectedChat === chat.id ? "bg-accent" : ""
                  }`}
                  onClick={() => {
                    setSelectedChat(chat.id);
                    document.dispatchEvent(
                      new KeyboardEvent("keydown", { key: "Escape" })
                    );
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium">
                      {chat.ride.source} to {chat.ride.destination}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(chat.ride.date), "MMM d")} •{" "}
                      {chat.ride.time}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="px-2 py-0.5 text-xs">
                        {chat.ride.seatsLeft} seat
                        {chat.ride.seatsLeft !== 1 ? "s" : ""}
                      </Badge>
                      {chat.ride.status === "ONGOING" ? (
                        <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">
                          Ongoing
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-600 text-white text-xs px-2 py-0.5">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="border-b p-4">
              <div className="flex items-center gap-2 md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                </Sheet>
                {currentChat && (
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {currentChat.ride.source} to{" "}
                        {currentChat.ride.destination}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(currentChat.ride.date), "MMM d, yyyy")}{" "}
                        • {currentChat.ride.time}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="p-2">
                        {currentChat.ride.seatsLeft > 0 ? "Open" : "Full"}
                      </Badge>
                      {currentChat.ride.status === "ONGOING" ? (
                        <Badge className="bg-green-600 text-white text-xs">
                          Ongoing
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-600 text-white text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden md:flex justify-between items-center">
                {currentChat && (
                  <>
                    <div>
                      <h2 className="text-lg font-semibold">
                        {currentChat.ride.source} to{" "}
                        {currentChat.ride.destination}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {format(
                          new Date(currentChat.ride.date),
                          "MMMM d, yyyy"
                        )}{" "}
                        • {currentChat.ride.time}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="p-2">
                        {currentChat.ride.seatsLeft > 0 ? "Open" : "Full"}
                      </Badge>
                      {currentChat.ride.status === "ONGOING" ? (
                        <Badge className="bg-green-600 text-white text-xs">
                          Ongoing
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-600 text-white text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1 p-4" ref={messagesContainerRef}>
              {isMessagesLoading && messages.length === 0 ? (
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <MessageSkeleton key={i} isCurrentUser={i % 3 === 0} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isCurrentUser =
                      message.author.fullname === currentUserId;
                    const isOptimistic = message.isOptimistic;

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          isCurrentUser ? "justify-end" : ""
                        } ${isOptimistic ? "opacity-80" : ""}`}
                      >
                        {!isCurrentUser && (
                          <ColourAvatar
                            name={message.author.fullname}
                            className="mt-2"
                          />
                        )}
                        <div
                          className={`max-w-[75%] rounded-lg px-4 py-2 ${
                            isCurrentUser
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-muted"
                          }`}
                        >
                          {!isCurrentUser && (
                            <p className="font-medium text-sm">
                              {message.author.fullname}
                            </p>
                          )}
                          <p className="mt-1">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isCurrentUser
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {format(new Date(message.createdAt), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      newMessage.trim() &&
                      !isSendingMessage
                    ) {
                      handleSendMessage();
                    }
                  }}
                  disabled={isSendingMessage || isChatCompleted}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    isSendingMessage || isChatCompleted || !newMessage.trim()
                  }
                >
                  {isSendingMessage ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                    </div>
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
              {isChatCompleted && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  This ride is completed. No new messages can be sent.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium">Select a chat</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar
              </p>
            </div>
          </div>
        )}
      </div>

      <RideDetailsSidebar
        selectedChat={selectedChat}
        chats={chats}
        isRideDetailsLoading={isRideDetailsLoading}
        rideDetails={rideDetails}
        showReminder={showReminder}
      />
    </div>
  );
}
