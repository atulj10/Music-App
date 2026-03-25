import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "https://saavn.sumit.co/api/";

export interface Artist {
  id: string;
  name: string;
  image: { url: string };
  followerCount?: string;
  songsCount?: string;
}

interface UseArtistsResult {
  artists: Artist[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useArtists = (query: string = "popular artists"): UseArtistsResult => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}search/artists?query=${encodeURIComponent(query)}&limit=20`);
      const results = response.data?.data?.results || [];

      const formattedArtists: Artist[] = results.map((item: any) => ({
        id: item.id,
        name: item.name,
        image: {
          url: item.image?.[2]?.url || item.image?.[1]?.url || item.image?.[0]?.url || "",
        },
        followerCount: item.followerCount,
        songsCount: item.songsCount,
      }));

      setArtists(formattedArtists);
    } catch (err: any) {
      console.log("Error fetching artists:", err?.response?.data || err);
      setError(err?.message || "Failed to fetch artists");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  return {
    artists,
    loading,
    error,
    refetch: fetchArtists,
  };
};
