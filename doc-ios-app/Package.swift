// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "DOC",
    platforms: [.iOS(.v17)],
    products: [.library(name: "DOC", targets: ["DOC"])],
    targets: [
        .target(name: "DOC", resources: [.process("logo.png")])
    ]
)
