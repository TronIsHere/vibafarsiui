"use client";

import * as React from "react";
import { cn, en, fa } from "@/lib/utils";
import { EMPTY_PLATE, PLATE_LETTERS, isPlate, parsePlate, plateLetterFromKey, stringifyPlate, type PlateValue } from "@/lib/persian";

export interface PlateInputProps {
  value?: PlateValue;
  defaultValue?: PlateValue;
  onChange?: (value: PlateValue, complete: boolean) => void;
  /** Limit the picker, e.g. ["ت"] on a taxi form or the private letters only. */
  letters?: string[];
  /** Adds a hidden input carrying «12ب345-11» for plain HTML forms. */
  name?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

type Segment = "left" | "middle" | "region";
const LENGTH: Record<Segment, number> = { left: 2, middle: 3, region: 2 };
const COLS = 7;

/** Typing into a box that is already full starts it over with the new digit, wherever the caret was. */
function typedInto(old: string, next: string, max: number) {
  if (next.length <= max || old.length < max) return next.slice(0, max);
  let i = 0;
  while (i < old.length && old[i] === next[i]) i++;
  return next.slice(i, i + next.length - old.length).slice(0, max);
}

/**
 * پلاک خودرو. The plate itself is LTR like the metal one (۱۲ ب ۳۴۵ | ایران ۱۱),
 * the letter box opens an RTL picker with every legal letter and what it
 * means, and typing flows through the four boxes as if it were one field.
 * Persian or Latin digits, Arabic ي/ك, and «ا» for «الف» are all accepted.
 */
export function PlateInput({ value, defaultValue = EMPTY_PLATE, onChange, letters, name, disabled, className, id }: PlateInputProps) {
  const [internal, setInternal] = React.useState<PlateValue>(defaultValue);
  const v = value ?? internal;
  const options = React.useMemo(() => (letters ? PLATE_LETTERS.filter((l) => letters.includes(l.letter)) : PLATE_LETTERS), [letters]);
  const allowed = React.useMemo(() => new Set(options.map((l) => l.letter)), [options]);

  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const root = React.useRef<HTMLDivElement>(null);
  const refs = React.useRef<Record<Segment | "letter", HTMLInputElement | HTMLButtonElement | null>>({ left: null, letter: null, middle: null, region: null });
  const optionRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const listId = React.useId();

  function commit(next: PlateValue) {
    if (value === undefined) setInternal(next);
    onChange?.(next, isPlate(next));
  }
  const focus = (k: Segment | "letter") => refs.current[k]?.focus();

  function chooseLetter(letter: string) {
    commit({ ...v, letter });
    setOpen(false);
    focus("middle");
  }

  function openList() {
    setActive(Math.max(0, options.findIndex((l) => l.letter === v.letter)));
    setHovered(null);
    setOpen(true);
  }

  /* ----- digit boxes ----- */
  function onDigits(key: Segment, raw: string, next: Segment | "letter" | null) {
    const text = en(raw);
    // A whole plate pasted into the first box fills all four.
    if (key === "left" && /[^\d]/.test(text)) {
      const p = parsePlate(text);
      if (p.letter || p.middle) {
        commit(p);
        focus(p.region.length === 2 ? "region" : p.middle.length === 3 ? "region" : p.letter ? "middle" : "letter");
        return;
      }
    }
    const d = typedInto(v[key], text.replace(/\D/g, ""), LENGTH[key]);
    commit({ ...v, [key]: d });
    if (d.length === LENGTH[key] && next) focus(next);
  }

  function onDigitsKey(e: React.KeyboardEvent<HTMLInputElement>, key: Segment, prev: Segment | "letter" | null) {
    if (e.key === "Backspace" && !v[key] && prev) {
      e.preventDefault();
      focus(prev);
    }
  }

  /* ----- letter box ----- */
  function onLetterKey(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (v.letter) commit({ ...v, letter: "" });
      else focus("left");
      return;
    }
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openList();
      return;
    }
    if (e.key.length === 1) {
      const letter = plateLetterFromKey(e.key);
      if (letter && allowed.has(letter)) {
        e.preventDefault();
        chooseLetter(letter);
      }
    }
  }

  /* ----- listbox ----- */
  function onListKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const n = options.length;
    const move = (i: number) => {
      e.preventDefault();
      setActive(((i % n) + n) % n);
    };
    switch (e.key) {
      // The picker is RTL: «left» is the next letter, «right» the previous one.
      case "ArrowLeft": return move(active + 1);
      case "ArrowRight": return move(active - 1);
      case "ArrowDown": return move(active + COLS);
      case "ArrowUp": return move(active - COLS);
      case "Home": return move(0);
      case "End": return move(n - 1);
      case "Enter":
      case " ":
        e.preventDefault();
        return chooseLetter(options[active].letter);
      case "Escape":
        e.preventDefault();
        setOpen(false);
        return focus("letter");
      case "Tab":
        return setOpen(false);
      default: {
        const letter = e.key.length === 1 ? plateLetterFromKey(e.key) : null;
        if (letter && allowed.has(letter)) {
          e.preventDefault();
          chooseLetter(letter);
        }
      }
    }
  }

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  React.useEffect(() => {
    if (open) optionRefs.current[active]?.focus();
  }, [open, active]);

  const digitBox = "h-full min-w-0 bg-transparent text-center text-lg font-bold tabular-nums text-foreground outline-none placeholder:text-muted-foreground/40 disabled:cursor-not-allowed";
  const complete = isPlate(v);
  const described = (hovered ?? options[active]?.letter) || v.letter;
  const describedLabel = options.find((l) => l.letter === described)?.label;

  return (
    <div ref={root} className={cn("relative inline-block", className)}>
      <div
        role="group"
        aria-label="پلاک خودرو"
        dir="ltr"
        className={cn(
          "flex h-12 items-stretch overflow-hidden rounded-lg border border-input bg-background/60 transition-colors focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring/60",
          disabled && "opacity-50",
        )}
      >
        <div aria-hidden className="flex w-7 shrink-0 flex-col items-center justify-center gap-0.5 bg-foreground text-background">
          <span className="text-[7px] font-bold leading-none">I.R.</span>
          <span className="text-[7px] font-bold leading-none">IRAN</span>
        </div>

        <input
          ref={(el) => { refs.current.left = el; }}
          id={id}
          aria-label="دو رقم اول"
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          value={fa(v.left)}
          placeholder="۱۲"
          onChange={(e) => onDigits("left", e.target.value, "letter")}
          onKeyDown={(e) => onDigitsKey(e, "left", null)}
          onFocus={(e) => e.target.select()}
          className={cn(digitBox, "w-10")}
        />

        <button
          ref={(el) => { refs.current.letter = el; }}
          type="button"
          aria-label={v.letter ? `حرف پلاک: ${v.letter}` : "حرف پلاک"}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={onLetterKey}
          className={cn(
            "flex min-w-10 shrink-0 cursor-pointer items-center justify-center px-1 text-lg font-bold transition-colors hover:bg-accent focus:bg-accent focus:outline-none disabled:cursor-not-allowed",
            !v.letter && "text-muted-foreground/40",
            open && "bg-accent",
          )}
        >
          {v.letter || "ب"}
        </button>

        <input
          ref={(el) => { refs.current.middle = el; }}
          aria-label="سه رقم"
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          value={fa(v.middle)}
          placeholder="۳۴۵"
          onChange={(e) => onDigits("middle", e.target.value, "region")}
          onKeyDown={(e) => onDigitsKey(e, "middle", "letter")}
          onFocus={(e) => e.target.select()}
          className={cn(digitBox, "w-14")}
        />

        <div className="flex w-11 shrink-0 flex-col items-center border-s border-input">
          <span aria-hidden className="pt-0.5 text-[9px] leading-none text-muted-foreground">ایران</span>
          <input
            ref={(el) => { refs.current.region = el; }}
            aria-label="کد شهر"
            inputMode="numeric"
            autoComplete="off"
            disabled={disabled}
            value={fa(v.region)}
            placeholder="۱۱"
            onChange={(e) => onDigits("region", e.target.value, null)}
            onKeyDown={(e) => onDigitsKey(e, "region", "middle")}
            onFocus={(e) => e.target.select()}
            className={cn(digitBox, "w-full flex-1 text-base")}
          />
        </div>
      </div>

      {name && <input type="hidden" name={name} value={complete ? stringifyPlate(v) : ""} />}

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label="حرف پلاک"
          dir="rtl"
          onKeyDown={onListKey}
          onMouseLeave={() => setHovered(null)}
          className="absolute start-0 top-full z-40 mt-2 w-[252px] rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-[0_20px_50px_-20px_oklch(0_0_0/80%)] animate-fade-up [animation-duration:180ms]"
        >
          <div className="grid grid-cols-7 gap-1">
            {options.map((l, i) => {
              const selected = l.letter === v.letter;
              return (
                <button
                  key={l.letter}
                  ref={(el) => { optionRefs.current[i] = el; }}
                  id={`${listId}-${i}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  aria-label={`${l.letter}، ${l.label}`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => chooseLetter(l.letter)}
                  onMouseEnter={() => setHovered(l.letter)}
                  onFocus={() => setActive(i)}
                  className={cn(
                    "flex h-8 cursor-pointer items-center justify-center rounded-md text-sm font-semibold transition-colors focus:outline-none",
                    selected ? "bg-primary text-primary-foreground" : "hover:bg-accent focus:bg-accent",
                    l.label !== "شخصی" && !selected && "text-muted-foreground",
                  )}
                >
                  {l.letter}
                </button>
              );
            })}
          </div>
          <p className="mt-2 border-t border-border pt-1.5 text-[11px] text-muted-foreground" aria-hidden>
            {describedLabel ? <>{described}<span className="mx-1">·</span>{describedLabel}</> : "حرف پلاک را انتخاب کنید"}
          </p>
        </div>
      )}
    </div>
  );
}
