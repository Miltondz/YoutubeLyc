import React from "react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface LyricsDisplayProps {
  lyrics?: string;
  isLoading?: boolean;
}

export const LyricsDisplay: React.FC<LyricsDisplayProps> = ({
  lyrics,
  isLoading = false,
}) => {
  return (
    <Card className="h-full glass-panel">
      <ScrollArea className="h-[600px] w-full rounded-md p-6">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-muted animate-pulse rounded w-[80%]"
              />
            ))}
          </div>
        ) : lyrics ? (
          <div className="whitespace-pre-line text-lg leading-relaxed">
            {lyrics}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No lyrics available</p>
            <p className="text-sm">Load a video to see lyrics</p>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};