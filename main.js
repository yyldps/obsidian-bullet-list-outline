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
  default: () => UnifiedOutlinePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var VIEW_TYPE_UNIFIED_OUTLINE = "unified-outline-view";
var t = {
  behavior: "Behavior",
  defaultExpand: "Default expand level",
  defaultExpandDesc: "Set the default depth when opening a new outline.",
  appearance: "Appearance",
  showChildCount: "Show child count badges",
  showChildCountDesc: "Display the number of descendant items next to parent nodes.",
  truncate: "Truncate text length",
  truncateDesc: "Maximum characters to display for long items. Set to 0 to disable.",
  lightColor: "Light theme glow color",
  lightColorDesc: "Custom glow color for the active item in light theme.",
  darkColor: "Dark theme glow color",
  darkColorDesc: "Custom glow color for the active item in dark theme.",
  level: (num) => `Level ${num}`,
  all: "All",
  emptyState: "No active document",
  outlineTitle: "Outline"
};
var DEFAULT_SETTINGS = {
  defaultExpandLevel: 99,
  truncateLength: 30,
  showChildCount: true,
  lightGlowColor: "#007aff",
  darkGlowColor: "#ffffff",
  // 侧边栏布局参数（已无设置面板，但保留默认值供CSS读取）
  sbCaretSize: 18,
  sbBulletSize: 0.45,
  sbBulletMarginLeft: 0.475,
  sbBulletMarginRight: 0.875,
  sbCheckboxSize: 0.8,
  sbCheckboxMarginLeft: 0.3,
  sbCheckboxMarginRight: 0.7
};
var UnifiedOutlinePlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.applyCustomColors();
    this.registerView(
      VIEW_TYPE_UNIFIED_OUTLINE,
      (leaf) => new UnifiedOutlineView(leaf, this)
    );
    this.addRibbonIcon("list-tree", t.outlineTitle, () => this.activateView());
    this.addSettingTab(new UnifiedOutlineSettingTab(this.app, this));
  }
  onunload() {
    const styleEl = document.getElementById("unified-outline-custom-colors");
    if (styleEl)
      styleEl.remove();
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  applyCustomColors() {
    let styleEl = document.getElementById("unified-outline-custom-colors");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "unified-outline-custom-colors";
      document.head.appendChild(styleEl);
    }
    const lightRgb = this.hexToRgb(this.settings.lightGlowColor);
    const darkRgb = this.hexToRgb(this.settings.darkGlowColor);
    styleEl.textContent = `
            html body.theme-light, body.theme-light {
                --my-glow-color: ${this.settings.lightGlowColor};
                --my-glow-color-rgb: ${lightRgb};
                --my-glow-shadow: 0 0 2px rgba(${lightRgb}, 0.2), 0 0 6px 1px rgba(${lightRgb}, 0.4);
            }
            html body.theme-dark, body.theme-dark {
                --my-glow-color: ${this.settings.darkGlowColor};
                --my-glow-color-rgb: ${darkRgb};
                --my-glow-shadow: 0 0 2px rgba(${darkRgb}, 0.4), 0 0 8px 1.5px rgba(${darkRgb}, 0.65);
            }
            html body .app-container .workspace-leaf-content[data-type="unified-outline-view"] {
                --sb-caret-size: ${this.settings.sbCaretSize}px;
                --sb-bullet-size: ${this.settings.sbBulletSize}em;
                --sb-bullet-margin-left: ${this.settings.sbBulletMarginLeft}em;
                --sb-bullet-margin-right: ${this.settings.sbBulletMarginRight}em;
                --sb-checkbox-size: ${this.settings.sbCheckboxSize}em;
                --sb-checkbox-margin-left: ${this.settings.sbCheckboxMarginLeft}em;
                --sb-checkbox-margin-right: ${this.settings.sbCheckboxMarginRight}em;
            }
        `;
  }
  hexToRgb(hex) {
    const sanitized = hex.replace("#", "");
    if (sanitized.length !== 6)
      return "0, 122, 255";
    const r = parseInt(sanitized.substring(0, 2), 16);
    const g = parseInt(sanitized.substring(2, 4), 16);
    const b = parseInt(sanitized.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_UNIFIED_OUTLINE)[0];
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await (leaf == null ? void 0 : leaf.setViewState({ type: VIEW_TYPE_UNIFIED_OUTLINE, active: true }));
    }
    if (leaf)
      workspace.revealLeaf(leaf);
  }
};
var UnifiedOutlineView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.currentExpandLevel = this.plugin.settings.defaultExpandLevel;
    this.suppressNextUpdate = false;
  }
  getViewType() {
    return VIEW_TYPE_UNIFIED_OUTLINE;
  }
  getDisplayText() {
    return t.outlineTitle;
  }
  getIcon() {
    return "list-tree";
  }
  async onOpen() {
    const debouncedUpdate = (0, import_obsidian.debounce)(() => this.updateView(), 300, true);
    const debouncedHighlight = (0, import_obsidian.debounce)(() => this.highlightActiveLine(), 50, true);
    this.registerEvent(this.app.workspace.on("active-leaf-change", (leaf) => {
      if (leaf && (leaf.view.getViewType() === "markdown" || leaf.view.getViewType() === "canvas")) {
        this.updateView();
      }
    }));
    this.registerEvent(this.app.workspace.on("file-open", () => this.updateView()));
    this.registerEvent(this.app.workspace.on("editor-change", () => {
      if (this.suppressNextUpdate) {
        this.suppressNextUpdate = false;
        return;
      }
      debouncedUpdate();
    }));
    this.registerEvent(this.app.metadataCache.on("changed", (file) => {
      if (file === this.app.workspace.getActiveFile())
        debouncedUpdate();
    }));
    this.registerDomEvent(document, "selectionchange", debouncedHighlight);
    
    // 完全回归原生，不干预正文折叠逻辑
    await this.updateView();
  }
  async updateView() {
    var _a, _b;
    const container = this.contentEl;
    container.empty();
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      container.createDiv({ text: t.emptyState, cls: "outline-empty-state" });
      return;
    }
    try {
        if (activeFile.extension === "canvas") {
          await this.renderCanvasOutline(activeFile, container);
        } else if (activeFile.extension === "md") {
          const cache = this.app.metadataCache.getFileCache(activeFile);
          const cssClasses = (_b = (_a = cache == null ? void 0 : cache.frontmatter) == null ? void 0 : _a.cssclasses) != null ? _b : [];
          const isListMode = Array.isArray(cssClasses) ? cssClasses.includes("list-outline-mode") : typeof cssClasses === "string" && cssClasses.includes("list-outline-mode");
          if (isListMode) {
            await this.renderListOutline(activeFile, container);
          } else {
            await this.renderHeadingOutline(activeFile, cache || {}, container);
          }
        }
    } catch (e) {
        console.error("Unified Outline Render Error:", e);
        container.createDiv({ text: "Error rendering outline", cls: "outline-empty-state" });
    }
  }
  truncateText(text) {
    const max = this.plugin.settings.truncateLength;
    return max > 0 && text.length > max ? text.substring(0, max) + "..." : text;
  }
  renderHeaderControls(container, title, view) {
    const headerContainer = container.createDiv({ cls: "outline-header-container" });
    headerContainer.createDiv({ text: title, cls: "outline-title-header" });
    const controls = headerContainer.createDiv({ cls: "outline-controls" });
    const segmentedControl = controls.createDiv({ cls: "outline-segmented-control" });
    [1, 2, 3, 4, 5, 6].forEach((lv) => {
      const btn = segmentedControl.createDiv({ cls: "segmented-btn", text: lv.toString() });
      if (this.currentExpandLevel === lv)
        btn.addClass("is-active");
      btn.addEventListener("click", () => {
        this.currentExpandLevel = lv;
        this.updateSegmentedUI(segmentedControl, btn);
        this.expandToLevel(lv);
      });
    });
    const allBtn = segmentedControl.createDiv({ cls: "segmented-btn", text: t.all });
    if (this.currentExpandLevel === 99)
      allBtn.addClass("is-active");
    allBtn.addEventListener("click", () => {
      this.currentExpandLevel = 99;
      this.updateSegmentedUI(segmentedControl, allBtn);
      this.expandToLevel(99);
    });
    if (view) {
      const btnGroup = controls.createDiv({ cls: "outline-btn-group" });
      const topBtn = btnGroup.createEl("button", { cls: "outline-btn", attr: { title: "Top" } });
      (0, import_obsidian.setIcon)(topBtn, "arrow-up-to-line");
      topBtn.addEventListener("click", () => this.jumpToLine(view, 0));
      const bottomBtn = btnGroup.createEl("button", { cls: "outline-btn", attr: { title: "Bottom" } });
      (0, import_obsidian.setIcon)(bottomBtn, "arrow-down-to-line");
      bottomBtn.addEventListener("click", () => this.jumpToLine(view, view.editor.lastLine()));
    }
  }
  updateSegmentedUI(container, activeBtn) {
    container.querySelectorAll(".segmented-btn").forEach((el) => el.classList.remove("is-active"));
    activeBtn.classList.add("is-active");
  }
  async renderHeadingOutline(file, cache, container) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!view)
      return;
    this.renderHeaderControls(container, file.basename, view);
    const headings = cache.headings;
    if (!headings || headings.length === 0) {
      container.createDiv({ text: t.emptyState, cls: "outline-empty-state" });
      return;
    }
    const rootContainer = container.createDiv({ cls: "outline-root-container heading-mode" });
    const rootNodes = [];
    const stack = [];
    for (const h of headings) {
      const node = { heading: h, children: [] };
      while (stack.length > 0 && stack[stack.length - 1].heading.level >= h.level)
        stack.pop();
      if (stack.length === 0)
        rootNodes.push(node);
      else
        stack[stack.length - 1].children.push(node);
      stack.push(node);
    }
    for (const rootNode of rootNodes)
      this.renderHeadingNode(rootNode, rootContainer, view);
    this.expandToLevel(this.currentExpandLevel);
    this.highlightActiveLine();
  }
  countHeadingDescendants(node) {
    return node.children.reduce((acc, child) => acc + this.countHeadingDescendants(child), node.children.length);
  }
  renderHeadingNode(node, parentEl, view) {
    const nodeContainer = parentEl.createDiv({ cls: "outline-node", attr: { "data-level": node.heading.level.toString() } });
    const row = nodeContainer.createDiv({ cls: `outline-row heading-row heading-level-${node.heading.level}` });
    const targetLine = node.heading.position.start.line;
    row.setAttribute("data-line", targetLine.toString());
    const hasChildren = node.children.length > 0;
    const caret = row.createDiv({ cls: "outline-caret" });
    if (hasChildren) {
      (0, import_obsidian.setIcon)(caret, "chevron-down");
      caret.addEventListener("click", (e) => this.toggleCollapse(e, nodeContainer, caret));
    } else
      caret.addClass("is-empty");
    const displayText = this.truncateText(node.heading.heading);
    row.createDiv({ cls: "outline-text heading-text", text: displayText });
    if (hasChildren && this.plugin.settings.showChildCount) {
      row.createDiv({ cls: "outline-badge", text: this.countHeadingDescendants(node).toString() });
    }
    row.addEventListener("click", (e) => this.jumpToLine(e, view, targetLine));
    if (hasChildren) {
      const childrenContainer = nodeContainer.createDiv({ cls: "outline-children" });
      for (const child of node.children)
        this.renderHeadingNode(child, childrenContainer, view);
    }
  }
  async renderCanvasOutline(file, container) {
    container.createDiv({ text: "Canvas outline not supported yet.", cls: "outline-empty-state" });
  }
  async renderListOutline(file, container) {
    let view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!view) {
        const leaves = this.app.workspace.getLeavesOfType('markdown');
        if (leaves.length > 0) {
            view = leaves[0].view;
        }
    }
    if (!view) {
      container.createDiv({ text: "No active Markdown editor found", cls: "outline-empty-state" });
      return;
    }
    this.renderHeaderControls(container, file.basename, view);
    const rootContainer = container.createDiv({ cls: "outline-root-container list-mode" });
    const lines = view.editor.getValue().split("\n");
    const root = { text: "root", line: -1, level: -1, children: [] };
    const stack = [root];
    const listRegex = /^([ \t]*)([-*+])\s+(.*)/;
    let inCodeBlock = false, inYaml = false;
    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];
      if (i === 0 && lineText.trim() === "---") {
        inYaml = true;
        continue;
      }
      if (inYaml && lineText.trim() === "---") {
        inYaml = false;
        continue;
      }
      if (inYaml)
        continue;
      if (lineText.trim().startsWith("```") || lineText.trim().startsWith("~~~")) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock)
        continue;
      const match = lineText.match(listRegex);
      if (match) {
        const level = match[1].replace(/\t/g, "    ").length;
        const node = { text: match[3], line: i, level, children: [] };
        while (stack.length > 1 && stack[stack.length - 1].level >= level)
          stack.pop();
        stack[stack.length - 1].children.push(node);
        stack.push(node);
      }
    }
    for (const childNode of root.children)
      await this.renderListNode(childNode, rootContainer, view, file, 1);
    this.expandToLevel(this.currentExpandLevel);
    this.highlightActiveLine();
  }
  async renderListNode(node, parentEl, view, file, depth) {
    const nodeContainer = parentEl.createDiv({ cls: "outline-node", attr: { "data-level": depth.toString() } });
    const hasChildren = node.children.length > 0;
    const safeDepth = Math.min(depth, 6);
    let displayText = node.text;
    let isTask = false;
    let taskChecked = false;
    const taskMatch = displayText.match(/^\[([ xX])\]\s+(.*)/);
    if (taskMatch) {
      isTask = true;
      taskChecked = taskMatch[1] !== " ";
      displayText = taskMatch[2];
    }
    let rowClasses = "outline-row list-row";
    if (hasChildren)
      rowClasses += ` list-heading-depth-${safeDepth}`;
    if (isTask && taskChecked)
      rowClasses += " is-completed";
    const row = nodeContainer.createDiv({ cls: rowClasses });
    row.setAttribute("data-line", node.line.toString());
    const caret = row.createDiv({ cls: "outline-caret" });
    if (hasChildren) {
      (0, import_obsidian.setIcon)(caret, "chevron-down");
      caret.addEventListener("click", (e) => this.toggleCollapse(e, nodeContainer, caret));
    } else {
      caret.addClass("is-empty");
    }
    if (isTask) {
      const cb = row.createEl("input", { type: "checkbox", cls: "outline-task-checkbox" });
      cb.checked = taskChecked;
      cb.addEventListener("click", (e) => {
        e.stopPropagation();
        const isChecked = cb.checked;
        node.taskChecked = isChecked;
        if (isChecked) {
          row.addClass("is-completed");
        } else {
          row.removeClass("is-completed");
        }
        const editor = view.editor;
        const lineText = editor.getLine(node.line);
        const match = lineText.match(/^(\s*[-*+]\s*)\[([ xX])\](.*)/);
        if (match) {
          const newLine = match[1] + "[" + (isChecked ? "x" : " ") + "]" + match[3];
          this.suppressNextUpdate = true;
          editor.replaceRange(newLine, { line: node.line, ch: 0 }, { line: node.line, ch: lineText.length });
        }
        view.leaf.focus();
        view.editor.setCursor({ line: node.line, ch: 0 });
        view.editor.scrollIntoView({ from: { line: node.line, ch: 0 }, to: { line: node.line, ch: 0 } }, true);
        this.highlightActiveLine();
      });
    } else {
      row.createDiv({ cls: "outline-bullet" });
    }
    const textSpan = row.createDiv({ cls: "outline-text" });
    await import_obsidian.MarkdownRenderer.renderMarkdown(displayText, textSpan, file.path, this);
    const pTag = textSpan.querySelector("p");
    if (pTag) {
      while (pTag.firstChild)
        textSpan.appendChild(pTag.firstChild);
      pTag.remove();
    }
    if (hasChildren && this.plugin.settings.showChildCount) {
      row.createDiv({ cls: "outline-badge", text: this.countDescendants(node).toString() });
    }
    row.addEventListener("click", (e) => this.jumpToLine(e, view, node.line));
    if (hasChildren) {
      const childrenContainer = nodeContainer.createDiv({ cls: "outline-children" });
      for (const child of node.children)
        await this.renderListNode(child, childrenContainer, view, file, depth + 1);
    }
  }
  countDescendants(node) {
    return node.children.reduce((acc, child) => acc + this.countDescendants(child), node.children.length);
  }
  expandToLevel(targetLevel) {
    const nodes = this.contentEl.querySelectorAll(".outline-node");
    nodes.forEach((node) => {
      const level = parseInt(node.getAttribute("data-level") || "1", 10);
      const children = node.querySelector(":scope > .outline-children");
      const caret = node.querySelector(":scope > .outline-row > .outline-caret");
      if (children && caret) {
        if (level >= targetLevel) {
          children.classList.add("is-hidden");
          caret.classList.add("is-collapsed");
        } else {
          children.classList.remove("is-hidden");
          caret.classList.remove("is-collapsed");
        }
      }
    });
  }
  toggleCollapse(e, container, caret) {
    e.stopPropagation();
    const children = container.querySelector(":scope > .outline-children");
    if (children) {
      const isHidden = children.classList.contains("is-hidden");
      children.classList.toggle("is-hidden", !isHidden);
      caret.classList.toggle("is-collapsed", !isHidden);
    }
  }
  jumpToLine(e, targetView, targetLine) {
    let view;
    let line;
    if (e instanceof Event) {
      e.stopPropagation();
      view = targetView;
      line = targetLine;
    } else {
      view = e;
      line = targetView;
    }
    view.editor.setCursor({ line, ch: 0 });
    view.editor.scrollIntoView({ from: { line, ch: 0 }, to: { line, ch: 0 } }, true);
    view.leaf.focus();
  }
  highlightActiveLine() {
    var _a, _b;
    let activeView = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!activeView) {
        const leaves = this.app.workspace.getLeavesOfType('markdown');
        if (leaves.length > 0) {
            activeView = leaves[0].view;
        }
    }
    if (!activeView)
      return;
    const cursorLine = activeView.editor.getCursor().line;
    const items = Array.from(this.contentEl.querySelectorAll(".outline-row[data-line]"));
    let activeItem = null;
    let maxLine = -1;
    items.forEach((item) => {
      const nodeLine = parseInt(item.getAttribute("data-line") || "-1", 10);
      if (nodeLine <= cursorLine && nodeLine > maxLine) {
        maxLine = nodeLine;
        activeItem = item;
      }
    });
    if (activeItem) {
      this.contentEl.querySelectorAll(".is-active").forEach((el) => el.classList.remove("is-active"));
      this.contentEl.querySelectorAll(".is-active-parent").forEach((el) => el.classList.remove("is-active-parent"));
      activeItem.classList.add("is-active");
      let parentNode = (_a = activeItem.parentElement) == null ? void 0 : _a.closest(".outline-node");
      while (parentNode) {
        const parentRow = parentNode.querySelector(":scope > .outline-row");
        if (parentRow)
          parentRow.classList.add("is-active-parent");
        const childrenContainer = parentNode.querySelector(":scope > .outline-children");
        const caret = parentNode.querySelector(":scope > .outline-row > .outline-caret");
        if (childrenContainer == null ? void 0 : childrenContainer.classList.contains("is-hidden")) {
          childrenContainer.classList.remove("is-hidden");
          caret == null ? void 0 : caret.classList.remove("is-collapsed");
        }
        parentNode = (_b = parentNode.parentElement) == null ? void 0 : _b.closest(".outline-node");
      }
      activeItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
};
var UnifiedOutlineSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setHeading().setName(t.behavior);
    new import_obsidian.Setting(containerEl).setName(t.defaultExpand).setDesc(t.defaultExpandDesc).addDropdown(
      (d) => d.addOption("1", t.level("1")).addOption("2", t.level("2")).addOption("3", t.level("3")).addOption("4", t.level("4")).addOption("5", t.level("5")).addOption("6", t.level("6")).addOption("99", t.all).setValue(this.plugin.settings.defaultExpandLevel.toString()).onChange(async (v) => {
        this.plugin.settings.defaultExpandLevel = parseInt(v, 10);
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setHeading().setName(t.appearance);
    new import_obsidian.Setting(containerEl).setName(t.lightColor).setDesc(t.lightColorDesc).addColorPicker(
      (color) => color.setValue(this.plugin.settings.lightGlowColor).onChange(async (value) => {
        this.plugin.settings.lightGlowColor = value;
        this.plugin.applyCustomColors();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName(t.darkColor).setDesc(t.darkColorDesc).addColorPicker(
      (color) => color.setValue(this.plugin.settings.darkGlowColor).onChange(async (value) => {
        this.plugin.settings.darkGlowColor = value;
        this.plugin.applyCustomColors();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName(t.showChildCount).setDesc(t.showChildCountDesc).addToggle(
      (tToggle) => tToggle.setValue(this.plugin.settings.showChildCount).onChange(async (v) => {
        this.plugin.settings.showChildCount = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName(t.truncate).setDesc(t.truncateDesc).addText(
      (text) => text.setValue(this.plugin.settings.truncateLength.toString()).onChange(async (v) => {
        const parsed = parseInt(v, 10);
        if (!isNaN(parsed)) {
          this.plugin.settings.truncateLength = parsed;
          await this.plugin.saveSettings();
        }
      })
    );
    // 【已删除】侧边栏布局调整设置区（用户要求移除）
  }
};
