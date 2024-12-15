import React from "react";
import { Button } from "../ui/button";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw,
  Rewind,
  FastForward
} from "lucide-react";

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  isPlaying, 
  onPlayPause, 
  onSeek 
}) => {
  return (
    <div className="flex justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onSeek(-20)}
        className="hover-scale"
        title="Backward 20s"
      >
        <Rewind className="h-4 w-4" />
        <span className="absolute -bottom-5 text-xs">20s</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onSeek(-10)}
        className="hover-scale"
        title="Backward 10s"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="absolute -bottom-5 text-xs">10s</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onSeek(-5)}
        className="hover-scale"
        title="Backward 5s"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="absolute -bottom-5 text-xs">5s</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onPlayPause}
        className="hover-scale"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onSeek(5)}
        className="hover-scale"
        title="Forward 5s"
      >
        <RotateCw className="h-4 w-4" />
        <span className="absolute -bottom-5 text-xs">5s</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onSeek(10)}
        className="hover-scale"
        title="Forward 10s"
      >
        <RotateCw className="h-4 w-4" />
        <span className="absolute -bottom-5 text-xs">10s</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onSeek(20)}
        className="hover-scale"
        title="Forward 20s"
      >
        <FastForward className="h-4 w-4" />
        <span className="absolute -bottom-5 text-xs">20s</span>
      </Button>
    </div>
  );
};