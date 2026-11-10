// Build lib/map.json: a dotted world (land-50m from world-atlas) and one pin per real org location.
// Pins come from research/geocode.json (OpenStreetMap Nominatim). Projection: equirectangular,
// cropped to 58S..80N so Antarctica doesn't eat a third of the frame.
import fs from "node:fs";
import { geoContains, geoEquirectangular } from "d3-geo";
import { feature } from "topojson-client";

const topo = JSON.parse(fs.readFileSync("node_modules/world-atlas/land-50m.json", "utf8"));
const land = feature(topo, topo.objects.land);
const geo = JSON.parse(fs.readFileSync("research/geocode.json", "utf8"));
const orgs = JSON.parse(fs.readFileSync("lib/orgs.json", "utf8"));

const W = 1000, NORTH = 80, SOUTH = -58;
const k = W / 360;
const H = Math.round((NORTH - SOUTH) * k);
const proj = geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, NORTH * k]);

// Land dots on a lon/lat grid. 1.8 degrees keeps it readable at phone width.
const STEP = 1.8;
const dots = [];
for (let lat = NORTH - STEP / 2; lat > SOUTH; lat -= STEP) {
  for (let lon = -180 + STEP / 2; lon < 180; lon += STEP) {
    if (geoContains(land, [lon, lat])) {
      const [x, y] = proj([lon, lat]);
      dots.push([+x.toFixed(1), +y.toFixed(1)]);
    }
  }
}

// FaithTech Create stories name only a city.
const CITY_COUNTRY = { Waterloo: "Canada", Vancouver: "Canada", Chennai: "India", Bangkok: "Thailand" };
const groups = new Map();
for (const o of orgs) {
  const c = geo[o.location];
  if (!c) continue;
  const key = o.location;
  if (!groups.has(key)) {
    const [x, y] = proj([c[1], c[0]]);
    const parts = o.location.split(",").map((s) => s.trim());
    const label = o.location === "Bay Area" ? "Bay Area" : parts.length >= 3 ? parts.slice(-3, -1).join(", ") : parts.join(", ");
    const country = CITY_COUNTRY[key] || (/USA|United States|Bay Area/.test(key) ? "United States" : parts[parts.length - 1]);
    groups.set(key, { location: key, label, country, x: +x.toFixed(1), y: +y.toFixed(1), abroad: country !== "United States", orgs: [] });
  }
  groups.get(key).orgs.push(o.name);
}
// Merge pins that land within 9 map units of a bigger one. Measured 2026-11-09: Mountain View sat 0.3
// units from the Bay Area pin and its 14px hit area stole every tap meant for the 14-org cluster.
const MERGE = 9;
const raw = [...groups.values()].sort((a, b) => b.orgs.length - a.orgs.length);
const pins = [];
for (const g of raw) {
  const near = pins.find((p) => Math.hypot(p.x - g.x, p.y - g.y) < MERGE);
  if (near) {
    near.orgs.push(...g.orgs);
    near.locations.push(g.location);
    if (near.country !== g.country) near.country = `${near.country} and ${g.country}`;
  } else {
    pins.push({ ...g, locations: [g.location] });
  }
}
pins.sort((a, b) => b.orgs.length - a.orgs.length);
const abroad = pins.filter((p) => p.abroad);
const countries = new Set(pins.map((p) => p.country));

fs.writeFileSync("lib/map.json", JSON.stringify({ width: W, height: H, dots, pins, countries: [...countries] }));
console.log({ dots: dots.length, pins: pins.length, abroadPins: abroad.length, countriesOutsideUS: countries.size, placed: pins.reduce((n, p) => n + p.orgs.length, 0) });
console.log([...countries].join(" | "));
