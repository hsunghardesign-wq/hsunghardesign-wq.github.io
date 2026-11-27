import SwiftUI

@main
struct DOCApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
                .preferredColorScheme(.dark)
        }
    }
}

/// Every section of dreamownersclub.com, one tab each.
enum Section: String, CaseIterable, Identifiable {
    case home, events, store, media, about
    var id: String { rawValue }

    var title: String { rawValue.capitalized }

    var icon: String {
        switch self {
        case .home: "house.fill"
        case .events: "calendar"
        case .store: "bag.fill"
        case .media: "play.rectangle.fill"
        case .about: "info.circle.fill"
        }
    }

    var url: URL {
        let base = "https://dreamownersclub.com"
        return URL(string: self == .home ? base : "\(base)/\(rawValue)")!
    }
}

struct RootView: View {
    @State private var selection: Section = .home

    var body: some View {
        TabView(selection: $selection) {
            ForEach(Section.allCases) { section in
                SectionScreen(section: section)
                    .tabItem { Label(section.title, systemImage: section.icon) }
                    .tag(section)
            }
        }
        .tint(.white)
    }
}

struct SectionScreen: View {
    let section: Section
    @State private var isLoading = true
    @State private var reloadToken = 0

    var body: some View {
        NavigationStack {
            ZStack {
                Color.docBlack.ignoresSafeArea()
                WebView(url: section.url, isLoading: $isLoading, reloadToken: reloadToken)
                    .ignoresSafeArea(edges: .bottom)
                if isLoading {
                    ProgressView().tint(.white)
                }
            }
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Image("logo", bundle: .module)
                        .resizable()
                        .scaledToFit()
                        .frame(height: 14)
                        .accessibilityLabel("Dream Owners Club")
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button { reloadToken += 1 } label: { Image(systemName: "arrow.clockwise") }
                        .accessibilityLabel("Reload")
                }
            }
            .toolbarBackground(Color.docBlack, for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

extension Color {
    /// #0a0a0b, the site's background colour.
    static let docBlack = Color(red: 10 / 255, green: 10 / 255, blue: 11 / 255)
}
