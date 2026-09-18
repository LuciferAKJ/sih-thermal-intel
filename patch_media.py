# -*- coding: utf-8 -*-
"""Cinematic media pass — ADDITIVE ONLY.
Adds: (1) NASA night-imagery layer inside existing .hero-visual,
(2) one full-width editorial image between 01/DETECT and 02/CLASSIFY.
No copy, layout, sections, theme, or behavior changes."""
src = open('static/landing.html', encoding='utf-8').read()

# ---------- 1) CSS: hero media layer (inside existing hero-visual stack) ----------
anchor = ".hv-terrain{position:absolute;inset:0;pointer-events:none;opacity:.55}"
assert anchor in src
src = src.replace(anchor,
anchor + """
/* cinematic media layer: NASA Black Marble night imagery, opacity-driven depth */
.hv-media{position:absolute;inset:0;background:url('/assets/media/hero_india_night.jpg') center 42%/cover no-repeat;opacity:.20;mix-blend-mode:screen;animation:hvdrift 44s ease-in-out infinite alternate;will-change:transform}
html[data-theme="light"] .hv-media{opacity:.14;mix-blend-mode:luminosity}
@keyframes hvdrift{from{transform:scale(1)}to{transform:scale(1.07) translateY(-6px)}}
@media (prefers-reduced-motion:reduce){.hv-media{animation:none}}
/* editorial full-width media moment */
.editorial{position:relative;overflow:hidden;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--bg-2)}
.editorial img{display:block;width:100%;height:min(62vh,540px);object-fit:cover;transform:scale(1.06);transition:transform 2.4s var(--ease);filter:saturate(.85)}
.editorial.in img{transform:scale(1)}
.editorial .ed-cap{position:absolute;left:28px;bottom:22px;font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:rgba(245,246,247,.75);background:rgba(10,12,16,.55);backdrop-filter:blur(6px);padding:8px 14px;border-radius:8px}
html[data-theme="light"] .editorial .ed-cap{color:var(--gray);background:rgba(246,247,248,.72)}
@media (prefers-reduced-motion:reduce){.editorial img{transform:none;transition:none}}
@media(max-width:820px){.editorial img{height:38vh}}""")

# reveal support for editorial (existing .reveal system handles opacity; add scale hook via .in)
src = src.replace(
".reveal.in{opacity:1;transform:none}",
".reveal.in{opacity:1;transform:none}")

# ---------- 2) Hero markup: media layer FIRST (bottom of stack) ----------
old_hv = """    <div class="hero-visual" aria-hidden="true">
      <svg class="hv-terrain" viewBox="0 0 1200 460" preserveAspectRatio="xMidYMid slice">"""
assert old_hv in src
src = src.replace(old_hv,
"""    <div class="hero-visual" aria-hidden="true">
      <div class="hv-media"></div>
      <svg class="hv-terrain" viewBox="0 0 1200 460" preserveAspectRatio="xMidYMid slice">""")

# ---------- 3) Editorial moment between DETECT and CLASSIFY sections ----------
old_split = """<!-- 02 CLASSIFY -->
<section id="classify" style="background:var(--bg-2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)">"""
assert old_split in src
src = src.replace(old_split,
"""<!-- Editorial media pause: Earth at night (NASA, public domain) -->
<div class="editorial reveal" aria-label="Earth at night seen from space">
  <img src="/assets/media/earth_at_night.jpg" alt="Earth at night from orbit: city lights tracing coastlines and river valleys across continents, captured by the VIIRS sensor" loading="lazy" decoding="async">
  <div class="ed-cap">EARTH AT NIGHT &middot; VIIRS DNB &middot; NASA EARTH OBSERVATORY &middot; PUBLIC DOMAIN</div>
</div>

<!-- 02 CLASSIFY -->
<section id="classify" style="background:var(--bg-2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)">""")

open('static/landing.html', 'w', encoding='utf-8').write(src)
print("media pass applied")
