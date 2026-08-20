import type { Game, LocalizedText, NormalizedChart, NormalizedSong } from "../types";
const text = (value: unknown): string | undefined => typeof value === "string" && value.trim() ? value.trim() : value != null && String(value).trim() ? String(value).trim() : undefined;
const num = (value: unknown): number | undefined => { const n = Number(value); return Number.isFinite(n) ? n : undefined; };
const localized = (value: unknown): LocalizedText => {
  const valueText = text(value);
  return valueText ? { ja: valueText, original: valueText } : {};
};
const chart = (raw: Record<string, unknown>, prefix: string, name: string, extra: string[] = []): NormalizedChart | null => {
  const level = text(raw[`lev_${prefix}`]); const notes = num(raw[`lev_${prefix}_notes`]);
  if (!level && notes === undefined) return null;
  return { difficulty: name, level, notes, holds: num(raw[`lev_${prefix}_notes_hold`]), slides: num(raw[`lev_${prefix}_notes_slide`]), breaks: num(raw[`lev_${prefix}_notes_break`]), special: num(raw[`lev_${prefix}_notes_${extra[0] || "air"}`]), chartDesigner: localized(raw[`lev_${prefix}_designer`]), extraFields: Object.fromEntries(extra.map(k => [k, raw[`lev_${prefix}_${k}`]])) };
};
export function normalizeSongs(game: Game, rows: unknown[], deleted = false, intl = false): NormalizedSong[] {
  return rows.filter((r): r is Record<string, unknown> => !!r && typeof r === "object").map((raw, index) => {
    const id = text(raw.id) || text(raw.sort) || `${game}-${index}`;
    const title = localized(raw.title); const artist = localized(raw.artist);
    const genre = localized(raw.catname || raw.category || raw.catcode);
    const version = localized(raw.version);
    const prefixes = game === "maimai" ? [["bas","Basic"],["adv","Advanced"],["exp","Expert"],["mas","Master"],["remas","Re:MASTER"],["dx_bas","DX Basic"],["dx_adv","DX Advanced"],["dx_exp","DX Expert"],["dx_mas","DX Master"]] : game === "chunithm" ? [["bas","Basic"],["adv","Advanced"],["exp","Expert"],["mas","Master"],["ult","Ultima"]] : [["bas","Basic"],["adv","Advanced"],["exc","Expert"],["mas","Master"],["lnt","Lunatic"]];
    if (game === "maimai") prefixes.push(["utage", `Utage${text(raw.kanji) ? ` [${text(raw.kanji)}]` : ""}`]);
    const charts = prefixes.map(([p,n]) => chart(raw, p, n, game === "ongeki" ? ["bells"] : game === "chunithm" ? ["air","flick"] : ["touch"])).filter((x): x is NormalizedChart => !!x);
    const searchText = JSON.stringify(raw).toLocaleLowerCase();
    const image = text(raw.image_url || raw.image);
    const base = import.meta.env.BASE_URL;
    const searchable = [title.ja, title.original, title.en, title.romaji, text(raw.title_kana), text(raw.title_sort), artist?.ja, genre?.ja, version?.ja, ...charts.flatMap(c => [c.difficulty, c.chartDesigner?.ja])].filter(Boolean).join(" ");
    return { id, game, title, artist, genre, version, releaseDate: text(raw.date_added || raw.release), bpm: num(raw.bpm), jacketUrl: image ? `${base}data/${game}/jacket/${image}` : undefined, isDeleted: deleted, isInternational: intl || text(raw.intl) === "1", charts, sourceData: raw, searchText: searchable.toLocaleLowerCase() };
  });
}
export function preferredText(value?: LocalizedText): string { return value?.ja || value?.original || value?.en || value?.romaji || "Unknown"; }
export function alternateText(value?: LocalizedText): string | undefined { const primary = preferredText(value); return [value?.en, value?.romaji, value?.original].find(x => x && x !== primary); }
