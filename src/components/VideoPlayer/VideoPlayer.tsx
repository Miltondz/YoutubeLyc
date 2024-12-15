import React, { useRef, useEffect, useState } from "react";
import { Card } from "../ui/card";
import { toast } from "../ui/use-toast";
import { AlertCircle } from "lucide-react";
import { extractSongInfo, getLyrics } from "@/services/lyricsService";
import { Controls } from "./Controls";
import { URLInput } from "./URLInput";
import { Input } from "../ui/input";
import { SearchButton } from "./SearchButton";
import { config } from "@/config/env";

interface VideoPlayerProps {
  onVideoLoad?: (lyrics?: string, trivia?: string) => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, config: any) => YT.Player;
      PlayerState: {
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ onVideoLoad }) => {
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("xai_api_key") || config.grokApiKey);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>("");

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("xai_api_key", apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      if (videoId) {
        initializePlayer(videoId);
      }
    };

    // If YT is already loaded, initialize player directly
    if (window.YT && videoId) {
      initializePlayer(videoId);
    }
  }, [videoId]);

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const fetchSongData = async (title: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your X.AI API key to enable song information extraction",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const songInfo = await extractSongInfo(title, apiKey);
      if (!songInfo) {
        toast({
          title: "Could not extract song information",
          description: "Please check if the video title contains song information",
          variant: "destructive",
        });
        return;
      }

      const lyrics = await getLyrics(songInfo.artist, songInfo.song);
      if (lyrics) {
        onVideoLoad?.(lyrics, songInfo.trivia || undefined);
        toast({
          title: "Success",
          description: "Found lyrics and trivia for the song!",
        });
      } else {
        toast({
          title: "Error fetching lyrics",
          description: "Could not fetch the lyrics for this song",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching song information",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const initializePlayer = (videoId: string) => {
    if (window.YT && window.YT.Player) {
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "360",
        width: "640",
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            const player = event.target as YT.Player;
            const videoData = player.getVideoData();
            if (videoData?.title) {
              setCurrentVideoTitle(videoData.title);
            }
          },
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
    } else {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive",
      });
    }
  };

  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + seconds, true);
    }
  };

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleSearch = () => {
    if (currentVideoTitle) {
      fetchSongData(currentVideoTitle);
    } else {
      toast({
        title: "No video loaded",
        description: "Please load a video first",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 glass-panel">
      <div className="mb-4">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter X.AI API Key"
          className="mb-4"
        />
      </div>

      <URLInput 
        url={url} 
        onUrlChange={setUrl} 
        onSubmit={handleUrlSubmit} 
      />

      <div className="relative aspect-video bg-black/5 rounded-lg overflow-hidden mb-4">
        {!videoId && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <AlertCircle className="w-12 h-12" />
          </div>
        )}
        <div id="youtube-player" />
      </div>

      <div className="flex flex-col gap-3">
        <Controls 
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
        />
        <SearchButton 
          onSearch={handleSearch}
          isLoading={isSearching}
          disabled={!currentVideoTitle}
        />
      </div>
    </Card>
  );
};