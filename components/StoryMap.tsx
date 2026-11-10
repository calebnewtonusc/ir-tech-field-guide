"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import mapData from "@/lib/map.json";

// Part 1, the departure. One drawing that changes as you scroll, the way the Firm Foundation church
// is wired, flooded and rebuilt: a startup lights up, its product crosses borders, every border turns
// into a rule, the map scatters, then "you" appear and every line routes through you and goes calm.
// Medium: the same land dots as the org map (land-50m, equirectangular, 80N to 58S).

const map: { width: number; height: number; dots: number[][] } = mapData;
const K = map.width / 360;
const NORTH = 80;
const xy = (lat: number, lon: number): [number, number] => [
  (lon + 180) * K,
  (NORTH - lat) * K,
];

const HQ = xy(37.77, -122.42); // San Francisco
const YOU = xy(46, -52); // between the startup and the rest of the world
// Each label is a real rule a US tech company runs into there (checked 2026-11-09):
// EU AI Act enforcement from Aug 2026; US chip export controls on China; Congress; India's DPDP Act;
// Brazil's election court rules on AI deepfakes; Nigeria's central bank fintech licensing.
const BORDERS = [
  { at: xy(50.85, 4.35), city: "Brussels", rule: "EU AI Act" },
  { at: xy(39.9, 116.4), city: "Beijing", rule: "Export controls" },
  { at: xy(38.9, -77.04), city: "Washington", rule: "Congress" },
  { at: xy(28.6, 77.2), city: "New Delhi", rule: "Data protection law" },
  { at: xy(-15.8, -47.9), city: "Brasília", rule: "Election deepfake rules" },
  { at: xy(6.5, 3.4), city: "Lagos", rule: "Fintech licensing" },
];

