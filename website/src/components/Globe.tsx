"use client";

import { useEffect, useRef, useState } from "react";
import { LAND_POINTS_B64 } from "./globe-data";

/**
 * Dotted globe z „kliknięciami”: co kilkaset milisekund na widocznej półkuli zapala się
 * kolejny ping, a kliknięcie w kulę dokłada własny — z kursorem z logotypu.
 * Rysowanie idzie przez Canvas 2D, bo ~4200 punktów w SVG kosztowałoby więcej niż warto.
 */
export default function Globe({ onClickCountChange }: { onClickCountChange?: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

    // Rozpakowanie punktów: 3 bajty -> (lon, lat) po 12 bitów.
    const bin = atob(LAND_POINTS_B64);
    const n = (bin.length / 3) | 0;
    const xyz = new Float32Array(n * 3);
    const ll = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const a = bin.charCodeAt(i * 3);
      const b = bin.charCodeAt(i * 3 + 1);
      const c = bin.charCodeAt(i * 3 + 2);
      const u = (a << 4) | (b >> 4);
      const v = ((b & 15) << 8) | c;
      const lon = ((u / 4095) * 360 - 180) * (Math.PI / 180);
      const lat = ((v / 4095) * 180 - 90) * (Math.PI / 180);
      const cl = Math.cos(lat);
      xyz[i * 3] = cl * Math.sin(lon);
      xyz[i * 3 + 1] = Math.sin(lat);
      xyz[i * 3 + 2] = cl * Math.cos(lon);
      ll[i * 2] = lon;
      ll[i * 2 + 1] = lat;
    }

    let W = 0, H = 0, R = 0, CX = 0, CY = 0;
    let yaw = -0.35, pitch = 0.32, vyaw = 0;
    let clicks = 0;
    let raf = 0;
    let nextSpawn = 0;
    let running = true;
    const pings: { lon: number; lat: number; t: number; manual: boolean }[] = [];

    function resize() {
      const r = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W, H) * (W < 760 ? 0.44 : 0.4);
      CX = W / 2;
      CY = H / 2;
    }

    function project(x: number, y: number, z: number): [number, number, number] {
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const x1 = x * cy + z * sy;
      const z1 = -x * sy + z * cy;
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      return [CX + x1 * R, CY - y2 * R, z2];
    }

    function addPing(lon: number, lat: number, manual: boolean) {
      pings.push({ lon, lat, t: performance.now(), manual });
      if (pings.length > 26) pings.shift();
      clicks++;
      onClickCountChange?.(clicks);
    }

    function spawnAuto() {
      for (let k = 0; k < 24; k++) {
        const i = (Math.random() * n) | 0;
        const s = project(xyz[i * 3], xyz[i * 3 + 1], xyz[i * 3 + 2]);
        if (s[2] > 0.25) {
          addPing(ll[i * 2], ll[i * 2 + 1], false);
          return;
        }
      }
    }

    function draw(now: number) {
      const g = ctx!;
      g.clearRect(0, 0, W, H);

      const glow = g.createRadialGradient(CX, CY, R * 0.55, CX, CY, R * 1.35);
      glow.addColorStop(0, "rgba(89,115,33,0.16)");
      glow.addColorStop(0.62, "rgba(49,64,19,0.10)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = glow;
      g.beginPath();
      g.arc(CX, CY, R * 1.35, 0, Math.PI * 2);
      g.fill();

      g.strokeStyle = "rgba(197,255,74,0.18)";
      g.lineWidth = 1;
      g.beginPath();
      g.arc(CX, CY, R, 0, Math.PI * 2);
      g.stroke();

      const buckets: number[][] = [[], [], [], [], []];
      for (let i = 0; i < n; i++) {
        const s = project(xyz[i * 3], xyz[i * 3 + 1], xyz[i * 3 + 2]);
        if (s[2] <= 0.02) continue;
        buckets[clamp(Math.floor(s[2] * 5), 0, 4)].push(s[0], s[1]);
      }
      const alphas = [0.16, 0.28, 0.42, 0.58, 0.78];
      const sizes = [1.1, 1.2, 1.35, 1.5, 1.6];
      for (let b = 0; b < 5; b++) {
        const arr = buckets[b];
        if (!arr.length) continue;
        g.fillStyle = `rgba(255,255,255,${alphas[b]})`;
        const sz = sizes[b];
        g.beginPath();
        for (let j = 0; j < arr.length; j += 2) g.rect(arr[j] - sz / 2, arr[j + 1] - sz / 2, sz, sz);
        g.fill();
      }

      for (let p = pings.length - 1; p >= 0; p--) {
        const pg = pings[p];
        const age = (now - pg.t) / 1900;
        if (age >= 1) {
          pings.splice(p, 1);
          continue;
        }
        const cl = Math.cos(pg.lat);
        const s = project(cl * Math.sin(pg.lon), Math.sin(pg.lat), cl * Math.cos(pg.lon));
        if (s[2] <= 0.02) continue;
        const fade = (1 - age) * clamp(s[2] * 2.2, 0, 1);
        const rad = R * 0.015 + age * R * 0.13;
        g.strokeStyle = `rgba(197,255,74,${fade * 0.85})`;
        g.lineWidth = 1.2;
        g.beginPath();
        g.arc(s[0], s[1], rad, 0, Math.PI * 2);
        g.stroke();
        g.fillStyle = `rgba(197,255,74,${fade})`;
        g.beginPath();
        g.arc(s[0], s[1], 2.1, 0, Math.PI * 2);
        g.fill();
        if (pg.manual && age < 0.6) {
          g.save();
          g.translate(s[0] + 3, s[1] + 3);
          g.scale(0.62, 0.62);
          g.fillStyle = `rgba(197,255,74,${1 - age / 0.6})`;
          g.beginPath();
          g.moveTo(0, 0);
          g.lineTo(16, 11);
          g.lineTo(8.5, 11.6);
          g.lineTo(5.2, 19);
          g.closePath();
          g.fill();
          g.restore();
        }
      }
    }

    function frame(now: number) {
      if (!reduced) {
        if (!dragRef.current) {
          yaw += 0.0016 + vyaw;
          vyaw *= 0.94;
        }
        if (now > nextSpawn) {
          spawnAuto();
          nextSpawn = now + 420 + Math.random() * 900;
        }
      }
      if (running) draw(now);
      raf = requestAnimationFrame(frame);
    }

    const dragRef = { current: false };
    let lastX = 0, lastY = 0, moved = 0, downT = 0;

    const onDown = (e: PointerEvent) => {
      dragRef.current = true;
      setDragging(true);
      moved = 0;
      downT = performance.now();
      lastX = e.clientX;
      lastY = e.clientY;
      canvas!.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      yaw += dx * 0.005;
      vyaw = dx * 0.0006;
      pitch = clamp(pitch - dy * 0.004, -0.9, 0.9);
      lastX = e.clientX;
      lastY = e.clientY;
      if (reduced) draw(performance.now());
    };
    const onUp = (e: PointerEvent) => {
      if (!dragRef.current) return;
      dragRef.current = false;
      setDragging(false);
      if (moved < 7 && performance.now() - downT < 420) {
        const r = canvas!.getBoundingClientRect();
        const nx = (e.clientX - r.left - CX) / R;
        const ny = -(e.clientY - r.top - CY) / R;
        const d2 = nx * nx + ny * ny;
        if (d2 <= 1) {
          const nz = Math.sqrt(1 - d2);
          const cp = Math.cos(-pitch), sp = Math.sin(-pitch);
          const y1 = ny * cp - nz * sp;
          const z1 = ny * sp + nz * cp;
          const cy = Math.cos(-yaw), sy = Math.sin(-yaw);
          const x2 = nx * cy + z1 * sy;
          const z2 = -nx * sy + z1 * cy;
          addPing(Math.atan2(x2, z2), Math.asin(clamp(y1, -1, 1)), true);
          if (reduced) draw(performance.now());
        }
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);

    resize();
    draw(performance.now());
    if (!reduced) raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver((en) => {
      running = en[0].isIntersecting;
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
    };
  }, [onClickCountChange]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Interaktywny globus — każdy błysk to kliknięcie w kampanii"
      className="absolute inset-0 h-full w-full touch-pan-y"
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    />
  );
}
