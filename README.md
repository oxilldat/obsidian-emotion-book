# Emotion Book

**Emotion Book** is a plugin for [Obsidian](https://obsidian.md) that adds structure to your daily notes. Record your state throughout the day, track dynamics, and store entries directly in separate Markdown files.

## Key Features

* **Convenient Entry and Timeline:** Add entries in a couple of clicks and view a chronological feed of the day right inside your daily note.
* **Flexible Emotion Customization:** Create your own emotions, adjust their colors, and assign custom weights.
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

## Settings

In the plugin settings (Settings → Emotion Book), you can configure:

1. Language: Switch between Russian and English interface languages.
2. Data Folder: Path to the folder where entry files will be automatically created.
3. Emotion List: Manage the name, color, and numerical value of each emotion.
4. Reset: Quick reset back to the default set of emotions.

## Support

If you would like to support me and my work, you can subscribe to my social media or donate via Boosty:

* [https://t.me/oxilldat](https://t.me/oxilldat)
* [https://boosty.to/oxilldat](https://boosty.to/oxilldat)
