# Editing the game data

All of the game's content lives in [`datasets.json`](datasets.json). Edit that
file and reload the game — nothing in `game.html` needs to change.

## Shape

```json
{
  "datasets": [
    {
      "key": "cold-war",
      "label": "The Cold War",
      "icon": "🗺️",
      "sub": "Yalta to the fall of the USSR",
      "events": [
        {
          "title": "Truman Doctrine",
          "date": "1947-03-12",
          "description": "Truman pledges support to nations resisting communism, committing the US to containment.",
          "image": "https://upload.wikimedia.org/..."
        }
      ]
    }
  ]
}
```

## Fields

**Dataset**

| Field | Required | Notes |
|---|---|---|
| `key` | yes | Unique short id. Not shown to players. |
| `label` | yes | Title on the "Choose a dataset" screen. |
| `icon` | no | One emoji. Defaults to 📜. |
| `sub` | no | One-line description. Falls back to an event count. |
| `events` | yes | See below. A dataset with no valid events is skipped. |

**Event**

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Shown on the card. |
| `date` | yes | `YYYY-MM-DD` preferred. A bare year (`"1947"`) also works and displays as `1947 AD`. **An event without a date is dropped** — the date is what the game sorts on. |
| `description` | no | Shown when a player clicks a placed card. |
| `image` | no | Direct image URL. If omitted, the game looks one up on Wikipedia by title. See the Wikimedia note below. |

There is no `id` field: ids are assigned automatically at load time, so you never
have to keep numbers unique by hand.

## Using Wikimedia images

Wikimedia **rejects hotlinked thumbnails at arbitrary widths**. A URL like
`.../thumb/a/a5/Foo.jpg/400px-Foo.jpg` returns an error page reading
*"Use thumbnail sizes listed on https://w.wiki/GHai"*, because `400` is not a
standard size. Only these widths work:

```
20  40  60  120  250  330  500  960  1280  1920  3840
```

`500px-` is the right choice for this game — it matches the largest place an
image is shown (the card detail popup).

The reliable way to get a working URL is to let Wikipedia generate one rather
than typing a width yourself:

```
https://en.wikipedia.org/w/api.php?action=query&titles=Berlin_Wall&prop=pageimages&piprop=thumbnail&pithumbsize=500&format=json
```

Use the `thumbnail.source` value from the response, minus any `?utm_...` query
string. Simplest of all: **omit `image` entirely** and let the game do this
lookup itself at load time.

## Adding a dataset

Append another object to the `datasets` array. It appears on the picker screen
automatically — the list is built from this file.

## Things worth knowing

- The file must be valid JSON: double quotes only, no trailing commas, no
  comments. If it fails to parse, the menu shows "UNAVAILABLE" with the reason.
- Save as UTF-8 so accents and emoji survive (`Blücher`, `🗺️`).
- Dates are only compared to each other, so precision can vary between events in
  the same dataset.
- The game is served over HTTP, so this file is fetched at runtime. Opening
  `game.html` directly from disk (`file://`) will fail on browser security rules
  — use a local server:

```bash
python -m http.server 8000
```
