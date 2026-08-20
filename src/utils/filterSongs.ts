import type { NormalizedSong } from "../types";
export type Filters = { query: string; difficulty: string; level: string; version: string; genre: string; intl: string; deleted: boolean; sort: string; direction: "asc"|"desc" };
export const emptyFilters: Filters = { query:"", difficulty:"all", level:"all", version:"all", genre:"all", intl:"all", deleted:false, sort:"title", direction:"asc" };
export function filterSongs(songs: NormalizedSong[], f: Filters) {
  const q=f.query.trim().toLocaleLowerCase(); const out=songs.filter(s => {
    const hasDiff=f.difficulty==="all" || s.charts.some(c=>c.difficulty===f.difficulty);
    const hasLevel=f.level==="all" || s.charts.some(c=>c.level===f.level || c.level?.startsWith(f.level));
    return (!q || s.searchText.includes(q)) && hasDiff && hasLevel && (f.version==="all" || s.version?.ja===f.version) && (f.genre==="all" || s.genre?.ja===f.genre) && (f.intl==="all" || (f.intl==="yes" ? s.isInternational : !s.isInternational)) && (f.deleted ? s.isDeleted : !s.isDeleted);
  });
  const value=(s:NormalizedSong): string|number => f.sort==="title" ? s.title.ja||"" : f.sort==="artist" ? s.artist?.ja||"" : f.sort==="version" ? s.version?.ja||"" : f.sort==="genre" ? s.genre?.ja||"" : f.sort==="bpm" ? s.bpm||0 : f.sort==="date" ? s.releaseDate||"" : f.sort==="notes" ? Math.max(...s.charts.map(c=>c.notes||0)) : Math.max(...s.charts.map(c=>c.constant||Number(c.level)||0));
  return out.sort((a,b)=>{const av=value(a),bv=value(b); const n=typeof av==="number"&&typeof bv==="number"?av-bv:String(av).localeCompare(String(bv),"ja"); return f.direction==="asc"?n:-n;});
}
