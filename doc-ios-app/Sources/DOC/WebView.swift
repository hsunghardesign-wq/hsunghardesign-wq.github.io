import SwiftUI
import WebKit

/// Shows a dreamownersclub.com page. Links that leave the site
/// (Instagram, YouTube, checkout providers) open in Safari or their own app.
struct WebView: UIViewRepresentable {
    let url: URL
    @Binding var isLoading: Bool
    let reloadToken: Int

    func makeCoordinator() -> Coordinator { Coordinator(self) }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        // Shared store so the site's own state (cart, sign-ups) is the same in every tab.
        config.websiteDataStore = .default()

        let view = WKWebView(frame: .zero, configuration: config)
        view.navigationDelegate = context.coordinator
        view.isOpaque = false
        view.backgroundColor = UIColor(red: 10/255, green: 10/255, blue: 11/255, alpha: 1)
        view.scrollView.backgroundColor = view.backgroundColor
        view.allowsBackForwardNavigationGestures = true
        view.customUserAgent = nil

        let refresh = UIRefreshControl()
        refresh.tintColor = .white
        refresh.addTarget(context.coordinator, action: #selector(Coordinator.pullToRefresh(_:)), for: .valueChanged)
        view.scrollView.refreshControl = refresh

        view.load(URLRequest(url: url))
        context.coordinator.lastReloadToken = reloadToken
        return view
    }

    func updateUIView(_ view: WKWebView, context: Context) {
        if reloadToken != context.coordinator.lastReloadToken {
            context.coordinator.lastReloadToken = reloadToken
            view.load(URLRequest(url: url))
        }
    }

    @MainActor
    final class Coordinator: NSObject, WKNavigationDelegate {
        var parent: WebView
        var lastReloadToken = 0
        init(_ parent: WebView) { self.parent = parent }

        @objc func pullToRefresh(_ sender: UIRefreshControl) {
            (sender.superview?.superview as? WKWebView)?.reload()
            sender.endRefreshing()
        }

        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            parent.isLoading = true
        }
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.isLoading = false
        }
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            parent.isLoading = false
        }
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            parent.isLoading = false
        }

        func webView(_ webView: WKWebView,
                     decidePolicyFor action: WKNavigationAction,
                     decisionHandler: @escaping @MainActor (WKNavigationActionPolicy) -> Void) {
            guard let target = action.request.url else { return decisionHandler(.allow) }
            let host = target.host?.lowercased() ?? ""
            let onSite = host.isEmpty || host.hasSuffix("dreamownersclub.com")
            let isWeb = ["http", "https"].contains(target.scheme?.lowercased() ?? "")
            if action.navigationType == .linkActivated && (!onSite || !isWeb) {
                UIApplication.shared.open(target)
                return decisionHandler(.cancel)
            }
            decisionHandler(.allow)
        }
    }
}
