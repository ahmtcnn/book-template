import SwiftUI

// Tüm ders düğümü tiplerini yan yana gösteren demo galerisi.
// Xcode'da Preview'da veya bir ekran olarak çalıştırabilirsin.

struct LessonNodesGallery: View {
    private let nodes = LessonNode.samples

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 32) {
                header

                section("Segmentli Jeton (Duolingo'ya en yakın)") {
                    row { SegmentedCoinNode(node: $0) }
                }
                section("Altıgen — bal peteği gibi dizilir") {
                    row { HexagonNode(node: $0) }
                }
                section("Kristal / Gem — fasetler dolar") {
                    row { CrystalNode(node: $0) }
                }
                section("Kalkan / Rozet") {
                    row { ShieldNode(node: $0) }
                }
                section("Dinamik Su Bardağı (animasyonlu)") {
                    row { WaterGlassNode(node: $0) }
                }
                section("Yaprak / Çiçek") {
                    row { LeafNode(node: $0) }
                }
                section("Kitap") {
                    row { BookNode(node: $0) }
                }
            }
            .padding()
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Ders Düğümü Stilleri")
                .font(.largeTitle.bold())
            Text("Her şekil 3-4 parça ile ilerlemeyi gösterir")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
    }

    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.headline)
            content()
        }
    }

    private func row<NodeView: View>(@ViewBuilder _ build: @escaping (LessonNode) -> NodeView) -> some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 20) {
                ForEach(nodes) { node in
                    VStack(spacing: 6) {
                        build(node)
                        Text("\(node.completedSteps)/\(node.totalSteps)")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .padding(.vertical, 8)
        }
    }
}

#Preview {
    LessonNodesGallery()
}
