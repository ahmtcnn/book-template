"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createPortal } from "react-dom"

/* ---------------------------------------------------------------------------
 * BookLessonNode
 * A Duolingo-style lesson node rendered as a tiny 3D book.
 * - "locked"     : greyed out, not tappable
 * - "current"    : tappable, gently bobbing — this is the lesson to do next
 * - "completed"  : closed book with a gold seal
 *
 * Tapping a current/completed node opens a panel listing the sub-lessons.
 * Finishing each sub-lesson turns a page; finishing the last one closes the
 * book with a sparkle burst and stamps the completion seal.
 * ------------------------------------------------------------------------- */

export type SubLesson = {
  title: string
  durationMin: number
}

export type BookLesson = {
  /** short label above the title, e.g. "AKAID 1" */
  tag: string
  /** main title, e.g. "İslam kelimesinin anlamı" */
  title: string
  /** the pages / sub-lessons inside this book */
  subLessons: SubLesson[]
}

export type NodeStatus = "locked" | "current" | "completed"

const cover = "oklch(0.42 0.09 150)"
const coverDark = "oklch(0.32 0.08 150)"
const gold = "oklch(0.78 0.13 85)"
const goldSoft = "oklch(0.86 0.1 85)"
const paper = "oklch(0.96 0.015 85)"
const paperEdge = "oklch(0.88 0.025 85)"
const ink = "oklch(0.3 0.03 60)"

