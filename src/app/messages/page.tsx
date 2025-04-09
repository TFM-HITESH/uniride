"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { format } from "date-fns";
import {
  getUserChats,
  getChatMessages,
  sendMessage,
} from "@/../actions/message-actions";

export default function MessagesPage() {
  const [chats, setChats] = useState<Awaited<ReturnType<typeof getUserChats>>>(
    []
  );
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    Awaited<ReturnType<typeof getChatMessages>>
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch user's chats
  useEffect(() => {
    const loadChats = async () => {
      try {
        const userChats = await getUserChats();
        setChats(userChats);
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const sentMessage = await sendMessage(selectedChat, newMessage);
      setMessages([...messages, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Skeleton components
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

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)]">
        {/* Desktop sidebar skeleton */}
        <div className="hidden md:block w-80 border-r">
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-32" />
          </div>
          <ScrollArea className="h-[calc(100%-57px)]">
            {[...Array(5)].map((_, i) => (
              <ChatSkeleton key={i} />
            ))}
          </ScrollArea>
        </div>

        {/* Mobile skeleton */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="fixed top-4 left-4 z-50">
              <Skeleton className="h-10 w-10 rounded-md" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="p-4 border-b">
                <Skeleton className="h-6 w-32" />
              </div>
              <ScrollArea className="h-[calc(100%-57px)]">
                {[...Array(5)].map((_, i) => (
                  <ChatSkeleton key={i} />
                ))}
              </ScrollArea>
            </SheetContent>
          </Sheet>
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

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <MessageSkeleton key={i} isCurrentUser={i % 3 === 0} />
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Desktop Sidebar (always visible) */}
      <div className="hidden md:block w-[400px] border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <ScrollArea className="h-[calc(100%-57px)]">
          {
            // eslint-disable-next-line
            chats.map((chat: any) => (
              <div
                key={chat.id}
                className={`p-4 border-b cursor-pointer hover:bg-accent ${
                  selectedChat === chat.id ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {chat.ride.source} to {chat.ride.destination}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {format(chat.ride.date, "MMM d")} • {chat.ride.time}
                    </p>
                    {chat.lastMessage && (
                      <p className="text-sm mt-1 truncate">
                        <span className="font-medium">
                          {chat.lastMessage.author.fullname}:
                        </span>{" "}
                        {chat.lastMessage.content}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="p-2">
                      {chat.ride.seatsLeft} seat
                      {chat.ride.seatsLeft !== 1 ? "s" : ""}
                    </Badge>
                    {chat.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          }
        </ScrollArea>
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="fixed top-4 left-4 z-50">
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Messages</h2>
            </div>
            <ScrollArea className="h-[calc(100%-57px)]">
              {
                // eslint-disable-next-line
                chats.map((chat: any) => (
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
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {chat.ride.source} to {chat.ride.destination}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {format(chat.ride.date, "MMM d")} • {chat.ride.time}
                        </p>
                      </div>
                      <Badge variant="outline" className="p-2">
                        {chat.ride.seatsLeft} seat
                        {chat.ride.seatsLeft !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                ))
              }
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="border-b p-4">
              <div className="flex items-center gap-2 md:hidden">
                <Sheet>
                  <SheetTrigger>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                </Sheet>
                {(() => {
                  // eslint-disable-next-line
                  const chat = chats.find((c: any) => c.id === selectedChat);
                  if (!chat) return null;
                  return (
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-semibold">
                          {chat.ride.source} to {chat.ride.destination}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {format(chat.ride.date, "MMM d, yyyy")} •{" "}
                          {chat.ride.time}
                        </p>
                      </div>
                      <Badge variant="outline" className="p-4">
                        {chat.ride.seatsLeft > 0 ? "Open" : "Full"}
                      </Badge>
                    </div>
                  );
                })()}
              </div>
              <div className="hidden md:flex justify-between items-center">
                {(() => {
                  // eslint-disable-next-line
                  const chat = chats.find((c: any) => c.id === selectedChat);
                  if (!chat) return null;
                  return (
                    <>
                      <div>
                        <h2 className="text-lg font-semibold">
                          {chat.ride.source} to {chat.ride.destination}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {format(chat.ride.date, "MMMM d, yyyy")} •{" "}
                          {chat.ride.time}
                        </p>
                      </div>
                      <Badge variant="outline" className="p-2">
                        {chat.ride.seatsLeft > 0 ? "Open" : "Full"}
                      </Badge>
                    </>
                  );
                })()}
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {isMessagesLoading ? (
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <MessageSkeleton key={i} isCurrentUser={i % 3 === 0} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {
                    // eslint-disable-next-line
                    messages.map((message: any) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.author.id === "current-user-id"
                            ? "justify-end"
                            : ""
                        }`}
                      >
                        {message.author.id !== "current-user-id" && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              {message.author.fullname.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[75%] rounded-lg px-4 py-2 ${
                            message.author.id === "current-user-id"
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent"
                          }`}
                        >
                          <div className="flex items-baseline gap-2">
                            {message.author.id !== "current-user-id" && (
                              <p className="font-medium text-sm">
                                {message.author.fullname}
                              </p>
                            )}
                            <p className="text-xs opacity-80">
                              {format(new Date(message.createdAt), "h:mm a")}
                            </p>
                          </div>
                          <p className="mt-1">{message.content}</p>
                        </div>
                      </div>
                    ))
                  }
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
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  disabled={isMessagesLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isMessagesLoading}
                >
                  Send
                </Button>
              </div>
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
    </div>
  );
}
