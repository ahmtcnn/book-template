import SwiftUI

// MARK: - 2) ALTIGEN (Hexagon) — bal peteği gibi dizilir
// Kenarları segment segment "dolar".

struct HexagonNode: View {
    let node: LessonNode
    var size: CGFloat = 96

    var body: some View {
        ZStack {
            Hexagon()
                .fill(node.isLocked ? Color.gray.opacity(0.15) : node.tint.opacity(0.15))
                .frame(width: size, height: size)

            // Segmentli kenar dolumu
            Hexagon()
                .trim(from: 0, to: node.progress)
                .stroke(node.tint, style: StrokeStyle(lineWidth: size * 0.09, lineCap: .round, lineJoin: .round))
                .frame(width: size, height: size)

            Image(systemName: node.icon)
                .font(.system(size: size * 0.3, weight: .bold))
                .foregroundStyle(node.isLocked ? Color.gray : node.tint)
        }
        .frame(width: size + 16, height: size + 16)
    }
}

struct Hexagon: Shape {
    func path(in rect: CGRect) -> Path {
        let w = rect.width, h = rect.height
        let points = (0..<6).map { i -> CGPoint in
            let angle = Double(i) * 60 - 90
            let r = min(w, h) / 2
            return CGPoint(
                x: rect.midX + r * cos(angle * .pi / 180),
                y: rect.midY + r * sin(angle * .pi / 180)
            )
        }
        var path = Path()
        path.addLines(points)
        path.closeSubpath()
        return path
    }
}

// MARK: - 3) KRİSTAL / GEM — fasetler tek tek dolar
struct CrystalNode: View {
    let node: LessonNode
    var size: CGFloat = 96

    var body: some View {
        ZStack {
            // Her faset bir alt görev
            ForEach(0..<node.totalSteps, id: \.self) { i in
                CrystalFacet(index: i, total: node.totalSteps)
                    .fill(i < node.completedSteps ? node.tint.opacity(0.75) : Color.gray.opacity(0.15))
                    .overlay(
                        CrystalFacet(index: i, total: node.totalSteps)
                            .stroke(node.tint.opacity(0.5), lineWidth: 1)
                    )
            }
            .frame(width: size, height: size)

            Image(systemName: node.icon)
                .font(.system(size: size * 0.26, weight: .bold))
                .foregroundStyle(.white)
                .shadow(radius: 2)
        }
        .frame(width: size + 16, height: size + 16)
    }
}

struct CrystalFacet: Shape {
    let index: Int
    let total: Int

    func path(in rect: CGRect) -> Path {
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let r = rect.width / 2
        let segment = 360.0 / Double(total)
        let start = Double(index) * segment - 90
        let end = start + segment

        var path = Path()
        path.move(to: center)
        path.addLine(to: point(start, center, r))
        path.addLine(to: point(end, center, r))
        path.closeSubpath()
        return path
    }

    private func point(_ deg: Double, _ c: CGPoint, _ r: CGFloat) -> CGPoint {
        CGPoint(x: c.x + r * cos(deg * .pi / 180), y: c.y + r * sin(deg * .pi / 180))
    }
}

// MARK: - 4) KALKAN / ROZET — çeyreklere bölünür
struct ShieldNode: View {
    let node: LessonNode
    var size: CGFloat = 96

    var body: some View {
        ZStack {
            Image(systemName: "shield.fill")
                .font(.system(size: size))
                .foregroundStyle(node.isLocked ? Color.gray.opacity(0.25) : node.tint.opacity(0.85))

            // Üstte dolum çentikleri (3-4 parça)
            VStack(spacing: 2) {
                ForEach(0..<node.totalSteps, id: \.self) { i in
                    Capsule()
                        .fill(i < node.completedSteps ? Color.white : Color.white.opacity(0.25))
                        .frame(width: size * 0.5, height: size * 0.07)
                }
            }
            .offset(y: -size * 0.18)

            Image(systemName: node.icon)
                .font(.system(size: size * 0.24, weight: .bold))
                .foregroundStyle(.white)
                .offset(y: size * 0.08)
        }
        .frame(width: size + 16, height: size + 16)
    }
}