export function BookLessonNode({
  lesson,
  status,
  size = 96,
  /** how many sub-lessons are already done (for resuming progress) */
  initialProgress = 0,
  onComplete,
}: {
  lesson: BookLesson
  status: NodeStatus
  size?: number
  initialProgress?: number
  onComplete?: () => void
}) {
  const total = lesson.subLessons.length
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(status === "completed" ? total : initialProgress)
  const [turning, setTurning] = useState(false)
  const [justFinished, setJustFinished] = useState(false)
  const [burst, setBurst] = useState(false)

  const isCompleted = status === "completed" || done >= total
  const isLocked = status === "locked"

  const turnTimer = useRef<number | null>(null)
  useEffect(() => {
    return () => {
      if (turnTimer.current) window.clearTimeout(turnTimer.current)
    }
  }, [])

  const handleOpen = useCallback(() => {
    if (isLocked) return
    setOpen(true)
  }, [isLocked])

  const finishSubLesson = useCallback(() => {
    if (turning) return
    setTurning(true)
    turnTimer.current = window.setTimeout(() => {
      const next = Math.min(done + 1, total)
      setDone(next)
      setTurning(false)
      if (next >= total) {
        // closing celebration
        setBurst(true)
        setJustFinished(true)
        onComplete?.()
        window.setTimeout(() => setOpen(false), 1400)
      }
    }, 700)
  }, [turning, done, total, onComplete])

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={isLocked ? `${lesson.title} (kilitli)` : `${lesson.title} dersini aç`}
        disabled={isLocked}
        className={`group relative inline-flex items-center justify-center rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-offset-2 ${
          isLocked ? "cursor-not-allowed" : "cursor-pointer active:scale-95"
        }`}
        style={{ width: size, height: size * 0.92 }}
      >
        <MiniBook
          size={size}
          status={status}
          completed={isCompleted}
          stamp={justFinished}
          bob={status === "current" && !isCompleted}
          progress={done}
          total={total}
        />
      </button>

      {open && (
        <LessonPanel
          lesson={lesson}
          done={done}
          total={total}
          turning={turning}
          burst={burst}
          completed={isCompleted}
          onFinish={finishSubLesson}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

/* ---------------------------- the tiny 3D book ---------------------------- */
function MiniBook({
  size,
  status,
  completed,
  stamp,
  bob,
  progress,
  total,
}: {
  size: number
  status: NodeStatus
  completed: boolean
  stamp: boolean
  bob: boolean
  progress: number
  total: number
}) {
  const w = size * 0.74
  const h = size * 0.92
  const locked = status === "locked"

  return (
    <span className="scene-3d block" style={{ width: size, height: h }}>
      {/* soft ground shadow */}
      <span
        className="absolute left-1/2 rounded-[50%]"
        style={{
          bottom: 2,
          width: w * 0.9,
          height: 10,
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.18)",
          filter: "blur(5px)",
        }}
      />

      <span
        className={`preserve-3d absolute left-1/2 top-1/2 block ${bob ? "node-bob" : ""}`}
        style={{
          width: w,
          height: h,
          marginLeft: -w / 2,
          marginTop: -h / 2,
          transform: "rotateX(12deg) rotateY(-26deg)",
          opacity: locked ? 0.6 : 1,
          filter: locked ? "grayscale(0.85) brightness(0.9)" : "none",
        }}
      >
        {/* back cover */}
        <span
          className="absolute rounded-md"
          style={{
            inset: 0,
            background: `linear-gradient(135deg, ${coverDark}, oklch(0.26 0.06 150))`,
            transform: "translateZ(-18px)",
            boxShadow: "0 16px 30px -10px rgba(0,0,0,0.5)",
          }}
        />
        {/* gilded page block (thickness) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-r-sm"
            style={{
              inset: 0,
              left: 3,
              background: i % 2 === 0 ? paper : paperEdge,
              transform: `translateZ(${-(i + 1) * 2.2}px)`,
            }}
          />
        ))}
        {/* gold fore-edge gilt */}
        <span
          className="absolute"
          style={{
            right: 0,
            top: 2.5,
            width: 18,
            height: h - 5,
            background: `repeating-linear-gradient(0deg, ${goldSoft}, ${goldSoft} 1px, ${gold} 1px, ${gold} 2.5px)`,
            transform: "rotateY(84deg) translateZ(9px)",
            transformOrigin: "right center",
            borderRadius: "0 2px 2px 0",
          }}
        />

        {/* front cover — uses the real embossed cover artwork */}
        <span
          className="absolute overflow-hidden rounded-md"
          style={{
            inset: 0,
            backgroundImage: "url(/islamic-cover.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "inset 0 0 26px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.15)",
            transform: "translateZ(2px)",
          }}
        >
          {/* spine shadow on the left edge */}
          <span
            className="absolute left-0 top-0 h-full"
            style={{ width: 8, background: "linear-gradient(90deg, rgba(0,0,0,0.55), transparent)" }}
          />
          {/* glossy sheen */}
          <span
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 100%)",
            }}
          />
          {/* progress pips at the base */}
          {!completed && total > 1 && (
            <span className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className="block rounded-full"
                  style={{
                    width: 4,
                    height: 4,
                    background: i < progress ? gold : "rgba(255,255,255,0.35)",
                    boxShadow: i < progress ? `0 0 4px ${gold}` : "none",
                  }}
                />
              ))}
            </span>
          )}
        </span>

        {/* hanging bookmark ribbon on the current node */}
        {!completed && !locked && (
          <span
            className="absolute"
            style={{
              top: -3,
              right: w * 0.24,
              width: 8,
              height: h * 0.62,
              background: `linear-gradient(${gold}, ${goldSoft})`,
              transform: "translateZ(3px)",
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          />
        )}

        {/* completion seal stamped onto the closed cover */}
        {completed && (
          <span
            className={`absolute inset-0 flex items-center justify-center ${stamp ? "seal-stamp" : ""}`}
            style={{ transform: "translateZ(4px)" }}
          >
            <span
              className="flex items-center justify-center rounded-full"
              style={{
                width: size * 0.52,
                height: size * 0.52,
                background: "radial-gradient(circle at 35% 30%, oklch(0.5 0.1 150), oklch(0.34 0.08 150))",
                boxShadow: "0 4px 10px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.2)",
              }}
            >
              <Seal size={size * 0.34} />
            </span>
          </span>
        )}
      </span>

      {/* burst ring + sparkles fire from the node on completion */}
      {stamp && <Sparkles size={size} />}

      {/* lock badge */}
      {locked && (
        <span
          className="absolute bottom-1 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full"
          style={{ background: "oklch(0.5 0.02 150)", color: paper }}
        >
          <Lock />
        </span>
      )}
    </span>
  )
}

