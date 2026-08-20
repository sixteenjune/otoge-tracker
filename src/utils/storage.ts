import type { Game } from "../types";
const KEY="otoge-favorites";
export const favoriteKey=(game:Game,id:string)=>`${game}:${id}`;
export function getFavorites(): string[] { try { return JSON.parse(localStorage.getItem(KEY)||"[]"); } catch { return []; } }
export function toggleFavorite(key:string): string[] { const next=getFavorites().includes(key)?getFavorites().filter(x=>x!==key):[...getFavorites(),key]; localStorage.setItem(KEY,JSON.stringify(next)); return next; }
