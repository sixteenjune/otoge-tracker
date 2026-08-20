import type { Game, NormalizedSong } from "../types";
import { normalizeSongs } from "../utils/normalizeSongs";
type AliasMap = Record<string, string[]>;
const files: Record<Game,string[]>={maimai:["music-ex.json","music-ex-intl.json","music-ex-deleted.json"],chunithm:["music-ex.json","music-ex-intl.json","music-ex-deleted.json"],ongeki:["music-ex.json","music-ex-deleted.json"]};
async function loadAliases(): Promise<AliasMap> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/aliases.json`);
  if (!response.ok) throw new Error(`aliases.json: ${response.status}`);
  return await response.json() as AliasMap;
}

export async function loadGame(game:Game, aliases?: AliasMap):Promise<NormalizedSong[]> {
  const dataResponses = await Promise.all(files[game].map(async file=>{
      const response=await fetch(`${import.meta.env.BASE_URL}data/${game}/${file}`);
      if(!response.ok) throw new Error(`${file}: ${response.status}`);
      return {file,rows:await response.json() as unknown[]};
  }));
  const aliasIndex = aliases || await loadAliases();
  const songs = new Map<string, NormalizedSong>();
  for (const {file,rows} of dataResponses) {
    for (const song of normalizeSongs(game,rows,file.includes("deleted"),file.includes("intl"))) {
      song.aliases = aliasIndex[`${game}:${song.id}`] || [];
      const key=`${song.id}:${song.isDeleted ? "deleted" : "current"}`;
      const existing=songs.get(key);
      if (!existing || (song.isInternational && !existing.isInternational)) songs.set(key,song);
    }
  }
  return [...songs.values()];
}

export async function loadCatalog(games: Game[]): Promise<Record<Game, NormalizedSong[]>> {
  const aliases = await loadAliases();
  const entries = await Promise.all(games.map(async game => [game, await loadGame(game, aliases)] as const));
  return Object.fromEntries(entries) as Record<Game, NormalizedSong[]>;
}
