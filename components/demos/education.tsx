"use client";

import * as React from "react";
import { VideoPlayer, type VideoChapter } from "@/registry/ui/video-player";
import { CourseOutline, type OutlineSection } from "@/registry/ui/course-outline";
import { Callout, Formula, KeyTerms, LessonNote } from "@/registry/ui/lesson-note";
import { FunctionPlot, faDecimal, type PlotParam } from "@/registry/ui/function-plot";
import { HotspotFigure, type Hotspot } from "@/registry/ui/hotspot-figure";
import { Quiz, type QuizQuestion } from "@/registry/ui/quiz";

/* One lesson, told through every element: «تابع سینوسی و دایره‌ی مثلثاتی». */

const LESSON_VIDEO = "/demos/sine-lesson.webm";
const LESSON_POSTER = "/demos/sine-lesson.webp";

const chapters: VideoChapter[] = [
  { start: 0, title: "مقدمه" },
  { start: 10, title: "دایره‌ی مثلثاتی" },
  { start: 24, title: "رسم نمودار سینوس" },
  { start: 38, title: "دامنه و دوره" },
];

const sections: OutlineSection[] = [
  {
    id: "s1",
    title: "زاویه و اندازه‌گیری آن",
    lessons: [
      { id: "l1", title: "درجه و رادیان", kind: "video", minutes: 12, done: true, preview: true },
      { id: "l2", title: "تبدیل درجه به رادیان", kind: "reading", minutes: 8, done: true },
      { id: "l3", title: "آزمونک زاویه‌ها", kind: "quiz", minutes: 5, done: true },
    ],
  },
  {
    id: "s2",
    title: "دایره‌ی مثلثاتی",
    lessons: [
      { id: "l4", title: "مختصات نقطه روی دایره", kind: "video", minutes: 14, done: true },
      { id: "l5", title: "تابع سینوسی و دایره‌ی مثلثاتی", kind: "video", minutes: 18 },
      { id: "l6", title: "درس‌نامه: علامت نسبت‌ها در ربع‌ها", kind: "reading", minutes: 7 },
      { id: "l7", title: "تمرین: رسم نمودار با دست", kind: "assignment", minutes: 20 },
    ],
  },
  {
    id: "s3",
    title: "نمودار توابع مثلثاتی",
    lessons: [
      { id: "l8", title: "دامنه، دوره و انتقال", kind: "video", minutes: 22, locked: true },
      { id: "l9", title: "آزمون پایانی فصل", kind: "quiz", minutes: 15, locked: true },
    ],
  },
];

const sineParams: PlotParam[] = [
  { key: "a", label: "دامنه (a)", min: 0.5, max: 2.5, step: 0.1, default: 1 },
  { key: "b", label: "بسامد (b)", min: 0.5, max: 3, step: 0.1, default: 1 },
];
const sine = (x: number, p: Record<string, number>) => p.a * Math.sin(p.b * x);
const sineFormula = (p: Record<string, number>) => `y = ${faDecimal(p.a, 1)} · sin(${faDecimal(p.b, 1)}x)`;

const unitCircleSpots: Hotspot[] = [
  { id: "o", x: 50, y: 50, title: "مبدأ مختصات (O)", desc: "مرکز دایره‌ی مثلثاتی؛ شعاع دایره از اینجا یک واحد است." },
  { id: "start", x: 75, y: 50, title: "نقطه‌ی شروع (۱، ۰)", desc: "هر زاویه از جهت مثبت محور xها و از همین نقطه اندازه گرفته می‌شود." },
  { id: "theta", x: 58, y: 44, title: "زاویه‌ی θ", desc: "در جهت خلاف حرکت عقربه‌های ساعت مثبت است، حتی در کتاب فارسی." },
  { id: "p", x: 66, y: 19, title: "نقطه‌ی P", desc: <>انتهای کمان روبه‌روی θ. مختصاتش <bdi dir="ltr" className="whitespace-nowrap">(cos θ, sin θ)</bdi> است.</> },
  { id: "sin", x: 71, y: 35, title: "سینوس θ", desc: "عرض نقطه‌ی P؛ فاصله‌ی عمودی P تا محور xها." },
  { id: "cos", x: 58, y: 57, title: "کسینوس θ", desc: "طول نقطه‌ی P؛ سایه‌ی P روی محور xها." },
];

