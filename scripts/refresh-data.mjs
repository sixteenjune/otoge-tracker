import { cp, mkdir, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
const root = new URL("..", import.meta.url).pathname;
const temp = "/tmp/otoge-db-refresh";
await rm(temp,{recursive:true,force:true});
execFileSync("git",["clone","--depth","1","--quiet","https://github.com/zvuc/otoge-db.git",temp],{stdio:"inherit"});
for (const game of ["maimai","chunithm","ongeki"]) {
  const source=join(temp,game); const target=join(root,"public/data",game);
  await mkdir(target,{recursive:true});
  const files=game==="ongeki"?["music-ex.json","music-ex-deleted.json"]:["music-ex.json","music-ex-intl.json","music-ex-deleted.json"];
  for (const file of files) await cp(join(source,"data",file),join(target,file));
  await rm(join(target,"jacket"),{recursive:true,force:true});
  await cp(join(source,"jacket"),join(target,"jacket"),{recursive:true});
}
console.log("Refreshed local OTOGE DB snapshots.");
