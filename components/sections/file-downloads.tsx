import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FileVO } from "@/lib/types";
import { getFileIcon, isVideoFile } from "@/lib/utils";
import { useState } from "react";
import { VideoPlayerDialog } from "@/components/ui/video-player-dialog";
import { useTranslation } from "react-i18next";


// FIXME 需要确定，下载这个文件，太大的话，应该是创建下载功能，或者播放文件，或者预览文件。不能是直接放到前端，这里可以考虑，悬浮播放视频，而之后播放框内，提供下载按钮
export function FileDownloads({ files }: { files: FileVO[] }) {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState<FileVO | null>(null);

  if (!files || files.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {t('home.empty.files')}
      </div>
    );
  }

  const handleFileClick = (file: FileVO, event: React.MouseEvent) => {
    if (isVideoFile(file.type)) {
      event.preventDefault();
      setSelectedVideo(file);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map(file => {
          const Icon = getFileIcon(file.type);
          const isVideo = isVideoFile(file.type);
          
          return (
            <a
              key={file.id}
              href={file.path}
              download={!isVideo ? file.name : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 rounded hover:bg-primary/10 transition"
              onClick={(e) => handleFileClick(file, e)}
            >
              <Icon className="w-10 h-10 mb-2 text-primary" />
              <span className="truncate w-full text-center">{file.name}</span>
            </a>
          );
        })}
      </div>

      {selectedVideo && (
        <VideoPlayerDialog
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.path}
          videoName={selectedVideo.name}
        />
      )}
    </>
  );
} 