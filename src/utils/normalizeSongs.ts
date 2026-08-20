import type { Game, LocalizedText, NormalizedChart, NormalizedSong } from "../types";
const text = (value: unknown): string | undefined => typeof value === "string" && value.trim() ? value.trim() : value != null && String(value).trim() ? String(value).trim() : undefined;
const num = (value: unknown): number | undefined => { const n = Number(value); return Number.isFinite(n) ? n : undefined; };
const localized = (value: unknown): LocalizedText => {
  const valueText = text(value);
  return valueText ? { ja: valueText, original: valueText } : {};
};
const chart = (raw: Record<string, unknown>, prefix: string, name: string, extra: string[] = [], levelOverride?: string): NormalizedChart | null => {
  const level = levelOverride || text(raw[prefix]); const notes = num(raw[`${prefix}_notes`]);
  const noteDesigner = localized(raw[`${prefix}_designer`]);
  if (!level && notes === undefined && !noteDesigner.ja) return null;
  return { difficulty: name, level, notes, holds: num(raw[`${prefix}_notes_hold`]), slides: num(raw[`${prefix}_notes_slide`]), breaks: num(raw[`${prefix}_notes_break`]), special: num(raw[`${prefix}_notes_${extra[0] || "air"}`]), noteDesigner, extraFields: Object.fromEntries(extra.map(k => [k, raw[`${prefix}_${k}`]])) };
};
export function normalizeSongs(game: Game, rows: unknown[], deleted = false, intl = false): NormalizedSong[] {
  return rows.filter((r): r is Record<string, unknown> => !!r && typeof r === "object").map((raw, index) => {
    const id = text(raw.id) || text(raw.sort) || `${game}-${index}`;
    const rawTitle = text(raw.title);
    const displayTitle = game === "maimai" ? rawTitle?.replace(/^\[[^\]]+\]\s*/, "") : rawTitle;
    const title = localized(displayTitle); const artist = localized(raw.artist);
    const genre = localized(raw.catname || raw.category || raw.catcode);
    const version = localized(raw.version);
    const prefixes = game === "maimai" ? [["lev_bas","Basic"],["lev_adv","Advanced"],["lev_exp","Expert"],["lev_mas","Master"],["lev_remas","Re:MASTER"],["dx_lev_bas","DX Basic"],["dx_lev_adv","DX Advanced"],["dx_lev_exp","DX Expert"],["dx_lev_mas","DX Master"],["dx_lev_remas","DX Re:MASTER"]] : game === "chunithm" ? [["lev_bas","Basic"],["lev_adv","Advanced"],["lev_exp","Expert"],["lev_mas","Master"],["lev_ult","Ultima"]] : [["lev_bas","Basic"],["lev_adv","Advanced"],["lev_exc","Expert"],["lev_mas","Master"],["lev_lnt","Lunatic"]];
    const extras = game === "ongeki" ? ["bells"] : game === "chunithm" ? ["air","flick"] : ["touch"];
    const charts = prefixes.map(([p,n]) => chart(raw, p, n, extras)).filter((x): x is NormalizedChart => !!x);
    if (game === "maimai" && text(raw.kanji) && text(raw.lev_utage)) {
      const utage = chart(raw, "lev_utage", `Utage [${text(raw.kanji)}]`, extras);
      if (utage) charts.push(utage);
    }
    if (game === "chunithm" && text(raw.we_kanji)) {
      const worldsEnd = chart(raw, "lev_we", `WORLD'S END [${text(raw.we_kanji)}]`, extras, text(raw.we_star) ? `☆${text(raw.we_star)}` : undefined);
      if (worldsEnd) charts.push(worldsEnd);
    }
    const searchText = JSON.stringify(raw).toLocaleLowerCase();
    const image = text(raw.image_url || raw.image);
    const base = import.meta.env.BASE_URL;
    const searchable = [rawTitle, title.ja, title.original, title.en, title.romaji, text(raw.title_kana), text(raw.title_sort), artist?.ja, genre?.ja, version?.ja, ...charts.flatMap(c => [c.difficulty, c.noteDesigner?.ja])].filter(Boolean).join(" ");
    return { id, game, title, artist, genre, version, releaseDate: text(raw.release || raw.date), addedDate: text(raw.date_added || raw.date_intl_added), bpm: num(raw.bpm), jacketUrl: image ? `${base}data/${game}/jacket/${image}` : undefined, isDeleted: deleted, isInternational: intl || text(raw.intl) === "1", charts, sourceData: raw, searchText: searchable.toLocaleLowerCase() };
  });
}
export function preferredText(value?: LocalizedText): string { return value?.ja || value?.original || value?.en || value?.romaji || "Unknown"; }
export function alternateText(value?: LocalizedText): string | undefined { const primary = preferredText(value); return [value?.en, value?.romaji, value?.original].find(x => x && x !== primary); }
