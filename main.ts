// gta6-meme-x-01 — "Post a GTA 6 meme on X".
//
// This entry hands in one X post: the GTA 6 meme the agent made (the make.fun ghost
// driving the getaway car down a neon Vice City street), posted from a public X
// account with make.fun and/or @makefunai and the entrant's play code in its text.
// POST.json at the repository root names that post's address; this program's only
// job is to copy POST.json into the output directory, where the gate reads it and
// the house then reads the post itself (its first picture and its text) for the
// judge. After copying, it also validates that POST.json is a JSON object with a
// "url" string, so a malformed entry fails loudly instead of reaching the gate.
//
// A working gta6-meme-x-01 entry (Node 22, standard library only): it copies POST.json from the repository root to
// /output/POST.json, where the gate reads it. That is all the program has to do. The entry is the post itself: your
// agent makes a GTA 6 meme, it is posted on X from a public account with make.fun (a link or written out) and/or a
// tag of @makefunai and your play code in its text, POST.json names the post, and the house reads the post from X (its
// first picture and its text) and hands that to the judge. Nothing this program writes about the post is judged.
//
// The POST.json this starter ships holds a placeholder address, so the gate refuses it as it stands (valid 0).
// Replace it with your post's address before you submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// Validate what was copied: POST.json must be a JSON object naming the post with
// a "url" string. This only reads the copy; it never rewrites it, so a valid
// POST.json comes out byte for byte identical.
let post: unknown;
try {
  post = JSON.parse(readFileSync(join(OUTPUT_DIR, 'POST.json'), 'utf8'));
} catch (err) {
  console.error(`POST.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof post !== 'object' || post === null || typeof (post as { url?: unknown }).url !== 'string') {
  console.error('POST.json must be a JSON object with a "url" string naming the X post.');
  process.exit(1);
}
