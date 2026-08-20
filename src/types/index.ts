export type Game = "maimai" | "chunithm" | "ongeki";
export type LocalizedText = { ja?: string; en?: string; romaji?: string; original?: string };
export type NormalizedChart = {
  difficulty: string; level?: string; constant?: number; notes?: number; combo?: number;
  holds?: number; slides?: number; breaks?: number; special?: number; chartDesigner?: LocalizedText;
  extraFields?: Record<string, unknown>;
};
export type NormalizedSong = {
  id: string; game: Game; title: LocalizedText; artist?: LocalizedText; genre?: LocalizedText;
  version?: LocalizedText; releaseDate?: string; bpm?: number; jacketUrl?: string;
  isDeleted?: boolean; isInternational?: boolean; charts: NormalizedChart[];
  sourceData: Record<string, unknown>; searchText: string;
};
