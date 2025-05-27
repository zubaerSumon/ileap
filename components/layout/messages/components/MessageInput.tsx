import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isSending: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = React.memo(({ 
  newMessage, 
  setNewMessage, 
  handleSendMessage, 
  isSending 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSendMessage} className="w-full">
      <div className="flex items-center h-16 px-4 py-4 border-t">
        <div className="flex-1 flex items-center gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="h-10 flex-1"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || isSending}
            className="h-10"
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Sending...
              </span>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput; 