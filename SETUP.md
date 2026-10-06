# WTPSHOP — self-hosted DUI (your own GitHub Pages)

Everything in this folder is ready to publish under **your** GitHub account. No dependency on `veravereaz.github.io/nigzhxc` or `fivemanage.com` for UI assets.

## What’s included

| Item | Notes |
|------|--------|
| `index.html`, `css/`, `js/`, `fonts/`, `images/` | Full static DUI site |
| WTPSHOP branding | Text + toasts in `js/index.b1fe5a1d.973f3.js` |
| Local assets | `images/crosshair.png`, `images/wtp-banner.gif` |
| Banners in JS | Default GIFs point to **your** `royalcdn.pages.dev/titenirobinz/...` (same as Lua) |
| `.nojekyll` | Required for GitHub Pages |

## 1. Create the GitHub repo

1. Log in to GitHub.
2. **New repository** → name: `wtpshop-dui` → **Public** → Create (no README).
3. **Settings** → **Pages** → Build: **Deploy from a branch** → Branch **main**, folder **/ (root)** → Save.

Your live URL will be:

`https://robinzxcc.github.io/wtpshop-dui/`

## 2. Upload this folder

Git is not required. Options:

### GitHub Desktop (easiest on Windows)

1. Install [GitHub Desktop](https://desktop.github.com/).
2. **File → Add local repository** → choose `Downloads\wtpshop-dui`.
3. If prompted, **create a repository** here and set remote to `https://github.com/<YOU>/wtpshop-dui.git`.
4. Commit message: `WTPSHOP DUI initial` → **Push origin**.

### Web (small changes only)

For the first upload (~26 MB), use Desktop or `git` CLI — the website uploader is painful for this size.

## 3. Point your Lua menu at your Pages URL

In `tarubmomaliitrobin-332d591926ab.lua` (already patched):

```lua
local WTPSHOP_DUI_URL = "https://robinzxcc.github.io/wtpshop-dui/"
```

Already set in your Lua file — reload the menu in-game after Pages is live.

## 4. Verify

1. Open your Pages URL in a browser — you should see the WTPSHOP menu UI.
2. Hard refresh: **Ctrl+F5**.
3. After push, wait **1–3 minutes** for Pages to update.

## 5. Customize later

| Change | Where |
|--------|--------|
| Discord footer | Search `discord.gg/wtpshop` in `js/index.b1fe5a1d.973f3.js` |
| Default banner GIF | Replace `images/wtp-banner.gif` or edit URL in JS |
| Crosshair | Replace `images/crosshair.png` |
| In-game banner | Lua `updateBanner` (unchanged) |

## Optional: dev preview

Uncomment in Lua `Initialize()`:

```lua
-- DUI = MachoCreateDui("http://localhost:5173//")
```

Only if you have the original React source and Vite dev server — this repo is the **built** output only.
