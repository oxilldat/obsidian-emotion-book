/* Emotion Book — bundled, не редактировать вручную */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => EmotionBookPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian5 = require("obsidian");

// types.ts
var DEFAULT_EMOTIONS = [
  { label: "Радость", color: "#4caf50", value: 5 },
  { label: "Спокойствие", color: "#2196f3", value: 4 },
  { label: "Нейтрально", color: "#9e9e9e", value: 3 },
  { label: "Тревога", color: "#ff9800", value: 2 },
  { label: "Грусть", color: "#607d8b", value: 1 },
  { label: "Злость", color: "#f44336", value: 0 }
];
var DEFAULT_SETTINGS = {
  emotions: DEFAULT_EMOTIONS,
  language: "ru",
  rootFolder: ""
};

// render.ts
var import_obsidian2 = require("obsidian");

// helpers.ts
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
function colorDot(color, size = 10) {
  const dot = document.createElement("span");
  dot.className = "eb-dot";
  dot.style.background = color;
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;
  return dot;
}
function timeFromIso(isoDateTime) {
  const m = isoDateTime.match(/T(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : "";
}
function findEmotionByValue(emotions, value) {
  if (emotions.length === 0)
    return void 0;
  return emotions.reduce(
    (best, em) => Math.abs(em.value - value) < Math.abs(best.value - value) ? em : best
  );
}

// emotionPicker.ts
function createEmotionPicker(container, emotions, initialLabel) {
  var _a, _b;
  const row = container.createDiv({ cls: "eb-row eb-emotion-picker" });
  const indicator = row.createDiv({ cls: "eb-indicator" });
  const select = row.createEl("select", { cls: "eb-select" });
  for (const em of emotions) {
    select.createEl("option", { value: em.label, text: em.label });
  }
  let current = (_a = emotions.find((e) => e.label === initialLabel)) != null ? _a : emotions[0];
  if (current)
    select.value = current.label;
  indicator.style.background = (_b = current == null ? void 0 : current.color) != null ? _b : "#9e9e9e";
  select.onchange = () => {
    var _a2, _b2;
    current = (_a2 = emotions.find((e) => e.label === select.value)) != null ? _a2 : emotions[0];
    indicator.style.background = (_b2 = current == null ? void 0 : current.color) != null ? _b2 : "#9e9e9e";
  };
  return {
    el: row,
    getSelected: () => current != null ? current : emotions[0]
  };
}

// locales.ts
var ru = {
  entriesToday: (count) => `Записей сегодня: ${count}`,
  addEntry: "Добавить запись",
  textPlaceholder: "Опиши этот момент дня…",
  save: "Сохранить",
  cancel: "Отмена",
  editTitle: "Редактировать",
  deleteTitle: "Удалить",
  emptyTextNotice: "Текст не может быть пустым",
  writeSomethingNotice: "Напиши что-нибудь перед сохранением",
  entryDeletedNotice: "Запись удалена",
  entryUpdatedNotice: "Запись обновлена",
  entrySavedNotice: "Запись сохранена",
  fileNotFoundNotice: "Файл не найден",
  noteUnresolvedNotice: "Не удалось определить текущую заметку",
  settingsHeading: "Emotion Book",
  generalSectionHeading: "Общие",
  emotionsSectionHeading: "Эмоции",
  languageSettingName: "Язык",
  languageSettingDesc: "Язык интерфейса плагина",
  dataFolderSettingName: "Папака",
  dataFolderSettingDesc: "Внутри неё автоматически создаётся подпапка с сегодняшней датой, а в ней — файл записи. Оставь пустым, чтобы папка с датой создавалась прямо в корне хранилища.",
  emotionNamePlaceholder: "Название",
  emotionDefaultName: (index) => `Эмоция ${index}`,
  addEmotionButton: "+ Добавить эмоцию",
  resetSettingName: "Сбросить к стандартным",
  resetButton: "Сбросить"
};
var en = {
  entriesToday: (count) => `Entries today: ${count}`,
  addEntry: "Add entry",
  textPlaceholder: "Describe this moment of your day…",
  save: "Save",
  cancel: "Cancel",
  editTitle: "Edit",
  deleteTitle: "Delete",
  emptyTextNotice: "Text cannot be empty",
  writeSomethingNotice: "Write something before saving",
  entryDeletedNotice: "Entry deleted",
  entryUpdatedNotice: "Entry updated",
  entrySavedNotice: "Entry saved",
  fileNotFoundNotice: "File not found",
  noteUnresolvedNotice: "Could not resolve the current note",
  settingsHeading: "Emotion Book",
  generalSectionHeading: "General",
  emotionsSectionHeading: "Emotions",
  languageSettingName: "Language",
  languageSettingDesc: "Plugin interface language",
  dataFolderSettingName: "Folder",
  dataFolderSettingDesc: "A subfolder named with today’s date is created inside it automatically, and the entry file goes there. Leave empty to create the date folder right in the vault root.",
  emotionNamePlaceholder: "Name",
  emotionDefaultName: (index) => `Emotion ${index}`,
  addEmotionButton: "+ Add emotion",
  resetSettingName: "Reset to defaults",
  resetButton: "Reset"
};
var dictionaries = { ru, en };
function getStrings(lang) {
  var _a;
  return (_a = dictionaries[lang]) != null ? _a : ru;
}

// entryStore.ts
var import_obsidian = require("obsidian");
function pad(n) {
  return String(n).padStart(2, "0");
}
function todayKey() {
  const d = new Date();
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}
function resolveDayKey(noteBasename) {
  let m = noteBasename.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m)
    return `${m[3]}.${m[2]}.${m[1]}`;
  m = noteBasename.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (m)
    return `${m[1]}.${m[2]}.${m[3]}`;
  m = noteBasename.match(/^(\d{2})-(\d{2})-(\d{4})/);
  if (m)
    return `${m[1]}.${m[2]}.${m[3]}`;
  return todayKey();
}
function dayFolderPath(rootFolder, dayKey) {
  const path = rootFolder.trim() ? `${rootFolder.trim()}/${dayKey}` : dayKey;
  return (0, import_obsidian.normalizePath)(path);
}
async function ensureFolder(app, folder) {
  if (!folder || app.vault.getAbstractFileByPath(folder))
    return;
  try {
    await app.vault.createFolder(folder);
  } catch (e) {
  }
}
function nowIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
function yamlDescription(text) {
  if (text.includes("\n")) {
    const indented = text.split("\n").map((l) => "  " + l).join("\n");
    return `description: |-
${indented}`;
  }
  const needsQuotes = /^[\s"'\[{>|#&*!%@`-]/.test(text) || text.includes(": ") || text.includes(" #");
  return needsQuotes ? `description: ${JSON.stringify(text)}` : `description: ${text}`;
}
function buildEntryContent(isoDateTime, text, value) {
  return [
    "---",
    `emotion: ${value}`,
    `date: ${isoDateTime}`,
    yamlDescription(text),
    "---",
    ""
  ].join("\n");
}
function parseEntryFile(content) {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch)
    return null;
  const fm = fmMatch[1];
  const emotionMatch = fm.match(/^emotion:\s*(.+)$/m);
  const dateMatch = fm.match(/^date:\s*(.+)$/m);
  if (!emotionMatch)
    return null;
  const value = parseFloat(emotionMatch[1].trim());
  const isoDateTime = dateMatch ? dateMatch[1].trim().replace(/^"|"$/g, "") : "";
  let text = "";
  const blockMatch = fm.match(/^description:\s*\|-\r?\n([\s\S]*)$/m);
  if (blockMatch) {
    text = blockMatch[1].split("\n").map((l) => l.replace(/^  /, "")).join("\n").replace(/\s+$/, "");
  } else {
    const inlineMatch = fm.match(/^description:\s*(.*)$/m);
    if (inlineMatch) {
      const raw = inlineMatch[1].trim();
      if (raw.startsWith('"')) {
        try {
          text = JSON.parse(raw);
        } catch (e) {
          text = raw;
        }
      } else {
        text = raw;
      }
    }
  }
  return { value: isNaN(value) ? 0 : value, isoDateTime, text };
}
async function listEntriesForDay(app, rootFolder, dayKey) {
  const folder = dayFolderPath(rootFolder, dayKey);
  const files = app.vault.getMarkdownFiles().filter(
    (f) => f.path === folder || f.path.startsWith(folder + "/")
  );
  const result = [];
  for (const f of files) {
    const parsed = parseEntryFile(await app.vault.read(f));
    if (!parsed)
      continue;
    result.push({ file: f, isoDateTime: parsed.isoDateTime, text: parsed.text, value: parsed.value });
  }
  result.sort((a, b) => a.isoDateTime.localeCompare(b.isoDateTime));
  return result;
}
async function createEntryFile(app, rootFolder, text, value) {
  const dayKey = todayKey();
  const folder = dayFolderPath(rootFolder, dayKey);
  await ensureFolder(app, folder);
  const existing = app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(folder + "/")).map((f) => f.basename.match(new RegExp(`^${dayKey.replace(/\./g, "\\.")}-(\\d+)-emotionbook$`))).filter((m) => !!m).map((m) => parseInt(m[1], 10));
  const nextIndex = existing.length > 0 ? Math.max(...existing) + 1 : 1;
  const path = (0, import_obsidian.normalizePath)(`${folder}/${dayKey}-${nextIndex}-emotionbook.md`);
  const content = buildEntryContent(nowIso(), text, value);
  return app.vault.create(path, content);
}
async function updateEntryFile(app, file, isoDateTime, text, value) {
  const content = buildEntryContent(isoDateTime, text, value);
  await app.vault.modify(file, content);
}
async function deleteEntryFile(app, file) {
  await app.vault.trash(file, true);
}

