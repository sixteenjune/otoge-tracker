import type { Game, NormalizedSong } from "../types";
import { normalizeSongs } from "../utils/normalizeSongs";
const files: Record<Game,string[]>={maimai:["music-ex.json","music-ex-intl.json","music-ex-deleted.json"],chunithm:["music-ex.json","music-ex-intl.json","music-ex-deleted.json"],ongeki:["music-ex.json","music-ex-deleted.json"]};
export async function loadGame(game:Game):Promise<NormalizedSong[]> {
  const all=await Promise.all(files[game].map(async file=>{
    const response=await fetch(`${import.meta.env.BASE_URL}data/${game}/${file}`);
    if(!response.ok) throw new Error(`${file}: ${response.status}`);
    return {file,rows:await response.json() as unknown[]};
  }));
  const songs = new Map<string, NormalizedSong>();
  for (const {file,rows} of all) {
    for (const song of normalizeSongs(game,rows,file.includes("deleted"),file.includes("intl"))) {
      const key=`${song.id}:${song.isDeleted ? "deleted" : "current"}`;
      const existing=songs.get(key);
      if (!existing || (song.isInternational && !existing.isInternational)) songs.set(key,song);
    }
  }
  return [...songs.values()];
}