function UnitCircleSvg() {
  // θ = 50°, r = 100 on a 400×250 canvas centred at (200, 125).
  const px = 264.3, py = 48.4;
  return (
    <svg viewBox="0 0 400 250" aria-hidden className="bg-card">
      <g stroke="var(--border)">
        {Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={i * 40} x2={i * 40} y1={0} y2={250} />)}
        {Array.from({ length: 7 }, (_, i) => <line key={`h${i}`} x1={0} x2={400} y1={i * 40 + 5} y2={i * 40 + 5} />)}
      </g>
      <g stroke="var(--muted-foreground)" strokeWidth={1.25}>
        <line x1={60} x2={340} y1={125} y2={125} />
        <line x1={200} x2={200} y1={10} y2={240} />
      </g>
      <circle cx={200} cy={125} r={100} fill="none" stroke="var(--foreground)" strokeOpacity={0.7} strokeWidth={2} />
      <path d="M 236 125 A 36 36 0 0 0 223.1 97.4" fill="none" stroke="var(--brand)" strokeWidth={2} />
      <line x1={200} y1={125} x2={px} y2={125} stroke="var(--foreground)" strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" />
      <line x1={px} y1={125} x2={px} y2={py} stroke="var(--brand)" strokeWidth={4} strokeLinecap="round" />
      <line x1={200} y1={125} x2={px} y2={py} stroke="var(--foreground)" strokeWidth={2} />
      <circle cx={200} cy={125} r={3.5} fill="var(--foreground)" />
      <circle cx={300} cy={125} r={3.5} fill="var(--foreground)" />
      <circle cx={px} cy={py} r={6} fill="var(--brand)" />
    </svg>
  );
}

const questions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "سینوس زاویه‌ی ۹۰ درجه چند است؟",
    options: [
      { id: "a", label: "صفر" },
      { id: "b", label: "۱" },
      { id: "c", label: "۰٫۵" },
      { id: "d", label: "تعریف نشده" },
    ],
    answer: "b",
    explanation: "در ۹۰ درجه نقطه‌ی P بالای دایره است و عرضش برابر شعاع، یعنی ۱ می‌شود.",
  },
  {
    id: "q2",
    prompt: (
      <>
        در نمودار <bdi dir="ltr">y = a·sin(bx)</bdi> اگر a را دو برابر کنیم چه تغییری رخ می‌دهد؟
      </>
    ),
    options: [
      { id: "a", label: "ارتفاع موج دو برابر می‌شود" },
      { id: "b", label: "دوره‌ی تناوب دو برابر می‌شود" },
      { id: "c", label: "نمودار به سمت راست منتقل می‌شود" },
      { id: "d", label: "تغییری نمی‌کند" },
    ],
    answer: "a",
    explanation: "a فقط مقدار بیشینه و کمینه را عوض می‌کند؛ دوره‌ی تناوب به b بستگی دارد.",
  },
  {
    id: "q3",
    prompt: "سینوس کدام زاویه‌ها مثبت است؟",
    options: [
      { id: "a", label: "۳۰ درجه" },
      { id: "b", label: "۱۵۰ درجه" },
      { id: "c", label: "۲۱۰ درجه" },
      { id: "d", label: "۳۳۰ درجه" },
    ],
    answer: ["a", "b"],
    explanation: "سینوس در ربع اول و دوم (بالای محور xها) مثبت است.",
  },
];

