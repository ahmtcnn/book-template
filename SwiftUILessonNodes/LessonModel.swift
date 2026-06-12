import SwiftUI

// MARK: - Ortak Model
// Duolingo'daki gibi her ders bir "node". Etrafındaki/üstündeki
// 3-4 parça = alt görevler (crown level / step) demektir.

struct LessonNode: Identifiable {
    let id = UUID()
    var title: String
    var icon: String          // SF Symbol adı
    /// Toplam alt görev sayısı (genelde 3-4)
    var totalSteps: Int
    /// Tamamlanan alt görev sayısı
    var completedSteps: Int
    var tint: Color

    /// 0...1 arası ilerleme
    var progress: Double {
        guard totalSteps > 0 else { return 0 }
        return Double(completedSteps) / Double(totalSteps)
    }

    var isLocked: Bool { completedSteps == 0 }
    var isComplete: Bool { completedSteps >= totalSteps }
}

extension LessonNode {
    static let samples: [LessonNode] = [
        .init(title: "Temeller",   icon: "textformat",        totalSteps: 4, completedSteps: 4, tint: .green),
        .init(title: "Selamlaşma", icon: "hand.wave.fill",     totalSteps: 4, completedSteps: 3, tint: .blue),
        .init(title: "Sayılar",    icon: "number",             totalSteps: 3, completedSteps: 1, tint: .orange),
        .init(title: "Renkler",    icon: "paintpalette.fill",  totalSteps: 4, completedSteps: 0, tint: .pink),
    ]
}