/* ----------------------------- the open panel ----------------------------- */
function LessonPanel({
  lesson,
  done,
  total,
  turning,
  burst,
  completed,
  onFinish,
  onClose,
}: {
  lesson: BookLesson
  done: number
  total: number
  turning: boolean
  burst: boolean
  completed: boolean
  onFinish: () => void
  onClose: () => void
}) {
  // the sub-lesson currently being read = first not-done one
  const currentIdx = Math.min(done, total - 1)
  const allDone = done >= total

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Kapat"
        onClick={onClose}
        className="backdrop-in absolute inset-0"
        style={{ background: "rgba(20,30,25,0.55)", backdropFilter: "blur(3px)" }}
      />

      <div
        className="panel-in relative w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl"
        style={{
          background: `linear-gradient(165deg, ${paper}, oklch(0.93 0.02 85))`,
          color: ink,
          boxShadow: "0 30px 70px -25px rgba(0,0,0,0.6)",
        }}
      >
        {/* header strip — embossed cover texture behind a dark veil */}
        <div className="relative overflow-hidden px-6 pb-5 pt-6 text-center" style={{ color: paper }}>
          <span
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/islamic-cover.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <span className="absolute inset-0" style={{ background: "oklch(0.34 0.08 150 / 0.82)" }} />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: goldSoft }}>
              {lesson.tag}
            </p>
            <h2 className="mt-1 text-balance font-serif text-xl font-bold">{lesson.title}</h2>

            {/* progress bar */}
            <div
              className="mx-auto mt-4 h-1.5 w-40 overflow-hidden rounded-full"
              style={{ background: "rgba(255,255,255,0.25)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(done / total) * 100}%`, background: gold }}
              />
            </div>
            <p className="mt-1.5 text-xs" style={{ color: goldSoft }}>
              {done} / {total} sayfa
            </p>
          </div>
        </div>

        {/* page area */}
        <div className="relative px-6 py-6">
          {allDone ? (
            <CompletedInner lesson={lesson} burst={burst} onClose={onClose} />
          ) : (
            <div className="scene-3d">
              {/* turning sheet feedback */}
              <div
                className="preserve-3d relative origin-left"
                style={{ minHeight: 188 }}
              >
                {turning && (
                  <div
                    className="page-turn absolute inset-0 origin-left rounded-xl"
                    style={{ background: paper, zIndex: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
                  />
                )}

                {/* sub-lesson list */}
                <ul className="flex flex-col gap-2">
                  {lesson.subLessons.map((s, i) => {
                    const subDone = i < done
                    const active = i === currentIdx
                    return (
                      <li
                        key={i}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition"
                        style={{
                          background: active ? "oklch(0.42 0.09 150 / 0.08)" : "transparent",
                          border: active ? `1.5px solid ${cover}` : "1.5px solid transparent",
                          opacity: !subDone && !active ? 0.5 : 1,
                        }}
                      >
                        <span
                          className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-sm font-bold"
                          style={{
                            background: subDone ? cover : active ? gold : paperEdge,
                            color: subDone ? paper : ink,
                          }}
                        >
                          {subDone ? <Check /> : i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-serif text-sm font-bold" style={{ color: cover }}>
                            {s.title}
                          </span>
                          <span className="block text-xs" style={{ color: "oklch(0.5 0.03 60)" }}>
                            {s.durationMin} dk{subDone ? " · tamamlandı" : active ? " · sıradaki" : ""}
                          </span>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <button
                type="button"
                onClick={onFinish}
                disabled={turning}
                className="mt-5 w-full rounded-2xl py-3 text-sm font-bold shadow-md transition active:scale-[0.98] disabled:opacity-60"
                style={{ background: cover, color: paper }}
              >
                {turning
                  ? "Sayfa çevriliyor..."
                  : done === total - 1
                    ? "Son dersi bitir ve kitabı kapat"
                    : "Bu dersi tamamla, sayfayı çevir"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

function CompletedInner({
  lesson,
  burst,
  onClose,
}: {
  lesson: BookLesson
  burst: boolean
  onClose: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-2 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center">
        {burst && <Sparkles size={120} />}
        <div
          className="seal-stamp flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: cover, boxShadow: `0 0 0 8px oklch(0.42 0.09 150 / 0.15)` }}
        >
          <Seal size={48} />
        </div>
      </div>
      <h3 className="font-serif text-lg font-bold" style={{ color: cover }}>
        Ders tamamlandı
      </h3>
      <p className="text-pretty text-sm" style={{ color: "oklch(0.5 0.03 60)" }}>
        {lesson.title} bölümündeki {lesson.subLessons.length} sayfayı bitirdin. Kitap kapandı.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-1 rounded-2xl px-6 py-2.5 text-sm font-bold shadow-md transition active:scale-[0.98]"
        style={{ background: cover, color: paper }}
      >
        Yola Dön
      </button>
    </div>
  )
}

/* ------------------------------- sparkles -------------------------------- */
function Sparkles({ size }: { size: number }) {
  const particles = Array.from({ length: 10 })
  return (
    <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <span
        className="burst-ring absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: size * 0.7, height: size * 0.7, border: `2px solid ${gold}` }}
      />
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2
        const dist = size * 0.55
        const sx = Math.cos(angle) * dist
        const sy = Math.sin(angle) * dist
        return (
          <span
            key={i}
            className="sparkle-fly absolute left-1/2 top-1/2 block rounded-full"
            style={
              {
                width: 6,
                height: 6,
                marginLeft: -3,
                marginTop: -3,
                background: i % 2 === 0 ? gold : goldSoft,
                animationDelay: `${i * 0.02}s`,
                "--sx": `${sx}px`,
                "--sy": `${sy}px`,
              } as React.CSSProperties
            }
          />
        )
      })}
    </span>
  )
}

/* ------------------------------- tiny marks ------------------------------ */
function Seal({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="none" stroke={gold} strokeWidth="2.5" />
      <circle cx="24" cy="24" r="15" fill="none" stroke={gold} strokeWidth="1" opacity="0.6" />
      <path
        d="M15 24.5l6 6 12-13"
        fill="none"
        stroke={gold}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Lock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  )
}
