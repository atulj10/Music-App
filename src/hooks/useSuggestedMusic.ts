import { useEffect, useState, useCallback } from "react";
import { saavnApi } from "../services/saavnApi";

export interface MusicItem {
  id: string | number;
  name: string;
  image: {
    uri: string;
  };
}

export interface Section {
  title: string;
  data: MusicItem[];
  borderRadius?: number;
}

export const useSuggestedMusic = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapItems = (items: any[]): MusicItem[] =>
    items?.map((item) => ({
      id: item.id,
      name: item.name,
      image: {
        uri:
          item.image?.[2]?.url || item.image?.[1]?.url || item.image?.[0]?.url,
      },
    })) || [];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [recommendRes, artistsRes, playlistsRes] = await Promise.all([
        // Recommended songs
        saavnApi.get("/search/songs?query=popular"),

        // Artists
        saavnApi.get("/search/artists?query=popular"),

        // Trending playlists
        saavnApi.get("/search/playlists?query=trending"),
      ]);

      const recommendations = mapItems(recommendRes.data?.data?.results || []);

      const artists = mapItems(artistsRes.data?.data?.results || []);

      const playlists = mapItems(playlistsRes.data?.data?.results || []);

      const formattedSections: Section[] = [
        {
          title: "Recommended",
          data: recommendations.slice(0, 10),
        },
        {
          title: "Artists",
          data: artists.slice(0, 10),
          borderRadius: 50,
        },
        {
          title: "Trending Playlists",
          data: playlists.slice(0, 10),
        },
      ];

      setSections(formattedSections);
    } catch (err: any) {
      console.log("Saavn API Error:", err?.response?.data || err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch music data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    sections,
    loading,
    error,
    refetch: fetchData,
  };
};
