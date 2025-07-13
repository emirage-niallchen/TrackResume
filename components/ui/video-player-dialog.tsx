import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

interface VideoPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoName: string;
}

export function VideoPlayerDialog({
  isOpen,
  onClose,
  videoUrl,
  videoName,
}: VideoPlayerDialogProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span className="truncate pr-4">{videoName}</span>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="ml-auto flex items-center gap-1"
            >
              <a href={videoUrl} download={videoName} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 y-12" />
                <span>下载</span>
              </a>
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="relative aspect-video w-full bg-muted/20">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <video
            src={videoUrl}
            className="w-full h-full"
            controls
            autoPlay
            muted
            onLoadedData={handleLoadedData}
          >
            您的浏览器不支持视频播放
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
} 