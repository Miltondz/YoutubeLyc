import React, { useState } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LyricsDisplay } from "@/components/LyricsDisplay";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lyrics, setLyrics] = useState<string | undefined>();
  const [trivia, setTrivia] = useState<string | undefined>();

  const handleVideoLoad = async (newLyrics?: string, newTrivia?: string) => {
    setIsLoading(true);
    setLyrics(newLyrics);
    setTrivia(newTrivia);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Music Video Lyrics
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <VideoPlayer onVideoLoad={handleVideoLoad} />
            {trivia && (
              <Card className="p-6 glass-panel">
                <h2 className="text-xl font-semibold mb-3">Song Trivia</h2>
                <p className="text-sm leading-relaxed">{trivia}</p>
              </Card>
            )}
          </div>
          <div>
            <LyricsDisplay lyrics={lyrics} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;