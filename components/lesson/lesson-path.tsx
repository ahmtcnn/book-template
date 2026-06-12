"use client"

import { useState } from "react"
import { BookLessonNode, type BookLesson, type NodeStatus } from "./book-lesson-node"

/* sample lessons modeled after the reference screenshot */
const lessons: BookLesson[] = [
  {
    tag: "AKAID 1",
    title: "İslam kelimesinin anlamı",
    subLessons: [
      { title: "İslam ne demek?", durationMin: 2 },
      { title: "Teslimiyet kavramı", durationMin: 3 },
    ],
  },
  {
    tag: "ARAPÇA 1",
    title: "İlk kelime: Rahmân",
    subLessons: [
      { title: "Rahmân'ın anlamı", durationMin: 2 },
      { title: "Telaffuz", durationMin: 1 },
      { title: "Örnek cümleler", durationMin: 1 },
    ],
  },
  {
    tag: "AKAID 2",
    title: "Tevhid: Allah'ın birliği",
    subLessons: [
      { title: "Tevhid nedir?", durationMin: 3 },
      { title: "Şirkten kaçınmak", durationMin: 3 },
    ],
  },
  {
    tag: "SÜNNET 1",
    title: "Sünnet: Sabah uyandığında",
    subLessons: [
      { title: "Uyanış duası", durationMin: 2 },
      { title: "Güne başlama âdâbı", durationMin: 2 },
    ],
  },
]

/* gentle left-right offsets so the path snakes like Duolingo */
const offsets = [0, 64, 16, 72, 8]

export function LessonPath() {
  // index of the lesson the learner is currently on
  const [currentLesson, setCurrentLesson] = useState(0)

  const statusFor = (i: number): NodeStatus => {
    if (i < currentLesson) return "completed"
    if (i === currentLesson) return "current"
    return "locked"
  }

  return (
    <div className="relative mx-auto w-full max-w-md px-4 py-8">
      {/* the connecting trail */}
      <div className="flex flex-col items-center gap-12">
        {lessons.map((lesson, i) => {
          const status = statusFor(i)
          return (
            <div key={i} className="relative flex w-full items-center justify-center">
              {/* connector to previous node */}
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 -top-12 h-12 w-1 rounded-full"
                  style={{
                    transform: `translateX(${(offsets[i - 1] + offsets[i]) / 2 - offsets[i]}px)`,
                    background: i <= currentLesson ? "oklch(0.62 0.17 150)" : "oklch(0.9 0.01 150)",
                  }}
                />
              )}

              <div style={{ transform: `translateX(${offsets[i] - 36}px)` }}>
                <div className="flex flex-col items-center gap-2">
                  {status === "current" && (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-md">
                      BAŞLA
                    </span>
                  )}
                  <BookLessonNode
                    lesson={lesson}
                    status={status}
                    size={104}
                    onComplete={() => setCurrentLesson((c) => Math.max(c, i + 1))}
                  />
                  <div className="max-w-[150px] text-center">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{lesson.tag}</p>
                    <p className="text-pretty text-sm font-semibold leading-snug text-foreground">{lesson.title}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