// render.ts
async function renderBlock(host, source, el, ctx) {
  let legacyData = { entries: [] };
  try {
    if (source.trim())
      legacyData = JSON.parse(source);
  } catch (e) {
  }
  el.empty();
  const wrap = el.createDiv({ cls: "eb-wrap" });
  const sourceFile = host.app.vault.getAbstractFileByPath(ctx.sourcePath);
  const noteFile = sourceFile instanceof import_obsidian2.TFile ? sourceFile : null;
  const dayKey = noteFile ? resolveDayKey(noteFile.basename) : null;
  let currentDisplay = [];
  let detailsOpen = false;
  const redraw = async () => {
    const t = getStrings(host.settings.language);
    const existingDetails = wrap.querySelector("details.eb-details");
    if (existingDetails)
      detailsOpen = existingDetails.open;
    wrap.empty();
    const fileEntries = dayKey ? await listEntriesForDay(host.app, host.settings.rootFolder, dayKey) : [];
    currentDisplay = [
      ...legacyData.entries.map((e, index) => ({
        kind: "legacy",
        index,
        time: e.time,
        label: e.emotion,
        value: e.emotionValue,
        color: e.color,
        text: e.text
      })),
      ...fileEntries.map((fe) => {
        var _a, _b;
        const em = findEmotionByValue(host.settings.emotions, fe.value);
        return {
          kind: "file",
          file: fe.file,
          isoDateTime: fe.isoDateTime,
          time: timeFromIso(fe.isoDateTime),
          label: (_a = em == null ? void 0 : em.label) != null ? _a : "—",
          value: fe.value,
          color: (_b = em == null ? void 0 : em.color) != null ? _b : "#9e9e9e",
          text: fe.text
        };
      })
    ].sort((a, b) => a.time.localeCompare(b.time));
    const header = wrap.createDiv({ cls: "eb-header" });
    if (currentDisplay.length > 0) {
      const details = header.createEl("details", { cls: "eb-details" });
      details.open = detailsOpen;
      const summary = details.createEl("summary", { cls: "eb-summary" });
      summary.createSpan({ cls: "eb-summary-label", text: t.entriesToday(currentDisplay.length) });
      const trail = summary.createDiv({ cls: "eb-trail" });
      currentDisplay.forEach((e) => trail.appendChild(colorDot(e.color, 7)));
      const timeline = details.createDiv({ cls: "eb-timeline" });
      currentDisplay.forEach((entry) => renderEntry(host, t, timeline, entry, legacyData, ctx, el, afterMutation));
    }
    renderForm(host, t, wrap, afterMutation);
  };
  const afterMutation = async () => {
    await redraw();
  };
  await redraw();
}
function renderEntry(host, t, container, entry, legacyData, ctx, rootEl, afterMutation) {
  const item = container.createDiv({ cls: "eb-timeline-item" });
  const timelineDot = item.createDiv({ cls: "eb-timeline-dot" });
  timelineDot.style.background = entry.color;
  const card = item.createDiv({ cls: "eb-entry" });
  card.style.background = hexToRgba(entry.color, 0.08);
  card.style.borderLeftColor = entry.color;
  const head = card.createDiv({ cls: "eb-entry-head" });
  head.createSpan({ cls: "eb-time", text: entry.time });
  head.createSpan({ cls: "eb-emotion", text: entry.label });
  const editBtn = head.createEl("button", { cls: "eb-icon-btn", text: "✏️" });
  editBtn.title = t.editTitle;
  const delBtn = head.createEl("button", { cls: "eb-icon-btn eb-del-btn", text: "🗑️" });
  delBtn.title = t.deleteTitle;
  card.createEl("p", { cls: "eb-text", text: entry.text });
  delBtn.onclick = async () => {
    if (entry.kind === "legacy") {
      legacyData.entries.splice(entry.index, 1);
      await host.saveBlock(ctx, rootEl, legacyData, host.settings.language);
    } else {
      await deleteEntryFile(host.app, entry.file);
    }
    await afterMutation();
    new import_obsidian2.Notice(t.entryDeletedNotice);
  };
  editBtn.onclick = () => {
    var _a, _b;
    const editWrap = card.createDiv({ cls: "eb-edit-wrap" });
    (_a = card.querySelector(".eb-entry-head")) == null ? void 0 : _a.setAttr("style", "display:none");
    (_b = card.querySelector(".eb-text")) == null ? void 0 : _b.setAttr("style", "display:none");
    const picker = createEmotionPicker(editWrap, host.settings.emotions, entry.label);
    const ta = editWrap.createEl("textarea", { cls: "eb-textarea" });
    ta.value = entry.text;
    const btnRow = editWrap.createDiv({ cls: "eb-row" });
    const saveBtn = btnRow.createEl("button", { cls: "eb-btn", text: t.save });
    const cancelBtn = btnRow.createEl("button", { cls: "eb-btn eb-cancel", text: t.cancel });
    cancelBtn.onclick = () => {
      var _a2, _b2;
      editWrap.remove();
      (_a2 = card.querySelector(".eb-entry-head")) == null ? void 0 : _a2.removeAttribute("style");
      (_b2 = card.querySelector(".eb-text")) == null ? void 0 : _b2.removeAttribute("style");
    };
    saveBtn.onclick = async () => {
      const newText = ta.value.trim();
      if (!newText) {
        new import_obsidian2.Notice(t.emptyTextNotice);
        return;
      }
      const emObj = picker.getSelected();
      if (entry.kind === "legacy") {
        legacyData.entries[entry.index] = {
          ...legacyData.entries[entry.index],
          emotion: emObj.label,
          emotionValue: emObj.value,
          color: emObj.color,
          text: newText
        };
        await host.saveBlock(ctx, rootEl, legacyData, host.settings.language);
      } else {
        await updateEntryFile(host.app, entry.file, entry.isoDateTime, newText, emObj.value);
      }
      await afterMutation();
      new import_obsidian2.Notice(t.entryUpdatedNotice);
    };
  };
}
function renderForm(host, t, wrap, afterMutation) {
  var _a;
  const form = wrap.createDiv({ cls: "eb-form" });
  const picker = createEmotionPicker(form, host.settings.emotions, (_a = host.settings.emotions[0]) == null ? void 0 : _a.label);
  const addBtn = picker.el.createEl("button", { cls: "eb-btn eb-add-btn", text: t.addEntry });
  const textarea = form.createEl("textarea", { cls: "eb-textarea", placeholder: t.textPlaceholder });
  addBtn.onclick = async () => {
    const text = textarea.value.trim();
    if (!text) {
      new import_obsidian2.Notice(t.writeSomethingNotice);
      return;
    }
    const emObj = picker.getSelected();
    await createEntryFile(host.app, host.settings.rootFolder, text, emObj.value);
    await afterMutation();
    textarea.value = "";
    new import_obsidian2.Notice(t.entrySavedNotice);
  };
}

