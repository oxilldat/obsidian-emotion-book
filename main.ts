import { Plugin, MarkdownPostProcessorContext, TFile, Notice, PluginSettingTab, App, Setting } from 'obsidian';

// ─── Типы ────────────────────────────────────────────────────────────────────

interface EmotionConfig {
  label: string;
  color: string;
  value: number;
}

interface EmotionBookSettings {
  emotions: EmotionConfig[];
}

interface EmotionEntry {
  time: string;
  emotion: string;
  emotionValue: number;
  color: string;
  text: string;
}

interface EmotionBookData {
  entries: EmotionEntry[];
}

// ─── Дефолтные эмоции ────────────────────────────────────────────────────────

const DEFAULT_EMOTIONS: EmotionConfig[] = [
  { label: 'Радость',     color: '#4caf50', value: 5 },
  { label: 'Спокойствие', color: '#2196f3', value: 4 },
  { label: 'Нейтрально',  color: '#9e9e9e', value: 3 },
  { label: 'Тревога',     color: '#ff9800', value: 2 },
  { label: 'Грусть',      color: '#607d8b', value: 1 },
  { label: 'Злость',      color: '#f44336', value: 0 },
];

const DEFAULT_SETTINGS: EmotionBookSettings = { emotions: DEFAULT_EMOTIONS };

// ─── Хелперы ─────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function colorDot(color: string, size = 10): HTMLElement {
  const dot = document.createElement('span');
  dot.className = 'eb-dot';
  dot.style.background = color;
  dot.style.width  = `${size}px`;
  dot.style.height = `${size}px`;
  return dot;
}

// ─── Главный класс ───────────────────────────────────────────────────────────

