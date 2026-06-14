import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MessageSquare, ArrowLeft, Send } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function MessagesPage() {
  useSeo({ title: "Mesajlarım" });
  const { user, isLoading: authLoading } = useAuth();
  const [replyText, setReplyText] = useState<Record<number, string>>({});

  const { data: messages, isLoading } = useQuery<any[]>({
    queryKey: ["/api/messages"],
    enabled: !!user,
  });

  const replyMutation = useMutation({
    mutationFn: (data: { receiverId: number; propertyId?: number; message: string }) =>
      apiRequest("POST", "/api/messages", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PUT", `/api/messages/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Mesajlarınızı görmek için giriş yapın</h2>
            <Link href="/login"><Button className="mt-4">Giriş Yap</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-messages-title">Mesajlarım</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{messages?.length || 0} mesaj</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isSent = msg.senderId === user.id;
              const otherUser = isSent ? msg.receiver : msg.sender;
              return (
                <Card
                  key={msg.id}
                  className={`p-5 border-card-border cursor-pointer transition-colors ${!msg.isRead && !isSent ? "border-l-4 border-l-primary bg-primary/5" : ""}`}
                  onClick={() => !msg.isRead && !isSent && markReadMutation.mutate(msg.id)}
                  data-testid={`card-message-${msg.id}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-medium text-sm">
                        {isSent ? `→ ${otherUser?.name || "Kullanıcı"}` : `${otherUser?.name || "Kullanıcı"}`}
                      </p>
                      {msg.property && (
                        <Link href={`/istanbul-emlak/${msg.propertyId}`}>
                          <p className="text-xs text-primary hover:underline">{msg.property.title}</p>
                        </Link>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {msg.createdAt ? format(new Date(msg.createdAt), "d MMM yyyy", { locale: tr }) : ""}
                      </p>
                      {!msg.isRead && !isSent && (
                        <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>

                  {isSent && otherUser && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Yanıtla..."
                          rows={2}
                          className="text-sm"
                          value={replyText[msg.id] || ""}
                          onChange={(e) => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                          onClick={(e) => e.stopPropagation()}
                          data-testid={`textarea-reply-${msg.id}`}
                        />
                        <Button
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!replyText[msg.id]?.trim()) return;
                            replyMutation.mutate({
                              receiverId: otherUser.id,
                              propertyId: msg.propertyId || undefined,
                              message: replyText[msg.id],
                            });
                            setReplyText({ ...replyText, [msg.id]: "" });
                          }}
                          data-testid={`button-reply-${msg.id}`}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz mesaj yok</h3>
            <p className="text-muted-foreground">İlan sayfalarından danışmanlara mesaj gönderebilirsiniz.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
