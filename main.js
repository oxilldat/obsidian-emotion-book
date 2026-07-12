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
var import_obsidian = require("obsidian");
var DEFAULT_EMOTIONS = [
  { label: "\u0420\u0430\u0434\u043E\u0441\u0442\u044C", color: "#4caf50", value: 5 },
  { label: "\u0421\u043F\u043E\u043A\u043E\u0439\u0441\u0442\u0432\u0438\u0435", color: "#2196f3", value: 4 },
  { label: "\u041D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u043E", color: "#9e9e9e", value: 3 },
  { label: "\u0422\u0440\u0435\u0432\u043E\u0433\u0430", color: "#ff9800", value: 2 },
  { label: "\u0413\u0440\u0443\u0441\u0442\u044C", color: "#607d8b", value: 1 },
  { label: "\u0417\u043B\u043E\u0441\u0442\u044C", color: "#f44336", value: 0 }
];
var DEFAULT_SETTINGS = { emotions: DEFAULT_EMOTIONS };
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
var EmotionBookPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.detailsOpen = /* @__PURE__ */ new Map();
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new EmotionBookSettingTab(this.app, this));
    this.registerMarkdownCodeBlockProcessor(
      "emotion-book",
      (source, el, ctx) => this.renderBlock(source, el, ctx)
    );
    this.addStyle();
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  // ─── Рендер блока ──────────────────────────────────────────────────────────
  async renderBlock(source, el, ctx) {
    let data = { entries: [] };
    try {
      if (source.trim())
        data = JSON.parse(source);
    } catch (e) {
    }
    el.empty();
    const wrap = el.createDiv({ cls: "eb-wrap" });
    if (data.entries.length > 0) {
      const details = wrap.createEl("details", { cls: "eb-details" });
      if (this.detailsOpen.get(ctx.sourcePath))
        details.open = true;
      details.addEventListener("toggle", () => {
        this.detailsOpen.set(ctx.sourcePath, details.open);
      });
      details.createEl("summary", { cls: "eb-summary", text: `\u0417\u0430\u043F\u0438\u0441\u0435\u0439 \u0441\u0435\u0433\u043E\u0434\u043D\u044F: ${data.entries.length}` });
      const list = details.createDiv({ cls: "eb-entries" });
      data.entries.forEach((e, i) => {
        this.renderEntry(list, e, i, data, ctx);
      });
    }
    this.renderForm(wrap, data, ctx);
  }
  // ─── Рендер одной записи ───────────────────────────────────────────────────
  renderEntry(container, e, index, data, ctx) {
    const row = container.createDiv({ cls: "eb-entry" });
    row.style.background = hexToRgba(e.color, 0.08);
    row.style.borderLeft = `3px solid ${e.color}`;
    const head = row.createDiv({ cls: "eb-entry-head" });
    head.appendChild(colorDot(e.color));
    head.createSpan({ cls: "eb-time", text: e.time });
    head.createSpan({ cls: "eb-emotion", text: e.emotion });
    const editBtn = head.createEl("button", { cls: "eb-icon-btn", text: "\u270F\uFE0F" });
    editBtn.title = "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C";
    const delBtn = head.createEl("button", { cls: "eb-icon-btn eb-del-btn", text: "\u{1F5D1}\uFE0F" });
    delBtn.title = "\u0423\u0434\u0430\u043B\u0438\u0442\u044C";
    const textEl = row.createEl("p", { cls: "eb-text", text: e.text });
    delBtn.onclick = async () => {
      data.entries.splice(index, 1);
      await this.saveBlock(ctx.sourcePath, data);
    };
    editBtn.onclick = () => {
      textEl.hide();
      editBtn.hide();
      delBtn.hide();
      const editWrap = row.createDiv({ cls: "eb-edit-wrap" });
      const editRow = editWrap.createDiv({ cls: "eb-row" });
      const sel = editRow.createEl("select", { cls: "eb-select" });
      for (const em of this.settings.emotions) {
        const opt = sel.createEl("option", { value: em.label, text: em.label });
        if (em.label === e.emotion)
          opt.selected = true;
      }
      const ta = editWrap.createEl("textarea", { cls: "eb-textarea" });
      ta.value = e.text;
      const btnRow = editWrap.createDiv({ cls: "eb-row" });
      const saveBtn = btnRow.createEl("button", { cls: "eb-btn", text: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" });
      const cancelBtn = btnRow.createEl("button", { cls: "eb-btn eb-cancel", text: "\u041E\u0442\u043C\u0435\u043D\u0430" });
      cancelBtn.onclick = () => {
        editWrap.remove();
        textEl.show();
        editBtn.show();
        delBtn.show();
      };
      saveBtn.onclick = async () => {
        var _a;
        const newText = ta.value.trim();
        if (!newText) {
          new import_obsidian.Notice("\u041D\u0430\u043F\u0438\u0448\u0438 \u0447\u0442\u043E-\u043D\u0438\u0431\u0443\u0434\u044C \u043F\u0435\u0440\u0435\u0434 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u043C");
          return;
        }
        const emObj = (_a = this.settings.emotions.find((em) => em.label === sel.value)) != null ? _a : this.settings.emotions[0];
        data.entries[index] = {
          ...data.entries[index],
          emotion: emObj.label,
          emotionValue: emObj.value,
          color: emObj.color,
          text: newText
        };
        await this.saveBlock(ctx.sourcePath, data);
      };
    };
  }
  // ─── Форма добавления ──────────────────────────────────────────────────────
  renderForm(wrap, data, ctx) {
    const form = wrap.createDiv({ cls: "eb-form" });
    const row = form.createDiv({ cls: "eb-row" });
    const indicator = row.createDiv({ cls: "eb-indicator" });
    const select = row.createEl("select", { cls: "eb-select" });
    for (const em of this.settings.emotions) {
      select.createEl("option", { value: em.label, text: em.label });
    }
    const btn = row.createEl("button", { cls: "eb-btn", text: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u044C" });
    const textarea = form.createEl("textarea", {
      cls: "eb-textarea",
      placeholder: "\u041E\u043F\u0438\u0448\u0438 \u044D\u0442\u043E\u0442 \u043C\u043E\u043C\u0435\u043D\u0442 \u0434\u043D\u044F\u2026"
    });
    const updateIndicator = () => {
      var _a;
      const found = this.settings.emotions.find((e) => e.label === select.value);
      indicator.style.background = (_a = found == null ? void 0 : found.color) != null ? _a : "#9e9e9e";
    };
    updateIndicator();
    select.onchange = updateIndicator;
    btn.onclick = async () => {
      var _a;
      const text = textarea.value.trim();
      if (!text) {
        new import_obsidian.Notice("\u041D\u0430\u043F\u0438\u0448\u0438 \u0447\u0442\u043E-\u043D\u0438\u0431\u0443\u0434\u044C \u043F\u0435\u0440\u0435\u0434 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u043C");
        return;
      }
      const emObj = (_a = this.settings.emotions.find((e) => e.label === select.value)) != null ? _a : this.settings.emotions[0];
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      data.entries.push({
        time,
        emotion: emObj.label,
        emotionValue: emObj.value,
        color: emObj.color,
        text
      });
      await this.saveBlock(ctx.sourcePath, data);
      textarea.value = "";
    };
  }
  // ─── Сохранение ────────────────────────────────────────────────────────────
  async saveBlock(sourcePath, data) {
    const file = this.app.vault.getAbstractFileByPath(sourcePath);
    if (!file) {
      return;
    }
    let content = await this.app.vault.read(file);
    const blockRe = /```emotion-book\n[\s\S]*?```/;
    const newBlock = `\`\`\`emotion-book
${JSON.stringify(data, null, 2)}
\`\`\``;
    content = content.match(blockRe) ? content.replace(blockRe, newBlock) : content + "\n" + newBlock;
    const avg = data.entries.length ? data.entries.reduce((s, e) => s + e.emotionValue, 0) / data.entries.length : 3;
    const best = this.settings.emotions.reduce(
      (a, b) => Math.abs(b.value - avg) < Math.abs(a.value - avg) ? b : a
    );
    content = this.setFrontmatterKey(content, "emotion", best.label);
    await this.app.vault.modify(file, content);
  }
  // ─── Frontmatter ───────────────────────────────────────────────────────────
  setFrontmatterKey(content, key, value) {
    const fmRe = /^---\r?\n([\s\S]*?)\r?\n---/;
    const match = content.match(fmRe);
    if (!match)
      return `---
${key}: "${value}"
---

` + content;
    const fm = match[1];
    const keyRe = new RegExp(`^${key}:.*$`, "m");
    const newLine = `${key}: "${value}"`;
    const newFm = keyRe.test(fm) ? fm.replace(keyRe, newLine) : fm + "\n" + newLine;
    return content.replace(fmRe, `---
${newFm}
---`);
  }
  // ─── Стили ─────────────────────────────────────────────────────────────────
  addStyle() {
    const css = `
.eb-wrap { font-family: var(--font-interface); }

/* \u041A\u043E\u043B\u043B\u0430\u043F\u0441 */
.eb-details { margin-bottom: 12px; }
.eb-summary { cursor: pointer; font-size: .8em; opacity: .5; user-select: none; padding: 2px 0; }
.eb-summary:hover { opacity: .8; }

/* \u0417\u0430\u043F\u0438\u0441\u0438 */
.eb-entries   { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
.eb-entry     { padding: 10px 12px; border-radius: 8px; }
.eb-entry-head { display: flex; align-items: center; gap: 6px; }
.eb-time      { font-size: .72em; opacity: .5; }
.eb-emotion   { font-weight: 600; font-size: .82em; flex: 1; }
.eb-text      { margin: 6px 0 0; font-size: .88em; line-height: 1.5; }

/* \u041A\u0440\u0443\u0436\u043E\u043A */
.eb-dot { display: inline-block; border-radius: 50%; flex-shrink: 0; }

/* \u041A\u043D\u043E\u043F\u043A\u0438 \u0438\u043A\u043E\u043D\u043A\u0438 */
.eb-icon-btn  { background: none; border: none; cursor: pointer; font-size: .85em; opacity: .4; padding: 0 2px; }
.eb-icon-btn:hover { opacity: 1; }
.eb-del-btn:hover  { color: #f44336; }

/* \u0424\u043E\u0440\u043C\u0430 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F */
.eb-edit-wrap { margin-top: 8px; display: flex; flex-direction: column; gap: 6px; }

/* \u0424\u043E\u0440\u043C\u0430 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F */
.eb-form { display: flex; flex-direction: column; gap: 8px; }
.eb-row  { display: flex; gap: 8px; align-items: center; }

/* \u0418\u043D\u0434\u0438\u043A\u0430\u0442\u043E\u0440 \u0446\u0432\u0435\u0442\u0430 */
.eb-indicator { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

.eb-select   { flex: 1; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal); font-size: .9em; }
.eb-textarea { resize: vertical; min-height: 72px; padding: 8px 10px; border-radius: 6px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal); font-size: .9em; }
.eb-btn      { white-space: nowrap; padding: 6px 14px; border-radius: 6px; background: var(--color-accent); color: #fff; border: none; cursor: pointer; font-size: .88em; }
.eb-btn:hover { opacity: .85; }
.eb-cancel   { background: var(--background-modifier-border); color: var(--text-normal); }

/* \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 */
.eb-settings-header { margin-bottom: 16px; }
.eb-settings-header h2 { margin: 0 0 2px; padding-top: 0; }
.eb-settings-desc { margin: 0; font-size: .85em; opacity: .6; }
.eb-settings-btnrow { display: flex; gap: 8px; margin-top: 16px; }
`;
    const style = document.createElement("style");
    style.id = "emotion-book-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }
  onunload() {
    var _a;
    (_a = document.getElementById("emotion-book-styles")) == null ? void 0 : _a.remove();
  }
};
var EmotionBookSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    for (let i = 0; i < this.plugin.settings.emotions.length; i++) {
      const em = this.plugin.settings.emotions[i];
      const s = new import_obsidian.Setting(containerEl).setName(em.label || `\u042D\u043C\u043E\u0446\u0438\u044F ${i + 1}`);
      s.addText(
        (t) => t.setPlaceholder("\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435").setValue(em.label).onChange(async (v) => {
          this.plugin.settings.emotions[i].label = v;
          await this.plugin.saveSettings();
          s.setName(v || `\u042D\u043C\u043E\u0446\u0438\u044F ${i + 1}`);
        })
      );
      s.addText((t) => {
        t.inputEl.type = "number";
        t.inputEl.style.width = "60px";
        t.setValue(String(em.value)).setPlaceholder("0\u201310");
        t.onChange(async (v) => {
          const n = parseFloat(v);
          if (!isNaN(n)) {
            this.plugin.settings.emotions[i].value = n;
            await this.plugin.saveSettings();
          }
        });
      });
      s.addColorPicker(
        (cp) => cp.setValue(em.color).onChange(async (v) => {
          this.plugin.settings.emotions[i].color = v;
          await this.plugin.saveSettings();
        })
      );
      s.addButton(
        (b) => b.setIcon("trash").setWarning().onClick(async () => {
          this.plugin.settings.emotions.splice(i, 1);
          await this.plugin.saveSettings();
          this.display();
        })
      );
    }
    const btnRow = containerEl.createDiv({ cls: "eb-settings-btnrow" });
    const addBtn = btnRow.createEl("button", { text: "+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u044D\u043C\u043E\u0446\u0438\u044E", cls: "mod-cta" });
    addBtn.onclick = async () => {
      this.plugin.settings.emotions.push({ label: "\u041D\u043E\u0432\u0430\u044F", color: "#888888", value: 3 });
      await this.plugin.saveSettings();
      this.display();
    };
    const resetBtn = btnRow.createEl("button", { text: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C", cls: "mod-warning" });
    resetBtn.onclick = async () => {
      this.plugin.settings.emotions = [...DEFAULT_EMOTIONS];
      await this.plugin.saveSettings();
      this.display();
    };
  }
};