function LessonNoteDemo() {
  return (
    <LessonNote
      className="w-full max-w-2xl"
      eyebrow="فصل ۲ · درس ۳"
      title="دایره‌ی مثلثاتی و تابع سینوس"
      minutes={7}
      objectives={["سینوس هر زاویه را روی دایره‌ی مثلثاتی پیدا کنید", "توضیح دهید چرا سینوس همیشه بین منفی ۱ و ۱ است"]}
    >
      <p>
        دایره‌ای به مرکز مبدأ مختصات و شعاع ۱ را <strong>دایره‌ی مثلثاتی</strong> می‌گویند. اگر نقطه‌ی P به اندازه‌ی زاویه‌ی θ از جهت مثبت محور xها بچرخد، عرض آن برابر سینوس θ است.
      </p>
      <Formula caption="رابطه‌ی ۲-۳">sin θ = y(P)   ,   −۱ ≤ sin θ ≤ ۱</Formula>
      <Callout kind="example">
        سینوس ۳۰ درجه برابر ۰٫۵ است؛ یعنی نقطه‌ی P دقیقاً در نیمه‌ی ارتفاع دایره قرار می‌گیرد. پس <Formula inline>sin ۳۰° = ۰٫۵</Formula>.
      </Callout>
      <Callout kind="warning">
        زاویه‌ها در جهت خلاف حرکت عقربه‌های ساعت مثبت‌اند. راست‌به‌چپ بودن متن فارسی جهت محورها و زاویه را عوض نمی‌کند.
      </Callout>
      <KeyTerms
        terms={[
          { term: "دایره‌ی مثلثاتی", en: "unit circle", desc: "دایره‌ای به شعاع ۱ که مرکزش مبدأ مختصات است." },
          { term: "رادیان", en: "radian", desc: "زاویه‌ای که کمانی به طول شعاع روبه‌رویش باشد؛ هر ۱۸۰ درجه برابر π رادیان است." },
          { term: "دوره‌ی تناوب", en: "period", desc: "کوتاه‌ترین فاصله‌ای که نمودار بعد از آن خودش را تکرار می‌کند." },
        ]}
      />
      <Callout kind="summary">سینوس یعنی عرض نقطه روی دایره‌ی مثلثاتی؛ به همین دلیل مقدارش هرگز از ۱ بیشتر یا از منفی ۱ کمتر نمی‌شود.</Callout>
    </LessonNote>
  );
}

function CourseOutlineDemo({ compact }: { compact?: boolean }) {
  const [current, setCurrent] = React.useState("l5");
  return (
    <CourseOutline
      className={compact ? "w-full" : "w-full max-w-xl"}
      sections={compact ? sections.slice(1, 2) : sections}
      currentId={current}
      showSummary={!compact}
      onSelect={(l) => setCurrent(l.id)}
    />
  );
}

export const educationDemos: Record<string, React.ReactNode> = {
  "video-player": (
    <VideoPlayer
      className="w-full max-w-2xl"
      src={LESSON_VIDEO}
      poster={LESSON_POSTER}
      title="درس ۳: تابع سینوسی و دایره‌ی مثلثاتی"
      chapters={chapters}
    />
  ),
  "course-outline": <CourseOutlineDemo />,
  "lesson-note": <LessonNoteDemo />,
  "function-plot": (
    <FunctionPlot
      className="w-full max-w-2xl"
      label="نمودار y = a·sin(bx)"
      xDomain={[-6.3, 6.3]}
      yDomain={[-3, 3]}
      params={sineParams}
      fn={sine}
      formula={sineFormula}
    />
  ),
  "hotspot-figure": (
    <HotspotFigure className="w-full max-w-2xl" ratio="8 / 5" hotspots={unitCircleSpots} caption="شکل ۲-۱: دایره‌ی مثلثاتی و نسبت‌های زاویه‌ی θ">
      <UnitCircleSvg />
    </HotspotFigure>
  ),
  quiz: <Quiz className="w-full max-w-xl" title="آزمونک درس ۳" questions={questions} passPercent={60} />,
};

export const educationCardDemos: Record<string, React.ReactNode> = {
  "video-player": (
    <VideoPlayer className="w-full" src={LESSON_VIDEO} poster={LESSON_POSTER} title="تابع سینوسی و دایره‌ی مثلثاتی" chapters={chapters} showChapters={false} />
  ),
  "course-outline": <CourseOutlineDemo compact />,
  "lesson-note": (
    <div className="w-full space-y-3">
      <Callout kind="tip">سینوس یعنی عرض نقطه روی دایره‌ی مثلثاتی.</Callout>
      <Formula>sin θ = y(P)</Formula>
    </div>
  ),
  "function-plot": (
    <FunctionPlot className="w-full" label="نمودار y = a·sin(x)" xDomain={[-6.3, 6.3]} yDomain={[-3, 3]} params={sineParams.slice(0, 1)} fn={(x, p) => p.a * Math.sin(x)} formula={(p) => `y = ${faDecimal(p.a, 1)} · sin(x)`} />
  ),
  "hotspot-figure": (
    <HotspotFigure className="w-full" ratio="8 / 5" hotspots={unitCircleSpots.filter((h) => h.id !== "start" && h.id !== "o")} showLegend={false}>
      <UnitCircleSvg />
    </HotspotFigure>
  ),
  quiz: <Quiz className="w-full" title="آزمونک" questions={questions.slice(0, 1)} />,
};
