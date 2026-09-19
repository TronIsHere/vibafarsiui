import type { BackgroundDoc } from "./types";

const bg = (slug: string) => `registry/backgrounds/${slug}.tsx`;
const KF = {
  aurora: `@keyframes aurora {\n  0% { transform: translate(-10%, -10%) scale(1); }\n  50% { transform: translate(10%, 5%) scale(1.15); }\n  100% { transform: translate(-5%, 10%) scale(0.95); }\n}`,
  gridFlow: `@keyframes grid-flow {\n  from { background-position: 0 0; }\n  to { background-position: 0 48px; }\n}`,
  flicker: `@keyframes flicker {\n  0%, 100% { opacity: 0.15; }\n  50% { opacity: 0.9; }\n}`,
  mesh: `@keyframes mesh-drift {\n  0% { background-position: 0% 0%, 100% 0%, 50% 100%; }\n  50% { background-position: 30% 20%, 70% 40%, 20% 80%; }\n  100% { background-position: 0% 0%, 100% 0%, 50% 100%; }\n}`,
  spin: `@keyframes spin-slow { to { transform: rotate(360deg); } }`,
  leak: `@keyframes leak {\n  0% { transform: translateX(-30%) rotate(-12deg); opacity: 0.6; }\n  50% { transform: translateX(20%) rotate(-12deg); opacity: 1; }\n  100% { transform: translateX(-30%) rotate(-12deg); opacity: 0.6; }\n}`,
  twinkle: `@keyframes twinkle {\n  0%, 100% { opacity: 0.15; transform: scale(0.8); }\n  50% { opacity: 1; transform: scale(1.2); }\n}`,
  sonar: `@keyframes sonar {\n  from { transform: translate(-50%, -50%) scale(0.2); opacity: 0.6; }\n  to { transform: translate(-50%, -50%) scale(1); opacity: 0; }\n}`,
  dotPulse: `@keyframes dot-pulse {\n  0%, 100% { opacity: 0.12; transform: scale(0.7); }\n  50% { opacity: 0.6; transform: scale(1); }\n}`,
  ribbon: `@keyframes ribbon {\n  0% { transform: translateX(-10%) skewX(-18deg); }\n  50% { transform: translateX(10%) skewX(-18deg); }\n  100% { transform: translateX(-10%) skewX(-18deg); }\n}`,
  stripes: `@keyframes stripes {\n  from { background-position: 0 0; }\n  to { background-position: 56px 0; }\n}`,
};
const usage = (name: string, extra = "") => `import { ${name} } from "@/components/backgrounds/${name.replace("Background", "").replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "")}"\n\n<section className="relative overflow-hidden">\n  <${name}${extra} />\n  <div className="relative">…</div>\n</section>`;
const SHADER_RULES = [
  "Built on the ShaderCanvas primitive (shader.tsx): raw WebGL 1, a full-screen triangle, no library. The fragment shader is a template string in the same file.",
  "Free uniforms from the primitive: u_resolution, u_time, u_dpr, u_pointer, u_trail[8], and u_color0…u_color3 resolved from CSS variables (--brand, --foreground, …) so the theme drives the colors.",
  "Transparent canvas (premultipliedAlpha: false): output straight alpha in gl_FragColor so the layer sits on any surface. Keep alpha low; text goes on top.",
];
const shader = (opts: { opacity?: string; extraProps?: { name: string; type: string; default?: string; desc: string }[] } = {}) => ({
  engine: "webgl" as const,
  registryDeps: ["shader"],
  props: [
    ...(opts.extraProps ?? []),
    { name: "speed", type: "number", default: "1", desc: "ضریب سرعت زمان." },
    { name: "opacity", type: "number", default: opts.opacity ?? "0.5", desc: "بیشترین شفافیت لایه؛ کم نگهش دارید تا متن خوانا بماند." },
  ],
});