export default class EmotionBookPlugin extends Plugin {
  settings: EmotionBookSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new EmotionBookSettingTab(this.app, this));
    this.registerMarkdownCodeBlockProcessor(
      'emotion-book',
      (source, el, ctx) => this.renderBlock(source, el, ctx)
    );
    this.addStyle();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() { await this.saveData(this.settings); }

  // ─── Рендер блока ──────────────────────────────────────────────────────────

  async renderBlock(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
    let data: EmotionBookData = { entries: [] };
    try { if (source.trim()) data = JSON.parse(source); } catch {}

    el.empty();
    const wrap = el.createDiv({ cls: 'eb-wrap' });

    // Коллапс с записями
    if (data.entries.length > 0) {
      const details = wrap.createEl('details', { cls: 'eb-details' });
      details.createEl('summary', { cls: 'eb-summary', text: `Записей сегодня: ${data.entries.length}` });
      const list = details.createDiv({ cls: 'eb-entries' });

      data.entries.forEach((e, i) => {
        this.renderEntry(list, e, i, data, ctx);
      });
    }

    // Форма добавления
    this.renderForm(wrap, data, ctx);
  }

  // ─── Рендер одной записи ───────────────────────────────────────────────────

  renderEntry(
    container: HTMLElement,
    e: EmotionEntry,
    index: number,
    data: EmotionBookData,
    ctx: MarkdownPostProcessorContext
  ) {
    const row = container.createDiv({ cls: 'eb-entry' });
    row.style.background = hexToRgba(e.color, 0.08);
    row.style.borderLeft = `3px solid ${e.color}`;

    // Шапка записи
    const head = row.createDiv({ cls: 'eb-entry-head' });
    head.appendChild(colorDot(e.color));
    head.createSpan({ cls: 'eb-time',    text: e.time });
    head.createSpan({ cls: 'eb-emotion', text: e.emotion });

    // Кнопка редактировать
    const editBtn = head.createEl('button', { cls: 'eb-icon-btn', text: '✏️' });
    editBtn.title = 'Редактировать';

    // Кнопка удалить
    const delBtn = head.createEl('button', { cls: 'eb-icon-btn eb-del-btn', text: '🗑️' });
    delBtn.title = 'Удалить';

    // Текст записи
    const textEl = row.createEl('p', { cls: 'eb-text', text: e.text });

    // ── Удаление ──
    delBtn.onclick = async () => {
      data.entries.splice(index, 1);
      await this.saveBlock(ctx.sourcePath, data);
      new Notice('Запись удалена');
    };

    // ── Редактирование ──
    editBtn.onclick = () => {
      // Прячем текст и шапку, рисуем форму редактирования
      textEl.hide();
      editBtn.hide();
      delBtn.hide();

      const editWrap = row.createDiv({ cls: 'eb-edit-wrap' });

      // Select эмоции
      const editRow = editWrap.createDiv({ cls: 'eb-row' });
      const sel = editRow.createEl('select', { cls: 'eb-select' });
      for (const em of this.settings.emotions) {
        const opt = sel.createEl('option', { value: em.label, text: em.label });
        if (em.label === e.emotion) opt.selected = true;
      }

      // Textarea
      const ta = editWrap.createEl('textarea', { cls: 'eb-textarea' });
      ta.value = e.text;

      // Кнопки сохранить / отмена
      const btnRow = editWrap.createDiv({ cls: 'eb-row' });
      const saveBtn   = btnRow.createEl('button', { cls: 'eb-btn',          text: 'Сохранить' });
      const cancelBtn = btnRow.createEl('button', { cls: 'eb-btn eb-cancel', text: 'Отмена'   });

      cancelBtn.onclick = () => {
        editWrap.remove();
        textEl.show();
        editBtn.show();
        delBtn.show();
      };

      saveBtn.onclick = async () => {
        const newText = ta.value.trim();
        if (!newText) { new Notice('Текст не может быть пустым'); return; }

        const emObj = this.settings.emotions.find(em => em.label === sel.value)
                   ?? this.settings.emotions[0];

        data.entries[index] = {
          ...data.entries[index],
          emotion:      emObj.label,
          emotionValue: emObj.value,
          color:        emObj.color,
          text:         newText,
        };

        await this.saveBlock(ctx.sourcePath, data);
        new Notice('Запись обновлена ✓');
      };
    };
  }

  // ─── Форма добавления ──────────────────────────────────────────────────────

  renderForm(wrap: HTMLElement, data: EmotionBookData, ctx: MarkdownPostProcessorContext) {
    const form = wrap.createDiv({ cls: 'eb-form' });
    const row  = form.createDiv({ cls: 'eb-row' });

    const select = row.createEl('select', { cls: 'eb-select' });
    for (const em of this.settings.emotions) {
      const opt = select.createEl('option', { value: em.label });
      const dotWrap = document.createElement('span');
      opt.text = `⬤ ${em.label}`;
      opt.style.color = em.color;
      select.appendChild(opt);
    }

    const btn = row.createEl('button', { cls: 'eb-btn', text: 'Добавить запись' });

    const textarea = form.createEl('textarea', {
      cls: 'eb-textarea',
      placeholder: 'Опиши этот момент дня…',
    });

    // Цветной индикатор выбранной эмоции рядом с select
    const indicator = row.createDiv({ cls: 'eb-indicator' });
    const updateIndicator = () => {
      const found = this.settings.emotions.find(e => e.label === select.value);
      indicator.style.background = found?.color ?? '#9e9e9e';
    };
    updateIndicator();
    select.onchange = updateIndicator;

    btn.onclick = async () => {
      const text = textarea.value.trim();
      if (!text) { new Notice('Напиши что-нибудь перед сохранением'); return; }

      const emObj = this.settings.emotions.find(e => e.label === select.value)
                 ?? this.settings.emotions[0];
      const now  = new Date();
      const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

      data.entries.push({
        time,
        emotion:      emObj.label,
        emotionValue: emObj.value,
        color:        emObj.color,
        text,
      });

      await this.saveBlock(ctx.sourcePath, data);
      textarea.value = '';
      new Notice('Запись сохранена ✓');
    };
  }

  // ─── Сохранение ────────────────────────────────────────────────────────────

  async saveBlock(sourcePath: string, data: EmotionBookData) {
    const file = this.app.vault.getAbstractFileByPath(sourcePath) as TFile;
    if (!file) { new Notice('Файл не найден'); return; }

    let content = await this.app.vault.read(file);

    const blockRe = /```emotion-book\n[\s\S]*?```/;
    const newBlock = `\`\`\`emotion-book\n${JSON.stringify(data, null, 2)}\n\`\`\``;
    content = content.match(blockRe)
      ? content.replace(blockRe, newBlock)
      : content + '\n' + newBlock;

    const avg  = data.entries.length
      ? data.entries.reduce((s, e) => s + e.emotionValue, 0) / data.entries.length
      : 3;
    const best = this.settings.emotions.reduce((a, b) =>
      Math.abs(b.value - avg) < Math.abs(a.value - avg) ? b : a
    );
    content = this.setFrontmatterKey(content, 'emotion', best.label);

    await this.app.vault.modify(file, content);
  }

  // ─── Frontmatter ───────────────────────────────────────────────────────────

  setFrontmatterKey(content: string, key: string, value: string): string {
    const fmRe = /^---\r?\n([\s\S]*?)\r?\n---/;
    const match = content.match(fmRe);
    if (!match) return `---\n${key}: "${value}"\n---\n\n` + content;
    const fm     = match[1];
    const keyRe  = new RegExp(`^${key}:.*$`, 'm');
    const newLine = `${key}: "${value}"`;
    const newFm  = keyRe.test(fm) ? fm.replace(keyRe, newLine) : fm + '\n' + newLine;
    return content.replace(fmRe, `---\n${newFm}\n---`);
  }

  // ─── Стили ─────────────────────────────────────────────────────────────────

  addStyle() {
    const css = `
.eb-wrap { font-family: var(--font-interface); }

/* Коллапс */
.eb-details { margin-bottom: 12px; }
.eb-summary { cursor: pointer; font-size: .8em; opacity: .5; user-select: none; padding: 2px 0; }
.eb-summary:hover { opacity: .8; }

/* Записи */
.eb-entries   { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
.eb-entry     { padding: 10px 12px; border-radius: 8px; }
.eb-entry-head { display: flex; align-items: center; gap: 6px; }
.eb-time      { font-size: .72em; opacity: .5; }
.eb-emotion   { font-weight: 600; font-size: .82em; flex: 1; }
.eb-text      { margin: 6px 0 0; font-size: .88em; line-height: 1.5; }

/* Кружок */
.eb-dot { display: inline-block; border-radius: 50%; flex-shrink: 0; }

/* Кнопки иконки */
.eb-icon-btn  { background: none; border: none; cursor: pointer; font-size: .85em; opacity: .4; padding: 0 2px; }
.eb-icon-btn:hover { opacity: 1; }
.eb-del-btn:hover  { color: #f44336; }

/* Форма редактирования */
.eb-edit-wrap { margin-top: 8px; display: flex; flex-direction: column; gap: 6px; }

/* Форма добавления */
.eb-form { display: flex; flex-direction: column; gap: 8px; }
.eb-row  { display: flex; gap: 8px; align-items: center; }

/* Индикатор цвета */
.eb-indicator { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

.eb-select   { flex: 1; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal); font-size: .9em; }
.eb-textarea { resize: vertical; min-height: 72px; padding: 8px 10px; border-radius: 6px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal); font-size: .9em; }
.eb-btn      { white-space: nowrap; padding: 6px 14px; border-radius: 6px; background: var(--color-accent); color: #fff; border: none; cursor: pointer; font-size: .88em; }
.eb-btn:hover { opacity: .85; }
.eb-cancel   { background: var(--background-modifier-border); color: var(--text-normal); }
`;
    const style = document.createElement('style');
    style.id = 'emotion-book-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  onunload() { document.getElementById('emotion-book-styles')?.remove(); }
}

