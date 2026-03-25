import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "https://saavn.sumit.co/api/";

export interface Album {
  id: string;
  title: string;
  image: { url: string };
  year?: string;
  artist?: string;
  songsCount?: string;
}

interface UseAlbumsResult {
  albums: Album[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useAlbums = (query: string = "popular albums"): UseAlbumsResult => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}search/albums?query=${encodeURIComponent(query)}&limit=20`);
      const results = response.data?.data?.results || [];

      const formattedAlbums: Album[] = results.map((item: any) => ({
        id: item.id,
        title: item.title,
        image: {
          url: item.image?.[2]?.url || item.image?.[1]?.url || item.image?.[0]?.url || "",
        },
        year: item.year,
        artist: item.artist || item.primaryArtists,
        songsCount: item.songsCount,
      }));

      setAlbums(formattedAlbums);
    } catch (err: any) {
      console.log("Error fetching albums:", err?.response?.data || err);
      setError(err?.message || "Failed to fetch albums");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchAlbums();
    console.log(albums)
  }, [fetchAlbums]);

  return {
    albums,
    loading,
    error,
    refetch: fetchAlbums,
  };
};
