# Dream Owners Club — iPhone app

A SwiftUI app for dreamownersclub.com: five tabs (Home, Events, Store, Media, About),
DOC black (#0a0a0b) theme, the DOC wordmark in the top bar, pull-to-refresh, and links
to Instagram/YouTube/checkout opening in their own apps.

Built and installed with [xtool](https://github.com/xtool-org/xtool) — no Mac, no Xcode app.

## One-time setup (Windows)

1. **Install WSL** — PowerShell as admin: `wsl --install -d Ubuntu`, reboot, open Ubuntu.
2. **Install Swift 6.1+ and xtool** — follow the Linux guide at <https://xtool.sh> (the steps
   change between versions, so use theirs rather than a copy).
3. **USB to the iPhone from WSL** — Windows: install [usbipd-win](https://github.com/dorssel/usbipd-win),
   then `usbipd list`, `usbipd bind --busid <id>`, `usbipd attach --wsl --busid <id>`.
   In Ubuntu: `sudo apt install usbmuxd`.
4. **Download Xcode** (the `.xip`) from <https://developer.apple.com/download/all/> — you never open it;
   xtool only extracts the iOS SDK from it.
5. `xtool setup` — sign in with a **spare Apple ID** and point it at the `.xip`.
6. On the iPhone: Settings → Privacy & Security → **Developer Mode** → on.

## Build and install

```bash
cd doc-ios-app
# edit xtool.yml: set bundleID to something unique, e.g. com.yourname.doc
xtool dev
```

First launch: Settings → General → VPN & Device Management → trust your Apple ID.

## Limits (free Apple ID)

- The app **expires after 7 days** — run `xtool dev` again to refresh.
- Max 3 sideloaded apps at once; 10 app IDs per week.
- Not on the App Store. That needs the $99/yr Apple Developer Program (and xtool doesn't
  upload to the App Store yet).
