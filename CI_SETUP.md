# iOS: accounts, CI and shipping

Build a GOAT's iOS app (`native/`, see `native/README.md`) is built and signed on GitHub's macOS
runners, so no Mac is needed. The pipeline is a copy of The Fort's and reuses the same Apple team
credentials.

- `.github/workflows/ios.yml` runs the shell tests and the game checks, builds `native/www`, syncs
  Capacitor, then archives and uploads to TestFlight with `fastlane ios beta`. **Every run uploads a
  build**, so trigger it only to ship. Tick `release` for the App Store candidate (live ad units).
- `.github/workflows/ios-mint-cert.yml` mints a new Apple Distribution certificate. You don't need it
  now; the team's certificate is shared with The Fort and Euchre Unleashed.

## Checklist: what you need to set up (in order)

Done (2026-11-06): steps 1 and 2. Bundle id `com.buildagoat.game` is registered, and the app record
"Build a GOAT" exists (Apple ID 6831687367, SKU `buildagoat001`). Each remaining step names the id
to paste back into the code.

Also open: App Store Connect shows a banner saying the account holder must accept the updated
**Paid Applications Schedule** (Business module) before new in-app purchases can be created or new
apps submitted. TestFlight builds don't need it.

### 1. Apple Developer: bundle id
developer.apple.com > Certificates, Identifiers & Profiles > Identifiers > **+** > App IDs > App.
- Description: Build a GOAT. Bundle ID (explicit): `com.buildagoat.game`.
- Capabilities: **In-App Purchase** (on by default). Nothing else.

### 2. App Store Connect: app record
appstoreconnect.apple.com > Apps > **+** > New App.
- Platform iOS, name "Build a GOAT" (if it's taken, try "Build a GOAT: Basketball Career"; the
  home-screen name stays Build a GOAT), language English (U.S.), bundle id `com.buildagoat.game`,
  SKU `buildagoat001`, Full Access.
- **Agreements, Tax, and Banking:** the Paid Apps agreement must be active, or no product loads,
  not even in TestFlight. It's the same account as The Fort, so it's probably already active.

### 3. App Store Connect: in-app purchases
The app > Monetization > In-App Purchases > **+**, one per row of the table in `native/README.md`
("In-app products"): five **Consumable** gem packs and one **Non-Consumable** `bag_noads`. Each needs
a price, an English display name and description, and a review screenshot (the Equipment screen
with the Gem shop is fine).

### 4. RevenueCat
app.revenuecat.com > **+ New project** "Build a GOAT" > add an **App Store** app with bundle id
`com.buildagoat.game`.
- Connect App Store Connect: an In-App Purchase key (.p8) from App Store Connect > Users and
  Access > Integrations > In-App Purchase. The Fort's project has one you can reuse.
- Products: import the five `bag_*` products. Optional: an entitlement `no_ads` attached to
  `bag_noads` (the shell reads owned product ids directly, so it isn't required).
- Copy the **public App Store SDK key** (`appl_...`) into `index.html` `PLAT_IDS.rcKey`. The shop
  is hidden in the app until this key is set.

### 5. AdMob
apps.admob.com > Apps > **Add app** > iOS. Choose "not listed yet" until the App Store listing
exists, then link it later. Name it Build a GOAT.
- Copy the **App ID** (`ca-app-pub-...~...`) into **both** `PLAT_IDS.admobApp` in `index.html` and
  `GADApplicationIdentifier` in `native/ios/App/App/Info.plist`.
- Ad units > **Banner** (name "bottom banner") → `PLAT_IDS.banner`.
- Ad units > **Rewarded** (name "double rewards", reward 1 × "double") → `PLAT_IDS.rewarded`.
- Privacy & messaging: publish a GDPR message if you want the EEA consent form (optional; without
  one, EEA users get non-personalized ads).
- Live units fill only after AdMob approves the App Store listing. Until then, test units are what
  you see, which is also why ordinary runs use them.

### 6. GitHub repo secrets
In `Josh17400/build-a-goat`, add the same six secrets The Fort uses (Settings > Secrets and
variables > Actions). Take each value from where you saved it for The Fort or Euchre (the `.p8`
file, the p12 and its password):

```
gh secret set ASC_KEY_ID       --repo Josh17400/build-a-goat --body "<key id>"
gh secret set ASC_ISSUER_ID    --repo Josh17400/build-a-goat --body "<issuer id>"
gh secret set ASC_KEY_P8       --repo Josh17400/build-a-goat --body "$(base64 -w0 AuthKey_<key id>.p8)"
gh secret set APPLE_TEAM_ID    --repo Josh17400/build-a-goat --body "<team id>"
gh secret set IOS_CERT_P12_B64 --repo Josh17400/build-a-goat --body "$(base64 -w0 dist.p12)"
gh secret set CERT_EXPORT_PASS --repo Josh17400/build-a-goat --body "<p12 password>"
```

Nothing secret is committed: `native/.gitignore` blocks `*.p8`, `*.p12`, `*.mobileprovision` and
`*.cer`.

### 7. App Store listing (before review)
- **App Privacy:** Data Used to Track You: Device ID (AdMob, with ATT). Data Not Linked to You:
  Advertising Data, Product Interaction, Purchase History (AdMob and RevenueCat). Diagnostics:
  Crash Data.
- Age rating questionnaire, screenshots (6.9" iPhone), description, keywords, support URL, and a
  privacy policy URL. A privacy policy is required because of ads and purchases.

## Ship a build

```
gh workflow run ios.yml --repo Josh17400/build-a-goat --ref <branch>
gh run watch --repo Josh17400/build-a-goat
```

GitHub only offers a manual workflow once its file is on the default branch (`main`). After that,
`--ref` builds any branch. A TestFlight build works before steps 4 and 5 are done: ads use Google's
test units, and the shop stays hidden until `rcKey` is set. `build_www.py --release` (the `release`
input) refuses to build until every placeholder id is filled in.

The build number is the GitHub run number. "Re-run jobs" keeps that number, so start a new run
instead of re-running one whose upload already reached TestFlight.

## When a run fails

- **Test step:** `node native/test_shell.cjs` and `node native/check_game.cjs` name the failing check.
- **Build step, "AdMob app id mismatch":** `PLAT_IDS.admobApp` and `GADApplicationIdentifier` differ.
- **Build step, "PLACEHOLDER":** a `release` build with an id still empty.
- **Signing:** the `IOS_CERT_P12_B64` / `CERT_EXPORT_PASS` pair was copied wrong, or the shared
  certificate expired (see The Fort's `CI_SETUP.md`, "Renew the distribution certificate").
- **Upload, "Could not find app":** the App Store Connect app record (step 2) doesn't exist yet, or
  the bundle id differs.