export const backgrounds: BackgroundDoc[] = [
  { slug: "grid", name: "شبکه", file: bg("grid"), desc: "خط‌های نازک که به پایین محو می‌شوند؛ مناسب هیرو و بخش‌های فنی.", usage: usage("GridBackground", " size={56}"), props: [{ name: "size", type: "number", default: "56", desc: "اندازه‌ی هر خانه به پیکسل." }], promptBullets: ["Two 1px linear-gradients at 6% foreground opacity; mask fades toward the bottom.", "aria-hidden and pointer-events-none; sit inside a relative parent."] },
  { slug: "dots", name: "نقطه‌ای", file: bg("dots"), desc: "نقطه‌های ریز با محو شدن به پایین.", usage: usage("DotsBackground"), props: [{ name: "size", type: "number", default: "22", desc: "فاصله‌ی نقطه‌ها." }], promptBullets: ["1px radial-gradient under 12% opacity so Persian text stays readable."] },
  { slug: "girih", name: "گره", file: bg("girih"), desc: "ستاره‌ی هشت‌پر تکرارشونده، از هندسه‌ی کاشی ایرانی.", usage: usage("GirihBackground"), props: [{ name: "size", type: "number", default: "56", desc: "اندازه‌ی کاشی." }], notes: ["همان هندسه‌ی لوگو: دو مربع با چرخش ۴۵ درجه یک شمسه می‌سازند."], promptBullets: ["SVG tile of two squares (one rotate 45) as a data URL in background-image; neutral stroke with opacity.", "Radial mask so the center is stronger and edges fade."] },
  { slug: "hatch", name: "هاشور", file: bg("hatch"), desc: "خط‌های مورب برای نوارهای فاصله و بخش‌های در دست ساخت.", usage: usage("HatchBackground"), promptBullets: ["repeating-linear-gradient at −45deg, 1px stroke, 9px gap."] },
  { slug: "aurora", name: "شفق", file: bg("aurora"), css: KF.aurora, desc: "لکه‌های نور آرام در حرکت.", usage: usage("AuroraBackground"), promptBullets: ["Three large circles with blur-3xl and low opacity that drift via keyframes; negative delay so they are not in sync.", "Container overflow-hidden."] },
  { slug: "spotlight", name: "نور موضعی", file: bg("spotlight"), desc: "نور با ماوس جابه‌جا می‌شود و شبکه‌ی زیر را نشان می‌دهد.", usage: usage("SpotlightBackground"), props: [{ name: "radius", type: "number", default: "220", desc: "شعاع نور به پیکسل." }], promptBullets: ["onMouseMove stores percent position in state; radial-gradient at that point.", "Grid layer with a radial mask-image at the same center so only the lit area shows."] },
  { slug: "grain", name: "دانه", file: bg("grain"), desc: "بافت فیلم روی پس‌زمینه‌ی تیره.", usage: usage("GrainBackground"), props: [{ name: "opacity", type: "number", default: "0.7", desc: "شدت دانه." }], promptBullets: ["SVG feTurbulence (fractalNoise) as a data URL; mix-blend-screen on dark backgrounds."] },
  { slug: "retro-grid", name: "شبکه‌ی پرسپکتیو", file: bg("retro-grid"), css: KF.gridFlow, desc: "زمین شبکه‌ای که به سمت شما می‌آید.", usage: usage("RetroGridBackground"), promptBullets: ["Grid with rotateX(58deg) and perspective; animate background-position vertically for motion.", "A gradient fades the grid into the background toward the horizon."] },
  { slug: "mesh", name: "مش", file: bg("mesh"), desc: "چند گرادیان شعاعی روی هم، ثابت و سبک.", usage: usage("MeshBackground"), promptBullets: ["Three radial-gradients at different points using foreground and brand at low opacity."] },
  { slug: "flicker", name: "چشمک‌زن", file: bg("flicker"), css: KF.flicker, desc: "سلول‌هایی که نامنظم روشن می‌شوند.", usage: usage("FlickerBackground", " cols={12} rows={6}"), props: [{ name: "cols / rows", type: "number", default: "12 / 6", desc: "ابعاد شبکه." }], promptBullets: ["CSS grid with 1px gap; each cell's animation-delay and duration are pseudo-random from its index.", "Radial mask so edges fade."] },
  { slug: "rings", name: "حلقه‌ها", file: bg("rings"), desc: "دایره‌های هم‌مرکز با محو تدریجی.", usage: usage("RingsBackground"), props: [{ name: "gap", type: "number", default: "22", desc: "فاصله‌ی حلقه‌ها." }], promptBullets: ["repeating-radial-gradient from the center with a 1px stroke; radial mask."] },
  { slug: "gradient-mesh", name: "مش متحرک", file: bg("gradient-mesh"), css: KF.mesh, desc: "سه گرادیان شعاعی از رنگ‌های تم که آرام جابه‌جا می‌شوند؛ بدون تصویر.", usage: usage("GradientMeshBackground"), promptBullets: ["Three radial-gradients of brand, primary, and foreground at low opacity; background-size larger than 100% and animate background-position.", "Slow motion (15–20s) with ease-in-out so it does not distract."] },
  { slug: "conic-spin", name: "گرادیان چرخان", file: bg("conic-spin"), css: KF.spin, desc: "گرادیان مخروطی تار که پشت محتوا آهسته می‌چرخد؛ برای هیرو وقتی پس‌زمینه باید کمی بدرخشد.", usage: usage("ConicSpinBackground", " duration={24}"), props: [{ name: "duration", type: "number", default: "24", desc: "ثانیه برای یک دور." }], promptBullets: ["A circle larger than the container (140%) with conic-gradient and blur-3xl that rotates; container overflow-hidden.", "Colors from brand and foreground at 20–35% opacity."] },
  { slug: "light-leak", name: "نشت نور", file: bg("light-leak"), css: KF.leak, desc: "یک نوار نور گرم و مورب که آرام عبور می‌کند، مثل نشت نور فیلم.", usage: usage("LightLeakBackground"), promptBullets: ["Vertical band with a horizontal brand gradient, −12deg rotation and blur-2xl; slow translateX back and forth.", "Opacity oscillates between 0.6 and 1 so it breathes."] },
  { slug: "stars", name: "ستاره‌ها", file: bg("stars"), css: KF.twinkle, desc: "نقطه‌های ریز که هر کدام با ریتم خودشان چشمک می‌زنند.", usage: usage("StarsBackground", " count={60}"), props: [{ name: "count", type: "number", default: "60", desc: "تعداد ستاره." }], promptBullets: ["Position, size, and delay of each star come from its index (no Math.random) so SSR and client match.", "Twinkle on opacity and scale; sizes 1–3px."] },
  { slug: "sonar", name: "پژواک", file: bg("sonar"), css: KF.sonar, desc: "حلقه‌هایی که از مرکز بزرگ می‌شوند و محو می‌شوند؛ برای «در حال جست‌وجو» و نقشه.", usage: usage("SonarBackground", " rings={4}"), props: [{ name: "rings / duration", type: "number", default: "4 / 6", desc: "تعداد حلقه و مدت هر دور." }], promptBullets: ["Concentric circles with equal delays (duration ÷ rings) that scale up and fade.", "Center dot in brand with a glow shadow."] },
  { slug: "dot-wave", name: "موج نقطه‌ای", file: bg("dot-wave"), css: KF.dotPulse, desc: "شبکه‌ی نقطه که روشنایی‌اش به‌صورت موج قطری می‌گذرد.", usage: usage("DotWaveBackground", " cols={16} rows={8}"), props: [{ name: "cols / rows", type: "number", default: "16 / 8", desc: "ابعاد شبکه." }], promptBullets: ["Each dot's delay = (row + col) × 0.12s, modulo the animation duration; that makes the diagonal wave.", "Radial mask so edges fade."] },
  { slug: "aurora-ribbons", name: "نوار شفق", file: bg("aurora-ribbons"), css: KF.ribbon, desc: "نوارهای گرادیان مایل که آرام تاب می‌خورند؛ شفق قطبی با رنگ‌های تم.", usage: usage("AuroraRibbonsBackground"), promptBullets: ["Three vertical bands with a vertical gradient (transparent → color → transparent), negative skewX, blur-3xl, and horizontal drift with different delays.", "Colors from brand, foreground, and primary."] },
  { slug: "gradient-grain", name: "گرادیان دانه‌دار", file: bg("gradient-grain"), desc: "گرادیان گرم برند با بافت دانه روی آن؛ ثابت و پوستری.", usage: usage("GradientGrainBackground"), promptBullets: ["Diagonal linear-gradient from brand at 45% opacity to transparent; SVG noise on top with mix-blend-soft-light.", "No animation; for sections that should feel heavy and still."] },
  { slug: "moving-stripes", name: "راه‌راه روان", file: bg("moving-stripes"), css: KF.stripes, desc: "هاشور موربی که به‌آرامی سُر می‌خورد؛ حرکت بدون شلوغی.", usage: usage("MovingStripesBackground"), promptBullets: ["Diagonal repeating-linear-gradient with a fixed background-size; animate background-position by that width so the loop is seamless.", "Mask fades from top to bottom."] },

  // ---- WebGL shaders. All of them import ShaderCanvas from shader.tsx. ----
  {
    slug: "shader", name: "بوم شیدر", engine: "webgl", file: bg("shader"),
    desc: "پایه‌ی همه‌ی شیدرها: WebGL خام، بدون کتابخانه. شیدر خودتان را بنویسید؛ رنگ‌ها از توکن‌های تم می‌آیند و با عوض شدن تم به‌روز می‌شوند.",
    usage: `import { ShaderCanvas, GLSL_NOISE } from "@/components/backgrounds/shader"

const frag = /* glsl */ \`
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float glow = smoothstep(0.7, 0.0, distance(uv, u_pointer));
  vec3 color = mix(u_color0, u_color1, uv.y);
  gl_FragColor = vec4(color, glow * 0.35);
}\`

<section className="relative overflow-hidden">
  <ShaderCanvas fragment={frag} colors={["--brand", "--foreground"]} pointer />
  <div className="relative">…</div>
</section>`,
    props: [
      { name: "fragment", type: "string", desc: "بدنه‌ی شیدر فرگمنت (GLSL ES 1.00) با یک main. هدر یونیفرم‌ها خودکار اضافه می‌شود." },
      { name: "colors", type: "string[]", default: '["--brand", "--foreground", "--background"]', desc: "متغیرهای CSS که به u_color0 تا u_color3 تبدیل می‌شوند." },
      { name: "uniforms", type: "Record<string, number | number[]>", desc: "یونیفرم‌های دلخواه؛ عدد float و آرایه vec2 تا vec4 می‌شود." },
      { name: "speed", type: "number", default: "1", desc: "ضریب u_time." },
      { name: "pointer", type: "boolean", default: "false", desc: "حرکت ماوس روی والد را به u_pointer و u_trail می‌فرستد." },
      { name: "dpr", type: "number", default: "min(devicePixelRatio, 1.5)", desc: "مقیاس رندر؛ کمتر یعنی سبک‌تر." },
    ],
    notes: [
      "یونیفرم‌های آماده: u_resolution، u_time، u_dpr، u_pointer، u_trail[8] و u_color0 تا u_color3. برای نویز و fbm، رشته‌ی GLSL_NOISE را به ابتدای شیدر اضافه کنید.",
      "بوم شفاف است؛ آلفای خروجی را کم نگه دارید. بیرون از دید، حلقه‌ی رندر می‌ایستد و کانتکست آزاد می‌شود؛ با prefers-reduced-motion فقط یک فریم کشیده می‌شود.",
      "Chrome بیش از ۱۶ کانتکست WebGL فعال را نگه نمی‌دارد؛ این کامپوننت با IntersectionObserver فقط برای بوم‌های در دید کانتکست می‌سازد.",
    ],
    promptBullets: [
      "Create a WebGL 1 context on a canvas (alpha, premultipliedAlpha false) and draw one full-screen triangle with the user's fragment shader; prepend a header that declares u_resolution, u_time, u_dpr, u_pointer, u_trail[8], u_color0…u_color3 and enables OES_standard_derivatives.",
      "Resolve each CSS variable in `colors` to sRGB by painting it on a 1×1 2D canvas and reading the pixel (works for oklch); re-resolve when a data-theme attribute changes anywhere (MutationObserver, subtree).",
      "ResizeObserver sizes the drawing buffer at devicePixelRatio capped at 1.5; IntersectionObserver starts the rAF loop when visible and calls WEBGL_lose_context.loseContext() when hidden or on unmount, restoring on re-entry.",
      "Under prefers-reduced-motion draw a single frame (u_time = 4) and redraw only on resize, theme, or pointer changes.",
      "Optional pointer mode listens to pointermove on the parent element and keeps a ring buffer of the last 8 positions with timestamps for trail effects.",
      "Export GLSL_NOISE (hash, value noise, 5-octave fbm) so other shaders can prepend it.",
    ],
  },
  { slug: "silk", name: "ابریشم", file: bg("silk"), ...shader({ opacity: "0.35", extraProps: [{ name: "scale", type: "number", default: "1.6", desc: "تراکم چین‌ها." }] }), desc: "موج‌های نرم و براق که مثل پارچه‌ی ساتن تاب می‌خورند.", usage: usage("SilkBackground"), promptBullets: [...SHADER_RULES, "Fold the UV with nested sines: shift q.y by sin(6q.x − t), then v = 0.5 + 0.5·sin(5·(q.x + q.y + cos(3q.x + 5q.y)) + sin(20·(q.x + q.y))); pow(v, 1.6) for sheen.", "Mix brand into foreground by v; alpha = v × opacity."] },
  { slug: "fog", name: "مه", file: bg("fog"), ...shader({ opacity: "0.35", extraProps: [{ name: "scale", type: "number", default: "2.2", desc: "درشتی توده‌های مه." }] }), desc: "مه آرام که با نویز چندلایه جابه‌جا می‌شود و به پایین محو است.", usage: usage("FogBackground"), promptBullets: [...SHADER_RULES, "fbm(p + drift + fbm(p·0.6 − t)·1.2) then smoothstep(0.35, 0.95) so only the dense parts show; foreground color only.", "Vertical smoothstep mask so the bottom stays clear for text."] },
  { slug: "nebula", name: "سحابی", file: bg("nebula"), ...shader({ opacity: "0.4", extraProps: [{ name: "scale", type: "number", default: "1.4", desc: "درشتی ابرها." }] }), desc: "نویز پیچ‌خورده در هم، شبیه ابرهای گاز؛ با رنگ برند و پیش‌زمینه.", usage: usage("NebulaBackground"), promptBullets: [...SHADER_RULES, "Domain warping: q = fbm(p), r = fbm(p + 4q), f = fbm(p + 3r); color from foreground toward brand by length(q) and r.x.", "Alpha = smoothstep(0.25, 0.85, f²·2.2) × opacity; time scaled by 0.06 so it barely moves."] },
  { slug: "contour", name: "خطوط تراز", file: bg("contour"), ...shader({ opacity: "0.45", extraProps: [{ name: "scale", type: "number", default: "1.2", desc: "درشتی پستی‌وبلندی." }, { name: "levels", type: "number", default: "14", desc: "تعداد خط تراز." }] }), desc: "خط‌های نقشه‌ی توپوگرافی که آهسته جابه‌جا می‌شوند؛ هر چهارمین خط پررنگ‌تر است.", usage: usage("ContourBackground"), promptBullets: [...SHADER_RULES, "h = fbm(p + drift) × levels; line where fract(h) ≈ 0.5 with fwidth(h) for a constant 1px width; every 4th level is brighter.", "Radial mask so the edges fade; foreground color only."] },
  { slug: "voronoi", name: "سلول‌ها", file: bg("voronoi"), ...shader({ opacity: "0.4", extraProps: [{ name: "scale", type: "number", default: "5", desc: "تعداد سلول در ارتفاع." }] }), desc: "سلول‌های ورونوی با مرزهای نازک که مرکزشان آرام می‌لغزد.", usage: usage("VoronoiBackground"), promptBullets: [...SHADER_RULES, "3×3 neighbor search; sites orbit their cell center with sin/cos of hashed phases; border = second-closest minus closest with fwidth anti-aliasing.", "A faint per-cell shade from hash(cell) plus a radial mask."] },
  { slug: "warp-grid", name: "شبکه‌ی موج‌دار", file: bg("warp-grid"), ...shader({ opacity: "0.35", extraProps: [{ name: "scale", type: "number", default: "10", desc: "تعداد خانه در ارتفاع." }, { name: "warp", type: "number", default: "0.25", desc: "شدت پیچ‌خوردگی." }] }), desc: "شبکه‌ای که با نویز پیچ می‌خورد، مثل کاغذ شطرنجی زیر آب.", usage: usage("WarpGridBackground"), promptBullets: [...SHADER_RULES, "Displace UV by (fbm, fbm) − 0.5 times warp, then draw grid lines with fwidth so they stay 1px after the distortion.", "Mask fades toward the bottom."] },
  { slug: "godrays", name: "پرتو نور", file: bg("godrays"), ...shader({ opacity: "0.45" }), desc: "پرتوهای نوری که از بالا می‌تابند و آرام تکان می‌خورند.", usage: usage("GodraysBackground"), promptBullets: [...SHADER_RULES, "Polar coordinates around a source above the top edge; rays = products of sines of the angle at two frequencies, modulated by noise; pow for contrast.", "Falloff by distance from the source; brand color."] },
  { slug: "water-ripple", name: "موج آب", file: bg("water-ripple"), ...shader({ opacity: "0.6" }), desc: "حلقه‌های آب که با حرکت ماوس پخش می‌شوند؛ بدون ماوس هم گاهی قطره‌ای می‌افتد.", usage: usage("WaterRippleBackground"), notes: ["والد باید رویداد ماوس بگیرد؛ خود بوم pointer-events ندارد تا مزاحم کلیک نشود."], promptBullets: [...SHADER_RULES, "pointer mode: each entry of u_trail is a drop; ring = sin((r − front)·80)·exp(−|r − front|·18) with front = age·0.35, decaying by exp(−age·1.6) and clipped to the front.", "Three automatic drops from hash(floor(time)) so the layer is alive without a pointer; a faint fbm caustic underneath."] },
  { slug: "dither", name: "دیترینگ", file: bg("dither"), ...shader({ extraProps: [{ name: "pixel", type: "number", default: "3", desc: "اندازه‌ی هر پیکسل دیتر به px." }] }), desc: "گرادیان متحرک با نقطه‌های Bayer، به سبک نمایشگرهای قدیمی؛ وسط خالی می‌ماند.", usage: usage("DitherBackground"), promptBullets: [...SHADER_RULES, "Quantize gl_FragCoord to pixel × dpr blocks; value = fbm of the block position × a radial vignette (clear center); on = step(bayer4(block), value) with the compact Bayer formula bayer2(a) = fract(a.x/2 + a.y²·0.75).", "One bit output in the foreground color; no smoothing."] },
  { slug: "halftone", name: "ترام", file: bg("halftone"), ...shader({ opacity: "0.45", extraProps: [{ name: "cell", type: "number", default: "10", desc: "فاصله‌ی نقطه‌ها به px." }] }), desc: "نقطه‌های ترام چاپ که اندازه‌شان با یک موج نرم عوض می‌شود.", usage: usage("HalftoneBackground"), promptBullets: [...SHADER_RULES, "Rotate pixel coordinates ~30°, split into cells of cell × dpr px, and size each dot by fbm sampled at the cell center; smoothstep the circle edge by 1px.", "Radial mask; foreground color."] },
  { slug: "waves", name: "امواج", file: bg("waves"), ...shader({ opacity: "0.55", extraProps: [{ name: "lines", type: "number", default: "12", desc: "تعداد خط (تا ۱۶)." }] }), desc: "خط‌های سینوسی روی هم که مثل رشته‌های نور موج می‌زنند.", usage: usage("WavesBackground"), promptBullets: [...SHADER_RULES, "Up to 16 lines in a constant loop; each y = base + two sines + a little noise; 1px width from 1/u_resolution.y; brightness travels along x with a third sine.", "Horizontal mask so the lines fade at both ends."] },
];
