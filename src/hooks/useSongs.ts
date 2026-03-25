import { useEffect, useState, useCallback } from "react";
import { saavnApi } from "../services/saavnApi";
import { SongItem } from "../components/VerticalList";

interface SearchResult {
  id: string;
  name: string;
  primaryArtists?: string;
  duration?: number;
  image: { url: string }[];
}

export const useSongs = (query: string = "top hindi songs") => {
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")} mins`;
  };

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await saavnApi.get(
        `/search/songs?query=${encodeURIComponent(query)}&limit=20`
      );

      const results: SearchResult[] =
        response.data?.data?.results || [];

      const formattedSongs: SongItem[] = results.map(
        (item) => ({
          id: item.id,
          title: item.name,
          artist:
            item.primaryArtists || "Unknown Artist",
          duration: formatDuration(item.duration),
          image: {
            uri:
              item.image?.[2]?.url ||
              item.image?.[1]?.url ||
              item.image?.[0]?.url ||
              "",
          },
        })
      );

      setSongs(formattedSongs);
    } catch (err: any) {
      console.log(
        "Error fetching songs:",
        err?.response?.data || err
      );

      setError(
        err?.message || "Failed to fetch songs"
      );
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  return {
    songs,
    loading,
    error,
    refetch: fetchSongs,
  };
};