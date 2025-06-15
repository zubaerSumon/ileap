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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(e);
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex items-center h-14 px-4 py-2">
        <div className="flex-1 flex items-center gap-2">
          <Input
            ref={inputRef}
            value={newMessage || ''}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="h-9 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button 
            type="submit" 
            disabled={!newMessage?.trim() || isSending}
            className="h-9 bg-blue-500 hover:bg-blue-600 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
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