// save.ts
var import_obsidian3 = require("obsidian");
var BlockSaver = class {
  constructor(app) {
    this.app = app;
    this.savingPaths = /* @__PURE__ */ new Set();
  }
  async save(ctx, rootEl, data, lang) {
    const sourcePath = ctx.sourcePath;
    if (this.savingPaths.has(sourcePath))
      return;
    this.savingPaths.add(sourcePath);
    try {
      const file = this.app.vault.getAbstractFileByPath(sourcePath);
      if (!file) {
        new import_obsidian3.Notice(getStrings(lang).fileNotFoundNotice);
        return;
      }
      const info = ctx.getSectionInfo(rootEl);
      let content = await this.app.vault.read(file);
      const newBlock = `\`\`\`emotion-book
${JSON.stringify(data, null, 2)}
\`\`\``;
      if (info) {
        const lines = content.split("\n");
        lines.splice(info.lineStart, info.lineEnd - info.lineStart + 1, newBlock);
        content = lines.join("\n");
      } else {
        const blockRe = /```emotion-book\n[\s\S]*?```/;
        content = blockRe.test(content) ? content.replace(blockRe, newBlock) : content + "\n" + newBlock;
      }
      await this.app.vault.modify(file, content);
    } finally {
      this.savingPaths.delete(sourcePath);
    }
  }
};

