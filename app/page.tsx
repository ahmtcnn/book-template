import { IslamCourseBook } from "@/components/lesson/islam-course-book"

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col items-center bg-background px-4 py-10">
      <header className="mb-10 max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">3 Boyutlu Kurs Kitabı</p>
        <h1 className="mt-2 text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Kitabı aç, sayfaya dokun, içine gir
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          Kapalı kitap olarak başlar. Kursa başlayınca kapak açılır; bir derse dokunduğunda sayfanın içine zoom yaparak
          metni büyütüp okutur. Her dersi bitirdikçe sayfa çevrilir, 3 ders bitince tamamlanma ekranı gelir.
        </p>
      </header>

      <IslamCourseBook />
    </main>
  )
}
