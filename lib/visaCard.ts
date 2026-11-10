import type { Path, PathId } from "@/lib/data";

// Draws her visa as a 1080x1350 PNG (the portrait size Instagram and iMessage show whole), then hands it
// to the phone's share sheet, or downloads it where sharing files isn't supported.

const INK: Record<PathId, string> = {
  policy: "#3f63a6",
  defense: "#b4532a",
  trust: "#2f7a45",
  expansion: "#6f4aa8",
  risk: "#9a6a12",
};

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export function drawVisa(path: Path): HTMLCanvasElement {
  const W = 1080;
  const H = 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const sans = getComputedStyle(document.body).fontFamily || "sans-serif";
  const mono = "ui-monospace, Menlo, monospace";

  ctx.fillStyle = "#14130f";
  ctx.fillRect(0, 0, W, H);
  // The page, with the guilloche rings the on-screen visa has.
  ctx.fillStyle = "#fbf6ea";
  ctx.beginPath();
  ctx.roundRect(70, 70, W - 140, H - 140, 36);
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = "rgba(180,160,120,0.22)";
  ctx.lineWidth = 2;
  for (let r = 60; r < 900; r += 26) {
    ctx.beginPath();
    ctx.ellipse(W - 120, H - 160, r * 1.2, r, -0.4, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = "#8a7f66";
  ctx.font = `500 26px ${mono}`;
  ctx.fillText("VISA  ·  ISSUED NOV 2026", 140, 190);

  ctx.fillStyle = "#26251e";
  ctx.font = `400 92px ${sans}`;
  let y = 340;
  for (const l of wrap(ctx, path.name, W - 280)) {
    ctx.fillText(l, 140, y);
    y += 100;
  }

  ctx.fillStyle = "#4a4840";
  ctx.font = `400 38px ${sans}`;
  y += 40;
  for (const l of wrap(ctx, path.oneLine, W - 280)) {
    ctx.fillText(l, 140, y);
    y += 54;
  }

  // The APPROVED stamp, rotated like the one on the page.
  ctx.save();
  ctx.translate(W - 330, H - 400);
  ctx.rotate(-0.16);
  ctx.strokeStyle = INK[path.id];
  ctx.fillStyle = INK[path.id];
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.roundRect(-190, -62, 380, 124, 14);
  ctx.stroke();
  ctx.font = `700 54px ${mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("APPROVED", 0, 4);
  ctx.restore();

  ctx.fillStyle = "#8a7f66";
  ctx.font = `500 24px ${mono}`;
  ctx.fillText("IR × TECH FIELD GUIDE", 140, H - 150);
  ctx.fillText("ir-tech-field-guide.up.railway.app", 140, H - 112);
  return c;
}

export async function shareVisa(path: Path) {
  const blob = await new Promise<Blob | null>((res) =>
    drawVisa(path).toBlob(res, "image/png"),
  );
  if (!blob) return;
  const file = new File([blob], "my-ir-tech-visa.png", { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "My IR x Tech visa" });
      return;
    } catch (err) {
      // She closed the share sheet: nothing to do. Anything else falls through to a download.
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
