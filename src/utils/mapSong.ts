export function mapSong(apiSong: any) {
  return {
    id: apiSong.id,

    title: apiSong.name,

    artist:
      apiSong.artists.primary
        ?.map((a: any) => a.name)
        .join(", ") || "Unknown",

    duration: formatDuration(apiSong.duration),

    image: {
      uri: apiSong.image[2].url,
    },

    audio:
      apiSong.downloadUrl.find(
        (d: any) => d.quality === "320kbps"
      )?.url,
  };
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${m}:${s.toString().padStart(2, "0")}`;
}