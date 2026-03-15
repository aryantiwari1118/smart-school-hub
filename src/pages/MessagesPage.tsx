import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/utils";
import { Send, Search, MessageSquare, Archive, Trash2, Reply as ReplyIcon, ArrowLeft } from "lucide-react";

interface MessageReply {
  id: number;
  sender: "You" | string;
  content: string;
  timestamp: string;
}

interface Message {
  id: number;
  sender: string;
  senderRole: string;
  subject: string;
  preview: string;
  content?: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
  replies: MessageReply[];
}

const MessagesPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filterArchived, setFilterArchived] = useState(false);
  
  const defaultMessages: Message[] = [
    {
      id: 1,
      sender: "Rajesh Kumar",
      senderRole: "Teacher",
      subject: "Priya's Performance Update",
      preview: "Priya is doing great in class. Her recent math test score was excellent...",
      content: "Priya is doing great in class. Her recent math test score was excellent. She's consistently performing well and showing great interest in mathematics. Please keep encouraging her to maintain this momentum.",
      timestamp: "2 hours ago",
      read: false,
      archived: false,
      replies: [],
    },
    {
      id: 2,
      sender: "School Admin",
      senderRole: "Admin",
      subject: "Attendance Reminder",
      preview: "Please ensure your ward's attendance is maintained above 75% for the semester...",
      content: "Please ensure your ward's attendance is maintained above 75% for the semester. Regular attendance is crucial for academic success and school policies. Contact us if there are any challenges.",
      timestamp: "1 day ago",
      read: true,
      archived: false,
      replies: [],
    },
    {
      id: 3,
      sender: "Parent Coordinator",
      senderRole: "Teacher",
      subject: "Parent-Teacher Meeting",
      preview: "We have scheduled parent-teacher meeting for next Friday at 4 PM...",
      content: "We have scheduled parent-teacher meeting for next Friday at 4 PM. Please confirm your attendance. You can discuss academic progress and any concerns.",
      timestamp: "3 days ago",
      read: true,
      archived: false,
      replies: [],
    },
    {
      id: 4,
      sender: "Sports Committee",
      senderRole: "Admin",
      subject: "Sports Day Registration",
      preview: "Sports day is coming up next month. Students can register for various events...",
      content: "Sports day is coming up next month. Students can register for various events. Multiple disciplines available - athletics, badminton, table tennis, etc.",
      timestamp: "1 week ago",
      read: true,
      archived: true,
      replies: [],
    },
  ];
  
  const [messages, setMessages] = useState<Message[]>(() => 
    storage.get("messages", defaultMessages) || defaultMessages
  );

  useEffect(() => {
    storage.set("messages", messages);
  }, [messages]);

  const selectedMsg = messages.find(m => m.id === selectedMessage);
  const filteredMessages = messages.filter(m =>
    (filterArchived ? m.archived : !m.archived) && (
      m.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleMarkAsRead = (messageId: number) => {
    setMessages(messages.map(m =>
      m.id === messageId ? { ...m, read: true } : m
    ));
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) {
      toast({
        title: "Empty Reply",
        description: "Please type a message before sending.",
        variant: "destructive" as const,
      });
      return;
    }

    setMessages(messages.map(m => {
      if (m.id === selectedMessage) {
        return {
          ...m,
          replies: [
            ...m.replies,
            {
              id: m.replies.length + 1,
              sender: "You",
              content: replyText,
              timestamp: "just now",
            },
          ],
        };
      }
      return m;
    }));

    toast({
      title: "Reply Sent",
      description: "Your reply has been sent successfully.",
    });
    setReplyText("");
  };

  const handleArchive = (messageId: number) => {
    const message = messages.find(m => m.id === messageId);
    setMessages(messages.map(m =>
      m.id === messageId ? { ...m, archived: !m.archived } : m
    ));
    setSelectedMessage(null);
    toast({
      title: message?.archived ? "Restored" : "Archived",
      description: `Message ${message?.archived ? "restored" : "moved to archive"}.`,
    });
  };

  const handleDelete = (messageId: number) => {
    const message = messages.find(m => m.id === messageId);
    setMessages(messages.filter(m => m.id !== messageId));
    setSelectedMessage(null);
    toast({
      title: "Message Deleted",
      description: `Message from ${message?.sender} has been deleted.`,
      variant: "destructive" as const,
    });
  };

  const unreadCount = messages.filter(m => !m.read && !m.archived).length;

  return (
    <DashboardLayout role="parent">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `You have ${unreadCount} unread message(s)` : "All caught up!"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Messages List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <CardTitle className="text-base">Inbox</CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-8 h-8 text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-1 mb-2">
                <Button
                  size="xs"
                  variant={!filterArchived ? "default" : "outline"}
                  onClick={() => setFilterArchived(false)}
                  className="text-xs h-7"
                >
                  Inbox
                </Button>
                <Button
                  size="xs"
                  variant={filterArchived ? "default" : "outline"}
                  onClick={() => setFilterArchived(true)}
                  className="text-xs h-7"
                >
                  Archive
                </Button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No messages</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message.id);
                        handleMarkAsRead(message.id);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedMessage === message.id
                          ? "bg-primary/10 border-primary/50 ring-1 ring-primary/20"
                          : !message.read
                          ? "bg-muted/70 border-muted-foreground/30 hover:border-muted-foreground/50"
                          : "hover:bg-muted/40 border-muted"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className={`text-sm ${!message.read ? "font-bold" : "font-medium"}`}>
                              {message.sender}
                            </p>
                            {!message.read && (
                              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {message.subject}
                          </p>
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message Detail */}
          <Card className="lg:col-span-2">
            {selectedMsg ? (
              <div className="flex flex-col h-full">
                <CardHeader className="flex-row items-start justify-between space-y-0 border-b">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg">{selectedMsg.sender}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {selectedMsg.senderRole}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedMsg.subject}</p>
                    <p className="text-xs text-muted-foreground">{selectedMsg.timestamp}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchive(selectedMsg.id)}
                      title={selectedMsg.archived ? "Restore" : "Archive"}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(selectedMsg.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto space-y-4 py-4">
                  {/* Original Message */}
                  <div className="p-4 rounded-lg bg-muted/30 border">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {selectedMsg.content || selectedMsg.preview}
                    </p>
                  </div>

                  {/* Replies */}
                  {selectedMsg.replies.length > 0 && (
                    <div className="space-y-3 pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground">
                        {selectedMsg.replies.length} Repl{selectedMsg.replies.length === 1 ? "y" : "ies"}
                      </p>
                      {selectedMsg.replies.map((reply, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="flex items-center gap-2 mb-1.5">
                            <p className={`text-sm font-medium ${reply.sender === "You" ? "text-primary" : ""}`}>
                              {reply.sender}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {reply.timestamp}
                            </p>
                          </div>
                          <p className="text-sm text-foreground">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>

                <div className="border-t p-4 space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <ReplyIcon className="h-4 w-4" /> Reply
                  </label>
                  <Textarea
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        handleSendReply();
                      }
                    }}
                    className="min-h-20 resize-none text-sm"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedMessage(null)}
                    >
                      Back
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSendReply}
                      className="gap-2"
                      disabled={!replyText.trim()}
                    >
                      <Send className="h-4 w-4" /> Send
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="h-16 w-16 text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground text-sm">Select a message to view and reply</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
