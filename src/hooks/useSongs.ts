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

export const useSongs = (
  query: string = "top hindi songs"
) => {
  const [songs, setSongs] =
    useState<SongItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const formatDuration = (
    seconds?: number
  ) => {
    if (!seconds) return "";

    const mins = Math.floor(
      seconds / 60
    );

    const secs = seconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const fetchSongs =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await saavnApi.get(
            `/search/songs?query=${encodeURIComponent(
              query
            )}&limit=20`
          );

        const results: SearchResult[] =
          response.data?.data?.results ||
          [];

        // Fetch details for each song
        const formattedSongs =
          await Promise.all(
            results.map(
              async (item) => {
                try {
                  const details =
                    await saavnApi.get(
                      `/songs/${item.id}`
                    );

                  const songData =
                    details.data?.data?.[0];

                  const audio =
                    songData?.downloadUrl?.find(
                      (d: any) =>
                        d.quality ===
                        "320kbps"
                    )?.url || "";

                  return {
                    id: item.id,

                    title: item.name,

                    artist:
                      item.primaryArtists ||
                      "Unknown Artist",

                    duration:
                      formatDuration(
                        item.duration
                      ),

                    image: {
                      uri:
                        item.image?.[2]
                          ?.url ||
                        item.image?.[1]
                          ?.url ||
                        item.image?.[0]
                          ?.url ||
                        "",
                    },

                    audio,
                  };
                } catch (err) {
                  console.log(
                    "Detail error:",
                    err
                  );

                  return null;
                }
              }
            )
          );

        setSongs(
          formattedSongs.filter(
            Boolean
          ) as SongItem[]
        );
      } catch (err: any) {
        console.log(
          "Error fetching songs:",
          err?.response?.data ||
            err
        );

        setError(
          err?.message ||
            "Failed to fetch songs"
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