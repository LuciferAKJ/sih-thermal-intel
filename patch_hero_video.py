# -*- coding: utf-8 -*-
"""HERO MEDIA REDESIGN — one surgical change.
Removes the rectangular .hero-visual card treatment; the NASA SVS Earth-at-night
video becomes a full-bleed cinematic layer behind the EXISTING hero copy.
Everything else untouched: nav, copy, CTAs, theme system, sections, footer."""

src = open('static/landing.html', encoding='utf-8').read()

# ============ 1) CSS: full-bleed hero media replaces the card ============
old_hero_visual_css = """.hero-visual{margin-top:90px;position:relative;border:1px solid var(--line);border-radius:20px;background:
  radial-gradient(ellipse 60% 55% at 62% 42%, rgba(126,200,242,.05), transparent 65%),
  linear-gradient(var(--line) 1px, transparent 1px),
  linear-gradient(90deg, var(--line) 1px, transparent 1px),
  var(--bg-2);
  background-size:auto,56px 56px,56px 56px,auto;
  height:min(52vh,460px);overflow:hidden;animation:rise 1.2s .45s var(--ease) both}"""
assert old_hero_visual_css in src, "hero-visual css not found"
new_hero_media_css = """.hero-media{position:absolute;inset:0;overflow:hidden;background:var(--bg-2) url('/static/media/hero_india_night.jpg') center/cover no-repeat}
.hero-media video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 1.6s var(--ease)}
.hero-media video.ready{opacity:.85}
.hero-media::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,12,16,.82) 0%,rgba(10,12,16,.55) 42%,rgba(10,12,16,.35) 68%,var(--bg) 100%)}
html[data-theme="light"] .hero-media::after{background:linear-gradient(180deg,rgba(246,247,248,.78) 0%,rgba(246,247,248,.5) 42%,rgba(246,247,248,.3) 68%,var(--bg) 100%)}
.hero-content{position:relative;z-index:2}
@media (prefers-reduced-motion:reduce){.hero-media video{display:none}.hero-media::after{background:linear-gradient(180deg,rgba(10,12,16,.6) 0%,rgba(10,12,16,.35) 50%,var(--bg) 100%)}}"""
src = src.replace(old_hero_visual_css, new_hero_media_css)

# hero section needs position:relative for the absolute media layer
old_hero = ".hero{min-height:100svh;display:flex;flex-direction:column;justify-content:center;position:relative;padding:140px 0 80px}"
assert old_hero in src
src = src.replace(old_hero,
".hero{min-height:100svh;display:flex;flex-direction:column;justify-content:center;position:relative;padding:150px 0 110px}")

# thermal signal layer repositioned: floats over the video, right-of-center
old_cross = ".hv-crosshair{position:absolute;left:63%;top:42%;transform:translate(-50%,-50%)}"
assert old_cross in src
src = src.replace(old_cross,
""".hero-signal{position:absolute;inset:0;z-index:1;pointer-events:none}
.hv-crosshair{position:absolute;left:68%;top:44%;transform:translate(-50%,-50%)}""")

# signal tag: readable glass over video
old_tag = ".hv-tag{position:absolute;left:calc(63% + 34px);top:42%;transform:translateY(-50%);background:var(--nav-bg);backdrop-filter:blur(8px);border:1px solid rgba(255,90,31,.3);border-radius:10px;padding:12px 16px;animation:tagin 1s 1.4s var(--ease) both}"
assert old_tag in src
src = src.replace(old_tag,
".hv-tag{position:absolute;left:calc(68% + 30px);top:44%;transform:translateY(-50%);background:rgba(10,12,16,.62);backdrop-filter:blur(10px);border:1px solid rgba(255,90,31,.3);border-radius:10px;padding:12px 16px;animation:tagin 1s 1.4s var(--ease) both}")
src = src.replace('html[data-theme="light"] .hv-terrain{opacity:.5}',
'html[data-theme="light"] .hv-terrain{opacity:.5}\nhtml[data-theme="light"] .hv-tag{background:rgba(246,247,248,.7)}\nhtml[data-theme="light"] .hv-meta .v{color:var(--white)}\nhtml[data-theme="light"] .hv-meta .k{color:var(--gray-2)}')

# floating meta strip: repositioned as bottom-left instrumentation over video
old_meta = ".hv-meta{position:absolute;left:28px;bottom:24px;display:flex;gap:40px}"
assert old_meta in src
src = src.replace(old_meta, ".hv-meta{position:absolute;left:0;right:0;bottom:34px;display:flex;gap:44px;padding:0 32px;max-width:1200px;margin:0 auto}")

# terrain layers now span the full hero (not a small card): keep, but full-bleed
old_terrain = ".hv-terrain{position:absolute;inset:0;pointer-events:none;opacity:.55}"
assert old_terrain in src
src = src.replace(old_terrain, ".hv-terrain{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.4;z-index:1}")