// ─── Настройки ───────────────────────────────────────────────────────────────

class EmotionBookSettingTab extends PluginSettingTab {
  plugin: EmotionBookPlugin;

  constructor(app: App, plugin: EmotionBookPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Emotion Book' });
    containerEl.createEl('p', {
      text: 'Настрой список эмоций, их цвет и вес для расчёта среднего.',
      cls: 'setting-item-description',
    });

    for (let i = 0; i < this.plugin.settings.emotions.length; i++) {
      const em = this.plugin.settings.emotions[i];

      const s = new Setting(containerEl)
        .setName(em.label || `Эмоция ${i + 1}`);

      // Название
      s.addText(t => t
        .setPlaceholder('Название')
        .setValue(em.label)
        .onChange(async v => {
          this.plugin.settings.emotions[i].label = v;
          await this.plugin.saveSettings();
          s.setName(v || `Эмоция ${i + 1}`);
        })
      );

      // Числовое значение
      s.addText(t => {
        t.inputEl.type = 'number';
        t.inputEl.style.width = '60px';
        t.setValue(String(em.value)).setPlaceholder('0–10');
        t.onChange(async v => {
          const n = parseFloat(v);
          if (!isNaN(n)) {
            this.plugin.settings.emotions[i].value = n;
            await this.plugin.saveSettings();
          }
        });
      });

      // Цвет
      s.addColorPicker(cp => cp
        .setValue(em.color)
        .onChange(async v => {
          this.plugin.settings.emotions[i].color = v;
          await this.plugin.saveSettings();
        })
      );

      // Удалить
      s.addButton(b => b
        .setIcon('trash')
        .setWarning()
        .onClick(async () => {
          this.plugin.settings.emotions.splice(i, 1);
          await this.plugin.saveSettings();
          this.display();
        })
      );
    }

    new Setting(containerEl)
      .addButton(b => b
        .setButtonText('+ Добавить эмоцию')
        .onClick(async () => {
          this.plugin.settings.emotions.push({ label: 'Новая', color: '#888888', value: 3 });
          await this.plugin.saveSettings();
          this.display();
        })
      );

    new Setting(containerEl)
      .setName('Сбросить к стандартным')
      .addButton(b => b
        .setButtonText('Сбросить')
        .setWarning()
        .onClick(async () => {
          this.plugin.settings.emotions = [...DEFAULT_EMOTIONS];
          await this.plugin.saveSettings();
          this.display();
        })
      );
  }
}
