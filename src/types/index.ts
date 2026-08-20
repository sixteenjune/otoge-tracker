export type Game = "maimai" | "chunithm" | "ongeki";
export type LocalizedText = { ja?: string; en?: string; romaji?: string; original?: string };
export type NormalizedChart = {
  difficulty: string; level?: string; notes?: number; combo?: number;
  holds?: number; slides?: number; breaks?: number; special?: number; noteDesigner?: LocalizedText;
  extraFields?: Record<string, unknown>;
};
export type NormalizedSong = {
  id: string; game: Game; title: LocalizedText; artist?: LocalizedText; genre?: LocalizedText;
  version?: LocalizedText; releaseDate?: string; addedDate?: string; bpm?: number; jacketUrl?: string;
  isDeleted?: boolean; isInternational?: boolean; charts: NormalizedChart[];
  sourceData: Record<string, unknown>; searchText: string; aliases?: string[];
};
