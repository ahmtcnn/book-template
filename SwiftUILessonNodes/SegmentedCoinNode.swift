import SwiftUI

// MARK: - 1) SEGMENTLİ JETON (Duolingo'ya en yakın, silindirik his)
// Yuvarlak gövde + etrafında 3-4 boşluklu yay segmenti.
// "Silindirik" hissi alttaki gölge/rim katmanıyla verilir.

struct SegmentedCoinNode: View {
    let node: LessonNode
    var size: CGFloat = 96

    private let gap: CGFloat = 6 // segmentler arası açı boşluğu (derece)

    var body: some View {
        ZStack {
            // Alt rim (silindirik derinlik hissi)
            Circle()
                .fill(node.tint.opacity(0.35))
                .frame(width: size, height: size)
                .offset(y: 6)

            // Gövde
            Circle()
                .fill(node.isLocked ? Color.gray.opacity(0.2) : node.tint.opacity(0.18))
                .frame(width: size, height: size)
                .overlay(
                    Image(systemName: node.icon)
                        .font(.system(size: size * 0.32, weight: .bold))
                        .foregroundStyle(node.isLocked ? Color.gray : node.tint)
                )
                .overlay(alignment: .bottomTrailing) {
                    if node.isComplete {
                        Image(systemName: "crown.fill")
                            .font(.system(size: size * 0.22))
                            .foregroundStyle(.yellow)
                            .offset(x: 2, y: 2)
                    }
                }

            // Segment halkası
            ForEach(0..<node.totalSteps, id: \.self) { index in
                SegmentArc(
                    index: index,
                    total: node.totalSteps,
                    gap: gap
                )
                .stroke(
                    index < node.completedSteps ? node.tint : Color.gray.opacity(0.25),
                    style: StrokeStyle(lineWidth: size * 0.08, lineCap: .round)
                )
                .frame(width: size + 14, height: size + 14)
            }
        }
        .frame(width: size + 20, height: size + 20)
    }
}

// Her segmenti çizen yay
struct SegmentArc: Shape {
    let index: Int
    let total: Int
    let gap: Double // derece

    func path(in rect: CGRect) -> Path {
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let radius = rect.width / 2
        let segment = 360.0 / Double(total)
        let start = Double(index) * segment - 90 + gap / 2
        let end = start + segment - gap

        var path = Path()
        path.addArc(
            center: center,
            radius: radius,
            startAngle: .degrees(start),
            endAngle: .degrees(end),
            clockwise: false
        )
        return path
    }
}
