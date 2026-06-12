export type LessonContent = {
  id: number
  title: string
  subtitle: string
  era: string
  body: string[]
  keyTerm: { term: string; meaning: string }
}

export const islamCourse = {
  title: "İslam Tarihi",
  subtitle: "Başlangıçtan Hicret'e",
  lessons: [
    {
      id: 1,
      title: "Cahiliye Dönemi",
      subtitle: "İslam öncesi Arabistan",
      era: "6. Yüzyıl",
      body: [
        "İslam'ın doğuşundan önce Arap Yarımadası, kabileler hâlinde yaşayan, çoğunlukla putperest bir topluma sahipti. Bu döneme bilgisizlik anlamında 'Cahiliye Dönemi' denir.",
        "Mekke, hem ticaret hem de Kâbe sayesinde dinî bir merkezdi. Yıllık panayırlar ve hac, şehri Yarımada'nın kalbi hâline getiriyordu.",
        "Toplumda kabile bağı her şeyin üstündeydi; adalet, soya ve güce göre belirlenirdi.",
      ],
      keyTerm: { term: "Cahiliye", meaning: "İslam öncesi bilgisizlik ve putperestlik dönemi" },
    },
    {
      id: 2,
      title: "Vahyin Başlaması",
      subtitle: "Hira Mağarası ve ilk emir",
      era: "610",
      body: [
        "Hz. Muhammed (s.a.v.) sık sık Hira Mağarası'na çekilip tefekküre dalardı. 610 yılında burada ilk vahyi aldı: 'Oku!' (İkra).",
        "İlk inananlar arasında Hz. Hatice, Hz. Ebû Bekir, Hz. Ali ve Zeyd bin Hârise yer aldı. Davet önce gizli, sonra açık yürütüldü.",
        "Mekke'nin ileri gelenleri yeni dine sert tepki gösterdi ve Müslümanlar büyük baskılarla karşılaştı.",
      ],
      keyTerm: { term: "Vahiy", meaning: "Allah'ın peygambere bildirdiği ilahi mesaj" },
    },
    {
      id: 3,
      title: "Hicret",
      subtitle: "Mekke'den Medine'ye göç",
      era: "622",
      body: [
        "Artan baskılar üzerine Müslümanlar 622 yılında Medine'ye göç etti. Bu olaya 'Hicret' denir ve İslam takviminin başlangıcı kabul edilir.",
        "Medine'de muhacirler (göç edenler) ile ensar (yardım edenler) kardeş ilan edildi; ilk İslam toplumu burada kuruldu.",
        "Hz. Muhammed, Medine Sözleşmesi ile farklı toplulukları bir arada yaşatan bir düzen kurdu.",
      ],
      keyTerm: { term: "Hicret", meaning: "622'de Mekke'den Medine'ye yapılan göç" },
    },
  ] as LessonContent[],
}
