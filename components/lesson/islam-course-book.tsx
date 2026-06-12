"use client"

import { useState, useCallback } from "react"
import { islamCourse } from "./course-data"

type Phase = "closed" | "opening" | "book" | "immersed" | "completed"

const TINT = "150" // emerald hue
const cover = `oklch(0.42 0.09 ${TINT})`
const coverDark = `oklch(0.32 0.08 ${TINT})`
const gold = "oklch(0.78 0.13 85)"
const paper = "oklch(0.96 0.015 85)"
const paperEdge = "oklch(0.86 0.025 85)"
const ink = "oklch(0.28 0.03 60)"

const TOTAL = islamCourse.lessons.length

export function IslamCourseBook() {
  const [phase, setPhase] = useState<Phase>("closed")
  // how many lessons fully completed (0..3)
  const [completed, setCompleted] = useState(0)
  // which lesson is currently open in immersive mode
  const [activeIdx, setActiveIdx] = useState(0)
  const [turning, setTurning] = useState(false)

  const progress = Math.round((completed / TOTAL) * 100)

  const startCourse = useCallback(() => {
    setPhase("opening")
    window.setTimeout(() => setPhase("book"), 900)
  }, [])

  const openLesson = useCallback(
    (idx: number) => {
      if (idx > completed) return // locked
      setActiveIdx(idx)
      setPhase("immersed")
    },
    [completed],
  )

  const finishLesson = useCallback(() => {
    // mark complete if this was the frontier lesson
    const newCompleted = activeIdx === completed ? completed + 1 : completed
    // animate a page turn back in the book
    setPhase("book")
    setTurning(true)
    window.setTimeout(() => {
      setCompleted(newCompleted)
      setTurning(false)
      if (newCompleted >= TOTAL) {
        window.setTimeout(() => setPhase("completed"), 500)
      }
    }, 650)
  }, [activeIdx, completed])

  const reset = useCallback(() => {
    setPhase("closed")
    setCompleted(0)
    setActiveIdx(0)
    setTurning(false)
  }, [])

  // ============ IMMERSIVE READING (inside the page) ============
  if (phase === "immersed") {
    const lesson = islamCourse.lessons[activeIdx]
    return (
      <div className="immerse-in mx-auto w-full max-w-2xl">
        <article
          className="relative overflow-hidden rounded-2xl p-7 shadow-2xl sm:p-10"
          style={{
            background: `linear-gradient(160deg, ${paper}, oklch(0.93 0.02 85))`,
            color: ink,
            boxShadow: "0 30px 60px -20px rgba(0,0,0,0.45), inset 0 0 60px rgba(120,90,40,0.06)",
          }}
        >
          {/* decorative top rule */}
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px flex-1" style={{ background: gold }} />
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
              style={{ background: cover, color: paper }}
            >
              {lesson.era} · Ders {lesson.id}
            </span>
            <span className="h-px flex-1" style={{ background: gold }} />
          </div>

          <h2
            className="text-rise text-balance text-center font-serif text-4xl font-bold sm:text-5xl"
            style={{ animationDelay: "0.05s", color: cover }}
          >
            {lesson.title}
          </h2>
          <p
            className="text-rise mt-1 text-center text-sm italic"
            style={{ animationDelay: "0.12s", color: "oklch(0.5 0.03 60)" }}
          >
            {lesson.subtitle}
          </p>

          <div className="mt-7 space-y-4">
            {lesson.body.map((para, i) => (
              <p
                key={i}
                className="text-rise text-pretty text-lg leading-relaxed"
                style={{ animationDelay: `${0.2 + i * 0.12}s` }}
              >
                {i === 0 ? (
                  <span
                    className="float-left mr-2 font-serif text-6xl font-bold leading-none"
                    style={{ color: gold, marginTop: 2 }}
                  >
                    {para.charAt(0)}
                  </span>
                ) : null}
                {i === 0 ? para.slice(1) : para}
              </p>
            ))}
          </div>

          {/* key term card */}
          <div
            className="text-rise mt-7 rounded-xl border-l-4 p-4"
            style={{ animationDelay: "0.7s", background: "oklch(0.92 0.03 85)", borderColor: gold }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.5 0.05 85)" }}>
              Anahtar Kavram
            </p>
            <p className="mt-1 font-serif text-xl font-bold" style={{ color: cover }}>
              {lesson.keyTerm.term}
            </p>
            <p className="text-sm" style={{ color: ink }}>
              {lesson.keyTerm.meaning}
            </p>
          </div>

          <button
            type="button"
            onClick={finishLesson}
            className="text-rise mt-8 w-full rounded-xl py-3.5 text-base font-bold shadow-lg transition active:scale-[0.98]"
            style={{ animationDelay: "0.85s", background: cover, color: paper }}
          >
            {activeIdx === completed ? "Dersi Tamamla ve Sayfayı Çevir" : "Kitaba Dön"}
          </button>
        </article>
      </div>
    )
  }

  // ============ COMPLETED ============
  if (phase === "completed") {
    return (
      <div className="immerse-in mx-auto flex max-w-md flex-col items-center gap-5 text-center">
        <div
          className="relative flex h-40 w-40 items-center justify-center rounded-full"
          style={{ background: cover, boxShadow: `0 0 0 10px oklch(0.42 0.09 ${TINT} / 0.15)` }}
        >
          <BadgeSeal />
        </div>
        <h2 className="font-serif text-3xl font-bold text-foreground">Tebrikler!</h2>
        <p className="text-pretty text-muted-foreground">
          {islamCourse.title} kursunun ilk bölümünü tamamladın. Cahiliye Dönemi&apos;nden Hicret&apos;e kadar 3 dersi
          okudun.
        </p>
        <div className="flex items-center gap-2">
          {islamCourse.lessons.map((l) => (
            <span
              key={l.id}
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: cover, color: paper }}
            >
              {l.id}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={reset}
          className="mt-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground"
        >
          Baştan Başla
        </button>
      </div>
    )
  }

  // ============ CLOSED / OPENING / BOOK (the 3D book) ============
  const isClosed = phase === "closed" || phase === "opening"

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="scene-3d select-none" style={{ height: 340 }}>
        <div
          className="preserve-3d relative"
          style={{
            width: 260,
            height: 340,
            transform: isClosed ? "rotateY(-22deg) rotateX(6deg)" : "rotateX(28deg) rotateY(0deg)",
            transition: "transform 0.9s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* ===== Thick page block (the body of the book) ===== */}
          <PageBlock isClosed={isClosed} />

          {/* ===== Open-book pages (only when reading) ===== */}
          {!isClosed && (
            <BookSpread
              completed={completed}
              turning={turning}
              onOpenLesson={openLesson}
            />
          )}

          {/* ===== Front cover (closes the book; swings open) ===== */}
          <div
            className={`absolute left-0 top-0 origin-left overflow-hidden rounded-r-lg ${
              phase === "opening" ? "cover-open" : ""
            }`}
            style={{
              width: 260,
              height: 340,
              transform: phase === "book" ? "rotateY(-155deg)" : "rotateY(0deg)",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              transition: phase === "book" ? "none" : undefined,
              zIndex: 40,
              backgroundImage: "url(/islamic-cover.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "inset 0 0 80px rgba(0,0,0,0.4)",
              display: phase === "book" ? "none" : "block",
            }}
          >
            {/* cover overlay text */}
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <div className="mb-2 h-12 w-12 rounded-full border-2" style={{ borderColor: gold }}>
                <div className="flex h-full w-full items-center justify-center">
                  <CrescentMark />
                </div>
              </div>
              <h2 className="font-serif text-2xl font-bold" style={{ color: gold }}>
                {islamCourse.title}
              </h2>
              <p className="text-sm" style={{ color: "oklch(0.85 0.04 85)" }}>
                {islamCourse.subtitle}
              </p>
              <span className="mt-2 h-px w-16" style={{ background: gold }} />
            </div>
            {/* spine shading on the cover's left edge */}
            <div
              className="absolute left-0 top-0 h-full w-3"
              style={{ background: `linear-gradient(90deg, rgba(0,0,0,0.45), transparent)` }}
            />
          </div>
        </div>
      </div>

      {/* meta + controls */}
      <div className="w-72 text-center">
        {isClosed ? (
          <>
            <p className="text-sm text-muted-foreground">
              3 derslik kurs · Kapağı aç ve okumaya başla
            </p>
            <button
              type="button"
              onClick={startCourse}
              disabled={phase === "opening"}
              className="mt-3 w-full rounded-xl py-3 text-base font-bold text-primary-foreground shadow-lg transition active:scale-[0.98] disabled:opacity-60"
              style={{ background: cover }}
            >
              {phase === "opening" ? "Açılıyor..." : "Kursa Başla"}
            </button>
          </>
        ) : (
          <>
            <p className="font-serif text-lg font-bold text-foreground">{islamCourse.title}</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: cover }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {completed} / {TOTAL} ders tamamlandı · %{progress}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {completed >= TOTAL ? "Tüm dersler bitti" : "Sıradaki dersin sayfasına dokun"}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

/* ---------- thick stacked page block ---------- */
function PageBlock({ isClosed }: { isClosed: boolean }) {
  // many layers => visibly thick book
  const LAYERS = 22
  return (
    <div
      className="preserve-3d absolute left-0 top-0"
      style={{ width: 260, height: 340 }}
    >
      {/* back cover */}
      <div
        className="absolute rounded-lg"
        style={{
          inset: 0,
          background: coverDark,
          transform: `translateZ(${-(LAYERS + 2) * 2.2}px)`,
        }}
      />
      {/* page edges (thickness) */}
      {Array.from({ length: LAYERS }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-r-md"
          style={{
            inset: 0,
            left: 4,
            background: i % 2 === 0 ? paper : paperEdge,
            transform: `translateZ(${-(i + 1) * 2.2}px)`,
            boxShadow: i === 0 ? "inset 0 0 30px rgba(120,90,40,0.08)" : undefined,
          }}
        />
      ))}
      {/* fore-edge highlight when closed */}
      {isClosed && (
        <div
          className="absolute right-0 top-1 rounded-r-md"
          style={{
            width: 14,
            height: 332,
            background: `repeating-linear-gradient(0deg, ${paperEdge}, ${paperEdge} 2px, ${paper} 2px, ${paper} 4px)`,
            transform: "rotateY(88deg) translateZ(7px)",
            transformOrigin: "right center",
          }}
        />
      )}
    </div>
  )
}

/* ---------- open spread with 3 selectable lesson pages ---------- */
function BookSpread({
  completed,
  turning,
  onOpenLesson,
}: {
  completed: number
  turning: boolean
  onOpenLesson: (idx: number) => void
}) {
  return (
    <div
      className="preserve-3d absolute left-0 top-0"
      style={{ width: 260, height: 340, transform: "translateZ(2px)" }}
    >
      {/* turning sheet feedback */}
      {turning && (
        <div
          className="absolute left-0 top-1 origin-left rounded-md"
          style={{
            width: 252,
            height: 332,
            background: paper,
            animation: "turnSheet 0.65s ease-in-out forwards",
            zIndex: 30,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        />
      )}

      {/* the visible top page = a table of the 3 lessons */}
      <div
        className="absolute rounded-md p-5"
        style={{
          inset: 0,
          left: 4,
          background: paper,
          color: ink,
          boxShadow: "inset 0 0 40px rgba(120,90,40,0.07)",
        }}
      >
        <p className="text-center font-serif text-sm font-bold" style={{ color: cover }}>
          İçindekiler
        </p>
        <span className="mx-auto mt-1 mb-3 block h-px w-12" style={{ background: gold }} />
        <ul className="flex flex-col gap-2.5">
          {islamCourse.lessons.map((l, idx) => {
            const done = idx < completed
            const active = idx === completed
            const locked = idx > completed
            return (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => onOpenLesson(idx)}
                  disabled={locked}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition active:scale-[0.98]"
                  style={{
                    background: active ? `oklch(0.42 0.09 ${TINT} / 0.1)` : "transparent",
                    opacity: locked ? 0.4 : 1,
                    border: active ? `1.5px solid ${cover}` : "1.5px solid transparent",
                  }}
                >
                  <span
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: done ? cover : active ? gold : paperEdge,
                      color: done ? paper : ink,
                    }}
                  >
                    {done ? <CheckMark /> : l.id}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-serif text-sm font-bold" style={{ color: cover }}>
                      {l.title}
                    </span>
                    <span className="block truncate text-xs" style={{ color: "oklch(0.5 0.03 60)" }}>
                      {locked ? "Önce önceki dersi bitir" : done ? "Tamamlandı" : "Okumak için dokun"}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/* ---------- small inline marks (no emojis) ---------- */
function CheckMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CrescentMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M16 3a9 9 0 1 0 5 16.5A7 7 0 0 1 16 3z"
        fill={gold}
      />
    </svg>
  )
}

function BadgeSeal() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r="30" fill="none" stroke={gold} strokeWidth="3" />
      <path
        d="M22 37l9 9 19-20"
        fill="none"
        stroke={gold}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