// settings.ts
var import_obsidian4 = require("obsidian");
var EmotionBookSettingTab = class extends import_obsidian4.PluginSettingTab {
  constructor(app, host) {
    super(app, host);
    this.host = host;
  }
  display() {
    const { containerEl } = this;
    const t = getStrings(this.host.settings.language);
    containerEl.empty();
    new import_obsidian4.Setting(containerEl).setName(t.generalSectionHeading).setHeading();
    new import_obsidian4.Setting(containerEl).setName(t.languageSettingName).setDesc(t.languageSettingDesc).addDropdown(
      (dd) => dd.addOption("ru", "Русский").addOption("en", "English").setValue(this.host.settings.language).onChange(async (v) => {
        this.host.settings.language = v;
        await this.host.saveSettings();
        this.display();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(t.dataFolderSettingName).setDesc(t.dataFolderSettingDesc).addText(
      (text) => text.setPlaceholder("папка1/папка2").setValue(this.host.settings.rootFolder).onChange(async (v) => {
        this.host.settings.rootFolder = v.trim();
        await this.host.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(t.emotionsSectionHeading).setHeading();
    const emotions = this.host.settings.emotions;
    for (let i = 0; i < emotions.length; i++) {
      const em = emotions[i];
      const s = new import_obsidian4.Setting(containerEl).setName(em.label || t.emotionDefaultName(i + 1));
      s.addText(
        (text) => text.setPlaceholder(t.emotionNamePlaceholder).setValue(em.label).onChange(async (v) => {
          emotions[i].label = v;
          await this.host.saveSettings();
          s.setName(v || t.emotionDefaultName(i + 1));
        })
      );
      s.addText((text) => {
        text.inputEl.type = "number";
        text.inputEl.style.width = "60px";
        text.setValue(String(em.value)).setPlaceholder("0–10");
        text.onChange(async (v) => {
          const n = parseFloat(v);
          if (!isNaN(n)) {
            emotions[i].value = n;
            await this.host.saveSettings();
          }
        });
      });
      s.addColorPicker(
        (cp) => cp.setValue(em.color).onChange(async (v) => {
          emotions[i].color = v;
          await this.host.saveSettings();
        })
      );
      s.addButton(
        (b) => b.setIcon("trash").setWarning().onClick(async () => {
          emotions.splice(i, 1);
          await this.host.saveSettings();
          this.display();
        })
      );
    }
    new import_obsidian4.Setting(containerEl).addButton(
      (b) => b.setButtonText(t.addEmotionButton).onClick(async () => {
        emotions.push({ label: "Новая", color: "#888888", value: 3 });
        await this.host.saveSettings();
        this.display();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(t.resetSettingName).addButton(
      (b) => b.setButtonText(t.resetButton).setWarning().onClick(async () => {
        this.host.settings.emotions = [...DEFAULT_EMOTIONS];
        await this.host.saveSettings();
        this.display();
      })
    );
  }
};

// main.ts
var EmotionBookPlugin = class extends import_obsidian5.Plugin {
  async onload() {
    await this.loadSettings();
    this.saver = new BlockSaver(this.app);
    this.addSettingTab(new EmotionBookSettingTab(this.app, this));
    this.registerMarkdownCodeBlockProcessor(
      "emotion-book",
      (source, el, ctx) => renderBlock(this, source, el, ctx)
    );
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  saveBlock(ctx, rootEl, data, lang) {
    return this.saver.save(ctx, rootEl, data, lang);
  }
};