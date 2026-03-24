"use client";

interface VideoPlayerProps {
  url: string | null | undefined;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

function extractDriveId(url: string): string | null {
  const match = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  return match?.[1] ?? null;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  if (!url) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">No video available</p>
      </div>
    );
  }

  const youtubeId = extractYouTubeId(url);
  const driveId = extractDriveId(url);

  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}`
    : driveId
      ? `https://drive.google.com/file/d/${driveId}/preview`
      : url;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      <iframe
        src={embedUrl}
        title="Video player"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
