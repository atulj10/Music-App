import { useEffect, useState, useCallback, useRef } from "react";
import { saavnApi } from "../services/saavnApi";
import { SongItem } from "../components/VerticalList";

interface SearchResult {
  id: string;
  name: string;
  primaryArtists?: string;
  duration?: number;
  image: { url: string }[];
}

const SONGS_PER_PAGE = 20;

export const useSongs = (query: string = "top hindi songs") => {
  const [songs, setSongs] = useState<SongItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentQuery, setCurrentQuery] = useState(query);
  const isFetchingRef = useRef(false);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const fetchSongs = useCallback(async (pageNum: number = 0, searchQuery?: string) => {
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      
      if (pageNum === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const queryToUse = searchQuery !== undefined ? searchQuery : currentQuery;
      const offset = pageNum * SONGS_PER_PAGE;

      const response = await saavnApi.get(
        `/search/songs?query=${encodeURIComponent(queryToUse)}&limit=${SONGS_PER_PAGE}&page=${pageNum + 1}`
      );

      const results: SearchResult[] = response.data?.data?.results || [];

      if (results.length === 0) {
        setHasMore(false);
        if (pageNum === 0) {
          setSongs([]);
        }
        return;
      }

      const formattedSongs = await Promise.all(
        results.map(async (item) => {
          try {
            const details = await saavnApi.get(`/songs/${item.id}`);
            const songData = details.data?.data?.[0];
            const audio = songData?.downloadUrl?.find(
              (d: any) => d.quality === "320kbps"
            )?.url || "";

            return {
              id: item.id,
              title: item.name,
              artist: item.primaryArtists || "Unknown Artist",
              duration: formatDuration(item.duration),
              image: {
                uri: item.image?.[2]?.url || item.image?.[1]?.url || item.image?.[0]?.url || "",
              },
              audio,
            };
          } catch (err) {
            return null;
          }
        })
      );

      const validSongs = formattedSongs.filter(Boolean) as SongItem[];

      if (pageNum === 0) {
        setSongs(validSongs);
      } else {
        setSongs(prev => [...prev, ...validSongs]);
      }

      setHasMore(validSongs.length === SONGS_PER_PAGE);
    } catch (err: any) {
      console.log("Error fetching songs:", err?.response?.data || err);
      setError(err?.message || "Failed to fetch songs");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [currentQuery]);

  const search = useCallback((newQuery: string) => {
    setCurrentQuery(newQuery);
    setPage(0);
    setHasMore(true);
    fetchSongs(0, newQuery);
  }, [fetchSongs]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || loading || isFetchingRef.current) {
      return;
    }
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSongs(nextPage);
  }, [loadingMore, hasMore, loading, page, fetchSongs]);

  const refetch = useCallback(() => {
    setPage(0);
    setHasMore(true);
    fetchSongs(0);
  }, [fetchSongs]);

  useEffect(() => {
    fetchSongs(0);
  }, []);

  return {
    songs,
    loading,
    loadingMore,
    error,
    hasMore,
    refetch,
    loadMore,
    search,
    currentQuery,
    totalSongs: songs.length,
  };
};
