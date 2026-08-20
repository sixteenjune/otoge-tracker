import type { Game, NormalizedSong } from "../types";
import { normalizeSongs } from "../utils/normalizeSongs";
type AliasMap = Record<string, string[]>;
const files: Record<Game,string[]>={maimai:["music-ex.json","music-ex-intl.json","music-ex-deleted.json"],chunithm:["music-ex.json","music-ex-intl.json","music-ex-deleted.json"],ongeki:["music-ex.json","music-ex-deleted.json"]};
async function loadAliases(): Promise<AliasMap> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/aliases.json`);
  if (!response.ok) throw new Error(`aliases.json: ${response.status}`);
  return await response.json() as AliasMap;
}

function isSpecialChart(song: NormalizedSong): boolean {
  return song.game === "maimai" ? Boolean(song.sourceData.kanji) : song.game === "chunithm" ? Boolean(song.sourceData.we_kanji) : false;
}

function mergeKey(song: NormalizedSong): string {
  const title = String(song.sourceData.title || "").replace(/^\[[^\]]+\]\s*/, "").trim().toLocaleLowerCase();
  const artist = String(song.sourceData.artist || "").trim().toLocaleLowerCase();
  return `${song.game}:${title}:${artist}:${song.isDeleted ? "deleted" : "current"}`;
}

function mergeSpecialCharts(records: NormalizedSong[]): NormalizedSong[] {
  const merged = records.filter(song => !isSpecialChart(song));
  const specialGroups = new Map<string, NormalizedSong>();
  for (const special of records.filter(isSpecialChart)) {
    const existing = specialGroups.get(mergeKey(special));
    if (!existing) {
      specialGroups.set(mergeKey(special), special);
      continue;
    }
    const existingCharts = new Set(existing.charts.map(chart => `${chart.difficulty}:${chart.level}:${chart.notes}:${chart.noteDesigner?.ja}`));
    existing.charts.push(...special.charts.filter(chart => !existingCharts.has(`${chart.difficulty}:${chart.level}:${chart.notes}:${chart.noteDesigner?.ja}`)));
    existing.addedDate = [...[existing.addedDate, special.addedDate].filter(Boolean)].sort().pop() || existing.addedDate;
    existing.aliases = [...new Set([...(existing.aliases || []), ...(special.aliases || [])])];
  }
  for (const special of specialGroups.values()) {
    const base = merged.find(song => mergeKey(song) === mergeKey(special));
    if (!base) {
      merged.push(special);
      continue;
    }
    const existing = new Set(base.charts.map(chart => `${chart.difficulty}:${chart.level}:${chart.notes}:${chart.noteDesigner?.ja}`));
    base.charts.push(...special.charts.filter(chart => !existing.has(`${chart.difficulty}:${chart.level}:${chart.notes}:${chart.noteDesigner?.ja}`)));
    base.addedDate = [...[base.addedDate, special.addedDate].filter(Boolean)].sort().pop() || base.addedDate;
    base.aliases = [...new Set([...(base.aliases || []), ...(special.aliases || [])])];
  }
  return merged;
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
  return mergeSpecialCharts([...songs.values()]);
}

export async function loadCatalog(games: Game[]): Promise<Record<Game, NormalizedSong[]>> {
  const aliases = await loadAliases();
  const entries = await Promise.all(games.map(async game => [game, await loadGame(game, aliases)] as const));
  return Object.fromEntries(entries) as Record<Game, NormalizedSong[]>;
}
