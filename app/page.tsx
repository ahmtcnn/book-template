import { LessonPath } from "@/components/lesson/lesson-path"

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col items-center bg-background px-4 py-10">
      <header className="mb-6 max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Mini Kitap Ders Düğümleri</p>
        <h1 className="mt-2 text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Her ders küçük bir kitap
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          Yoldaki her düğüm kapalı bir kitaptır. Dokununca açılır; içindeki her alt ders bittikçe bir sayfa çevrilir.
          Son sayfa bitince kitap kapanır, altın mühür ve parıltıyla &quot;tamamlandı&quot; olur.
        </p>
      </header>

      <LessonPath />
    </main>
  )
}
