import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChat, type ChatMessage } from "@/hooks/useChat";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import ReactMarkdown from "react-markdown";

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "¡Hola! 👋 Soy el asistente de **bebloo**. Estoy aquí para ayudarte con cualquier duda sobre nuestros planes, envíos o lo que necesites. ¿En qué puedo ayudarte?",
};

function ChatMessages({
  messages,
  isLoading,
}: {
  messages: ChatMessage[];
  isLoading: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const allMessages = [WELCOME_MESSAGE, ...messages];

  return (
    <ScrollArea className="flex-1 px-4 py-3">
      <div className="space-y-3">
        {allMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:m-0 [&_ul]:my-1 [&_ol]:my-1">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">·</span>
                <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>·</span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

function ChatInput({
  onSend,
  isLoading,
}: {
  onSend: (msg: string) => void;
  isLoading: boolean;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border p-3 flex gap-2 items-end">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje..."
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none min-h-[36px] max-h-[100px] py-2"
      />
      <Button
        size="icon"
        onClick={handleSubmit}
        disabled={!input.trim() || isLoading}
        className="shrink-0 rounded-full h-9 w-9"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { messages, isLoading, sendMessage } = useChat();

  // Mobile: Drawer
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 left-4 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Abrir chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>

        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="h-[85vh] flex flex-col">
            <DrawerHeader className="border-b border-border pb-3">
              <DrawerTitle className="text-base font-semibold">
                💬 Asistente bebloo
              </DrawerTitle>
            </DrawerHeader>
            <ChatMessages messages={messages} isLoading={isLoading} />
            <ChatInput onSend={sendMessage} isLoading={isLoading} />
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop: fixed panel
  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Abrir chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[380px] h-[500px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <span className="text-sm font-semibold">💬 Asistente bebloo</span>
            <button
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="Cerrar chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ChatMessages messages={messages} isLoading={isLoading} />
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      )}
    </>
  );
}
