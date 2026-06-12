import SwiftUI

// MARK: - 5) DİNAMİK SU BARDAĞI — su seviyesi ilerlemeyle yükselir + dalga animasyonu
// Çok hoş bir "yaşayan" his verir. İlerleme = su seviyesi.

struct WaterGlassNode: View {
    let node: LessonNode
    var size: CGFloat = 96

    @State private var wavePhase: CGFloat = 0

    var body: some View {
        ZStack {
            // Bardak gövdesi
            RoundedRectangle(cornerRadius: size * 0.18)
                .fill(Color.gray.opacity(0.08))
                .frame(width: size * 0.7, height: size)

            // Su + dalga (ilerleme kadar dolu)
            WaveShape(progress: node.progress, phase: wavePhase)
                .fill(node.tint.opacity(0.7))
                .frame(width: size * 0.7, height: size)
                .mask(RoundedRectangle(cornerRadius: size * 0.18).frame(width: size * 0.7, height: size))

            // İkinci dalga (derinlik için)
            WaveShape(progress: node.progress, phase: wavePhase + .pi)
                .fill(node.tint.opacity(0.4))
                .frame(width: size * 0.7, height: size)
                .mask(RoundedRectangle(cornerRadius: size * 0.18).frame(width: size * 0.7, height: size))

            // Bardak kenarlığı
            RoundedRectangle(cornerRadius: size * 0.18)
                .stroke(node.tint.opacity(0.6), lineWidth: 3)
                .frame(width: size * 0.7, height: size)

            Image(systemName: node.icon)
                .font(.system(size: size * 0.26, weight: .bold))
                .foregroundStyle(node.progress > 0.4 ? .white : node.tint)
        }
        .frame(width: size + 16, height: size + 16)
        .onAppear {
            withAnimation(.linear(duration: 2).repeatForever(autoreverses: false)) {
                wavePhase = .pi * 2
            }
        }
    }
}

struct WaveShape: Shape {
    var progress: Double      // 0...1 doluluk
    var phase: CGFloat        // dalga kayması
    var amplitude: CGFloat = 4

    var animatableData: CGFloat {
        get { phase }
        set { phase = newValue }
    }

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let waterLevel = rect.height * (1 - progress)
        path.move(to: CGPoint(x: 0, y: waterLevel))

        for x in stride(from: 0, through: rect.width, by: 1) {
            let relativeX = x / rect.width
            let y = waterLevel + sin(relativeX * .pi * 2 + phase) * amplitude
            path.addLine(to: CGPoint(x: x, y: y))
        }
        path.addLine(to: CGPoint(x: rect.width, y: rect.height))
        path.addLine(to: CGPoint(x: 0, y: rect.height))
        path.closeSubpath()
        return path
    }
}

// MARK: - 6) YAPRAK / ÇİÇEK — her yaprak bir alt görev
struct LeafNode: View {
    let node: LessonNode
    var size: CGFloat = 96

    var body: some View {
        ZStack {
            ForEach(0..<node.totalSteps, id: \.self) { i in
                Image(systemName: "leaf.fill")
                    .font(.system(size: size * 0.42))
                    .foregroundStyle(i < node.completedSteps ? node.tint : Color.gray.opacity(0.2))
                    .offset(y: -size * 0.28)
                    .rotationEffect(.degrees(Double(i) / Double(node.totalSteps) * 360))
            }

            Circle()
                .fill(node.tint.opacity(0.2))
                .frame(width: size * 0.4, height: size * 0.4)
                .overlay(
                    Image(systemName: node.icon)
                        .font(.system(size: size * 0.18, weight: .bold))
                        .foregroundStyle(node.tint)
                )
        }
        .frame(width: size + 16, height: size + 16)
    }
}

// MARK: - 7) KİTAP — sayfalar/şeritler dolar
struct BookNode: View {
    let node: LessonNode
    var size: CGFloat = 96

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: size * 0.1)
                .fill(node.isLocked ? Color.gray.opacity(0.2) : node.tint.opacity(0.85))
                .frame(width: size * 0.8, height: size)
                .overlay(alignment: .leading) {
                    // Kitap sırtı
                    Rectangle()
                        .fill(.black.opacity(0.15))
                        .frame(width: size * 0.08)
                        .clipShape(RoundedRectangle(cornerRadius: size * 0.1))
                }

            VStack(spacing: size * 0.06) {
                Image(systemName: node.icon)
                    .font(.system(size: size * 0.28, weight: .bold))
                    .foregroundStyle(.white)

                // İlerleme şeritleri (3-4 parça = bölümler)
                HStack(spacing: 3) {
                    ForEach(0..<node.totalSteps, id: \.self) { i in
                        Capsule()
                            .fill(i < node.completedSteps ? Color.white : Color.white.opacity(0.3))
                            .frame(width: size * 0.12, height: size * 0.05)
                    }
                }
            }
        }
        .frame(width: size + 16, height: size + 16)
    }
}
