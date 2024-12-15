import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface URLInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const URLInput: React.FC<URLInputProps> = ({ 
  url, 
  onUrlChange, 
  onSubmit 
}) => {
  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Enter YouTube URL"
          className="flex-1"
        />
        <Button type="submit">Load Video</Button>
      </div>
    </form>
  );
};