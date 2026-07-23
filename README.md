# Emotion Book

- English
- [Русский](README.RU.md)

**Emotion Book** is a plugin for [Obsidian](https://obsidian.md) that adds structure to your daily notes. Record your state throughout the day, track dynamics, and store entries directly in separate Markdown files.

![alt text](<image/Cap 2026-07-16 at 19.31.58.gif>)

## Key Features

* **Quick entry via a dialog:** Pick an emotion from the list, click **Add entry**, and type your note in a pop-up window. The chronological feed of the day is shown right below, inside your daily note.
* **Flexible Emotion Customization:** Create your own emotions, adjust their colors, and assign custom weights (0–10).
* **Smart note date:** Each entry is saved to the folder of the day its note belongs to. The day is detected from a frontmatter field (configurable, `created` by default), then from the file name, then from the file creation date.
* **Clean Markdown:** All new entries are saved as individual `.md` files with clean YAML Frontmatter (tags, date, emotion), making them easy to analyze via Dataview or other plugins.
* **Legacy Format Support:** Full compatibility with `emotion-book` blocks containing JSON data directly inside the code block.
* **Bilingual Interface:** Full support for Russian and English languages.

## Installation

### Manual Installation

1. Download `main.js`, `styles.css`, and `manifest.json` from the latest release.
2. Navigate to your Obsidian vault directory: `.obsidian/plugins/`
3. Create an `emotion-book` folder and copy the downloaded files into it.

### Automatic Installation

1. Open the Obsidian Community Plugins store.
2. Search for the plugin.
3. Click Install.

## Usage

Adding a block to a page

To embed the emotion diary into a daily (or any other) note, add the following code block:

````
```emotion-book
```
````

![alt text](<image/Cap 2026-07-16 at 19.22.03.gif>)

Then it works like this: choose an emotion in the drop-down, click **Add entry**, write a few words in the dialog, and save. The entry appears in the day's timeline right below.

## Settings

In the plugin settings (Settings → Emotion Book), you can configure:

1. Language: Switch between Russian and English interface languages.
2. Folder: Path to the folder where entry files will be automatically created.
3. Frontmatter date field: Name of the note's frontmatter field used as the entry's date (default `created`). If it is missing, the date falls back to the file name, then to the file creation date.
4. Emotion List: Manage the name, color, and numerical value (0–10) of each emotion.
5. Reset: Quick reset back to the default set of emotions.

## Support

If you would like to support me and my work, you can subscribe to my social media or donate via Boosty:

* [https://t.me/oxilldat](https://t.me/oxilldat)
* [https://boosty.to/oxilldat](https://boosty.to/oxilldat)