const BEATS = [
  {
    from: 0.12,
    to: 0.34,
    line: "A startup in San Francisco ships to the whole world.",
  },
  { from: 0.34, to: 0.55, line: "Every border it crosses has its own rules." },
  { from: 0.55, to: 0.76, line: "Engineers can't read this map." },
  { from: 0.76, to: 1.01, line: "You can." },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
// Deterministic per-dot noise, so the storm is the same storm on every frame.
const hash = (i: number) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

function curve(a: [number, number], b: [number, number]) {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2 - Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.28;
  return { a, c: [mx, my] as [number, number], b };
}

function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  t: number,
) {
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  // Camera: fill the width on a laptop; on a phone keep the map at least half the screen tall and
  // pan from San Francisco out to the whole world as the story widens.
  // Phone: 1.45x the screen width centered on 3W frames San Francisco to Beijing in one view
  // (a bigger zoom that panned lost SF off the left edge in the 390px contact sheet, 2026-11-09).
  const phone = w < 640;
  const s = phone ? (w * 1.45) / map.width : Math.max(w / map.width, (h * 0.5) / map.height);
  const wide = ramp(p, 0.3, 0.45);
  const camX = phone ? xy(0, -3)[0] : s * map.width > w ? HQ[0] + (map.width / 2 - HQ[0]) * wide : map.width / 2;
  const ox = w / 2 - camX * s;
  const oy = h * 0.58 - (map.height / 2) * s;
  const P = (q: [number, number]): [number, number] => [
    ox + q[0] * s,
    oy + q[1] * s,
  ];

  const storm = ramp(p, 0.55, 0.66) * (1 - ramp(p, 0.78, 0.9));
  const ruled = ramp(p, 0.36, 0.46);
  const calm = ramp(p, 0.8, 0.9);

  // Land dots. In the storm they blow east and fade, then settle back.
  const r = Math.max(1.2, 1.5 * s);
  ctx.fillStyle = "#57534a";
  for (let i = 0; i < map.dots.length; i++) {
    const d = map.dots[i];
    let x = d[0];
    let y = d[1];
    if (storm > 0) {
      const n = hash(i);
      x += storm * (30 + n * 70 + Math.sin(t / 700 + n * 6) * 6);
      y += storm * (hash(i + 7) - 0.5) * 40;
    }
    const [sx, sy] = P([x, y]);
    if (sx < -4 || sx > w + 4) continue;
    ctx.globalAlpha = 1 - storm * 0.55 * hash(i + 3);
    ctx.fillRect(sx - r / 2, sy - r / 2, r, r);
  }
  ctx.globalAlpha = 1;

  const appear = ramp(p, 0.12, 0.2);
  const reach = ramp(p, 0.2, 0.36);
  const youIn = ramp(p, 0.76, 0.84);

  // Lines from the startup (or, at the end, from you) to every border.
  BORDERS.forEach((bd, i) => {
    const origin: [number, number] = [
      HQ[0] + (YOU[0] - HQ[0]) * youIn,
      HQ[1] + (YOU[1] - HQ[1]) * youIn,
    ];
    const cv = curve(origin, bd.at);
    const k = clamp01(reach * 1.4 - i * 0.07);
    if (k <= 0) return;
    const [ax, ay] = P(cv.a);
    const [cx, cy] = P(cv.c);
    const [bx, by] = P(cv.b);
    const red = ruled * (1 - calm);
    ctx.strokeStyle =
      calm > 0.5
        ? `rgba(245,78,0,${0.55 + 0.35 * calm})`
        : red > 0.5
          ? "rgba(229,72,77,0.9)"
          : "rgba(242,240,232,0.55)";
    ctx.lineWidth = Math.max(1, 1.4 * Math.min(s, 1.6));
    ctx.setLineDash(red > 0.5 && storm > 0.2 ? [4, 6] : []);
    ctx.beginPath();
    const steps = 40;
    for (let j = 0; j <= steps * k; j++) {
      const u = j / steps;
      const qx = (1 - u) * (1 - u) * ax + 2 * (1 - u) * u * cx + u * u * bx;
      const qy = (1 - u) * (1 - u) * ay + 2 * (1 - u) * u * cy + u * u * by;
      if (j === 0) ctx.moveTo(qx, qy);
      else ctx.lineTo(qx, qy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    if (k >= 1) {
      ctx.fillStyle =
        calm > 0.5 ? "#f54e00" : red > 0.5 ? "#e5484d" : "#f2f0e8";
      ctx.beginPath();
      ctx.arc(bx, by, 3.2, 0, Math.PI * 2);
      ctx.fill();
      if (ruled > 0) {
        const fs = Math.round(phone ? 9 : Math.max(11, Math.min(13, 9 * s)));
        ctx.font = `500 ${fs}px var(--font-jetbrains), ui-monospace, monospace`;
        ctx.globalAlpha = ruled;
        ctx.fillStyle = calm > 0.5 ? "#f2f0e8" : "#ff8a8d";
        const label = bd.rule.toUpperCase();
        // Flip the label to the left of its dot when it would run off the right edge (phone width).
        const tw = ctx.measureText(label).width;
        // Washington sits just left of the YOU dot, so its label always goes left or it lands on YOU (seen 2026-11-10).
        ctx.fillText(label, bd.city === "Washington" || bx + 7 + tw > w - 6 ? bx - 7 - tw : bx + 7, by - 6);
        ctx.globalAlpha = 1;
      }
    }
  });

  // The startup.
  if (appear > 0) {
    const [hx, hy] = P(HQ);
    const pulse = (t / 1600) % 1;
    ctx.strokeStyle = `rgba(242,240,232,${(1 - pulse) * 0.6 * appear})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(hx, hy, 6 + pulse * 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(242,240,232,${appear})`;
    ctx.beginPath();
    ctx.arc(hx, hy, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // You.
  if (youIn > 0) {
    const [yx, yy] = P(YOU);
    const [hx, hy] = P(HQ);
    ctx.strokeStyle = `rgba(245,78,0,${youIn})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + (yx - hx) * youIn, hy + (yy - hy) * youIn);
    ctx.stroke();
    ctx.fillStyle = "#f54e00";
    ctx.beginPath();
    ctx.arc(yx, yy, 9 * youIn + 0.01, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(245,78,0,${0.45 * youIn})`;
    ctx.beginPath();
    ctx.arc(yx, yy, 18 + 4 * Math.sin(t / 500), 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = `600 13px var(--font-jetbrains), ui-monospace, monospace`;
    ctx.fillStyle = `rgba(242,240,232,${youIn})`;
    ctx.fillText("YOU", yx - 13, yy + 34);
  }
}

export default function StoryMap() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const size = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    size();
    window.addEventListener("resize", size);
    // Draw only while the story is on screen: 4,600 dots a frame is a battery cost when nobody's looking.
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(canvas);
    const loop = (t: number) => {
      draw(ctx, canvas.clientWidth, canvas.clientHeight, reduce ? 1 : progress.current, reduce ? 0 : t);
      if (!reduce && visible) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", size);
    };
  }, [reduce]);

  const headOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const headY = useTransform(scrollYProgress, [0, 0.1], [0, -40]);

  if (reduce) {
    return (
      <section ref={ref} className="relative bg-night text-on-night">
        <div className="mx-auto max-w-6xl px-4 pt-28 sm:px-6">
          <Headline />
          <ul className="mt-10 grid gap-3 text-xl text-on-ink-soft">
            {BEATS.map((b) => (
              <li key={b.line}>{b.line}</li>
            ))}
          </ul>
        </div>
        <canvas
          ref={canvasRef}
          aria-hidden
          className="block h-[70svh] w-full"
        />
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative h-[300svh] bg-night text-on-night sm:h-[380svh]"
      aria-label="Why tech companies need people who understand the world"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />
        <motion.div
          style={{ opacity: headOpacity, y: headY }}
          className="absolute inset-x-0 top-24 mx-auto max-w-6xl px-4 sm:px-6"
        >
          <Headline />
        </motion.div>
        {BEATS.map((b) => (
          <BeatLine key={b.line} beat={b} progress={scrollYProgress} />
        ))}
        <motion.p
          style={{ opacity: headOpacity }}
          className="absolute inset-x-0 bottom-8 text-center font-mono text-xs tracking-[0.2em] text-on-ink-muted"
        >
          SCROLL
        </motion.p>
      </div>
    </section>
  );
}

function Headline() {
  return (
    <>
      <h1 className="max-w-4xl text-[clamp(2.7rem,min(7.4vw,9svh),5.6rem)] leading-[0.98] font-normal tracking-[-0.035em]">
        Every tech company is a foreign policy company now.
      </h1>
      <p className="mt-6 max-w-md text-lg text-on-ink-soft">
        If you study how the world works, they need you.
      </p>
    </>
  );
}

function BeatLine({
  beat,
  progress,
}: {
  beat: (typeof BEATS)[number];
  progress: MotionValue<number>;
}) {
  const span = beat.to - beat.from;
  const last = beat.to > 1;
  const opacity = useTransform(
    progress,
    last
      ? [beat.from, beat.from + 0.04]
      : [beat.from, beat.from + 0.04, beat.to - 0.04, beat.to],
    last ? [0, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [beat.from, beat.from + span * 0.25],
    [18, 0],
  );
  const isYou = beat.line === "You can.";
  return (
    <motion.p
      style={{ opacity, y }}
      className={`pointer-events-none absolute inset-x-4 top-[16svh] mx-auto max-w-3xl text-center tracking-[-0.02em] ${
        isYou
          ? "text-[clamp(3rem,10vw,7rem)] leading-none text-primary"
          : "text-[clamp(1.6rem,4vw,2.6rem)] leading-tight"
      }`}
    >
      {beat.line}
    </motion.p>
  );
}