# orbit track: hide in full-bleed mode (was designed for the card)
old_orbit_css = ".hv-orbit{position:absolute;pointer-events:none}"
assert old_orbit_css in src
src = src.replace(old_orbit_css, ".hv-orbit{display:none}")

# media drift layer (old .hv-media inside card) no longer needed as separate layer
src = src.replace(".hv-media{position:absolute;inset:0;background:url('/static/media/hero_india_night.jpg') center 42%/cover no-repeat;opacity:.20;mix-blend-mode:screen;animation:hvdrift 44s ease-in-out infinite alternate;will-change:transform}",
".hv-media{display:none}")
src = src.replace("@keyframes hvdrift{from{transform:scale(1)}to{transform:scale(1.07) translateY(-6px)}}\n", "")
src = src.replace("@media (prefers-reduced-motion:reduce){.hv-media{animation:none}}\n", "")

# scan line keeps subtle movement across the full hero
old_scan = ".hv-scan{position:absolute;top:0;bottom:0;width:1px;background:linear-gradient(180deg,transparent,rgba(126,200,242,.35),transparent);left:20%;animation:scan 9s linear infinite}"
assert old_scan in src
src = src.replace(old_scan,
".hv-scan{position:absolute;top:0;bottom:0;width:1px;z-index:1;background:linear-gradient(180deg,transparent,rgba(126,200,242,.30),transparent);left:20%;animation:scan 11s linear infinite}")

# ============ 2) MARKUP: replace card with full-bleed layer ============
# hero container becomes .hero-content wrapper
old_container_open = """<header class="hero">
  <div class="container">"""
assert old_container_open in src
src = src.replace(old_container_open,
"""<header class="hero">
  <div class="hero-media" aria-hidden="true">
    <video id="hero-video" autoplay muted loop playsinline preload="metadata"
           poster="/static/media/hero_india_night.jpg"
           src="/static/media/viirs_earth_night_720p.mp4"></video>
    <div class="hero-signal">
      <div class="hv-scan"></div>
      <svg class="hv-terrain" viewBox="0 0 1200 460" preserveAspectRatio="xMidYMid slice">
        <path d="M-20,340 C160,300 300,360 460,330 C640,296 760,352 940,316 C1060,292 1150,320 1220,300"/>
        <path d="M-20,380 C180,340 320,400 500,368 C680,336 800,390 980,352 C1090,330 1160,352 1220,336"/>
        <path d="M-20,420 C200,384 340,440 540,404 C720,372 840,428 1020,392 C1120,372 1170,392 1220,380"/>
      </svg>
      <div class="hv-crosshair">
        <div class="hv-glow"></div>
        <div class="hv-ring"></div>
        <div class="hv-ring r2"></div>
        <div class="hv-dot"></div>
      </div>
      <div class="hv-tag">
        <div class="t1">VIIRS &middot; THERMAL ANOMALY</div>
        <div class="t2">Industrial Fire &mdash; 91%</div>
        <div class="t3">FRP 42.8 MW &middot; 30.70&deg;N 76.71&deg;E</div>
      </div>
      <div class="hv-meta">
        <div><div class="k">LOCATION</div><div class="v">30.7046&deg; N &middot; 76.7104&deg; E</div></div>
        <div><div class="k">SENSOR</div><div class="v">VIIRS &middot; 375 m</div></div>
        <div><div class="k">OBSERVED</div><div class="v">14:32 UTC</div></div>
      </div>
    </div>
  </div>
  <div class="container hero-content">""")

# remove the old card markup entirely
start = src.find('    <div class="hero-visual" aria-hidden="true">')
assert start != -1, "old hero-visual markup not found"
end_marker = '</div>\n  </div>\n</header>'
end = src.find('</header>', start)
assert end != -1
# find the closing of the card container: last </div> before </header>
seg = src[start:end]
# the card closes right before the container close; locate '</header>' and walk back
close_idx = src.rfind('</header>')
# remove everything from card start to the '</div>' that precedes '</header>'
prev_close = src.rfind('    </div>', start, close_idx)
assert prev_close != -1
src = src[:start] + src[prev_close:]
# ensure the container wrapper closes before </header>
src = src.replace("""  </div>
</header>""", """  </div>
</header>""", 1)

# ============ 3) JS: fade video in when playable; reduced-motion guard ============
old_script = "(function(){\n  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;"
assert old_script in src
src = src.replace(old_script, old_script + """

  /* hero video: fade in once it can actually play; poster shows until then */
  var hv = document.getElementById('hero-video');
  if (hv) {
    if (reduced) { hv.removeAttribute('autoplay'); }
    var showVid = function(){ hv.classList.add('ready'); };
    if (hv.readyState >= 2) showVid();
    else { hv.addEventListener('loadeddata', showVid); hv.addEventListener('error', function(){ hv.style.display = 'none'; }); }
  }""")

open('static/landing.html', 'w', encoding='utf-8').write(src)
print("hero media redesign applied")
