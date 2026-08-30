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
var LOCALE = window.moment.locale();
var isZh = LOCALE === "zh-cn" || LOCALE === "zh-tw" || LOCALE === "zh";
var t = {
  behavior: isZh ? "\u884C\u4E3A\u8BBE\u7F6E" : "Behavior",
  defaultExpand: isZh ? "\u9ED8\u8BA4\u5C55\u5F00\u5C42\u7EA7" : "Default expand level",
  defaultExpandDesc: isZh ? "\u6253\u5F00\u65B0\u5927\u7EB2\u65F6\u9ED8\u8BA4\u5C55\u793A\u7684\u6DF1\u5EA6\u3002" : "Set the default depth when opening a new outline.",
  appearance: isZh ? "\u5916\u89C2\u4E0E\u6392\u7248" : "Appearance",
  showChildCount: isZh ? "\u663E\u793A\u5B50\u8282\u70B9\u6570\u91CF" : "Show child count badges",
  showChildCountDesc: isZh ? "\u5728\u7236\u8282\u70B9\u65C1\u8FB9\u663E\u793A\u5305\u542B\u7684\u5B50\u8282\u70B9\u603B\u6570\u3002" : "Display the number of descendant items next to parent nodes.",
  truncate: isZh ? "\u6587\u672C\u622A\u65AD\u957F\u5EA6" : "Truncate text length",
  truncateDesc: isZh ? "\u8FC7\u957F\u6807\u9898\u7684\u81EA\u52A8\u7701\u7565\u5B57\u7B26\u6570\uFF08\u586B 0 \u5173\u95ED\u9650\u5236\uFF09\u3002" : "Maximum characters to display for long items. Set to 0 to disable.",
  lightColor: isZh ? "\u767D\u5929\u6A21\u5F0F\u9AD8\u4EAE\u8272" : "Light theme glow color",
  lightColorDesc: isZh ? "\u81EA\u5B9A\u4E49\u6D45\u8272\u4E3B\u9898\u4E0B\u5F53\u524D\u7F16\u8F91\u8282\u70B9\u7684\u53D1\u5149\u989C\u8272\u3002" : "Custom glow color for the active item in light theme.",
  darkColor: isZh ? "\u591C\u95F4\u6A21\u5F0F\u9AD8\u4EAE\u8272" : "Dark theme glow color",
  darkColorDesc: isZh ? "\u81EA\u5B9A\u4E49\u6DF1\u8272\u4E3B\u9898\u4E0B\u5F53\u524D\u7F16\u8F91\u8282\u70B9\u7684\u53D1\u5149\u989C\u8272\u3002" : "Custom glow color for the active item in dark theme.",
  level: (num) => isZh ? `\u5C55\u5F00\u81F3\u5C42\u7EA7 ${num}` : `Level ${num}`,
  all: "All",
  emptyState: isZh ? "\u6682\u65E0\u6FC0\u6D3B\u7684\u6587\u6863\u6216\u767D\u677F" : "No active document or canvas",
  outlineTitle: isZh ? "\u7ED3\u6784\u5927\u7EB2" : "Outline"
};
var DEFAULT_SETTINGS = {
  defaultExpandLevel: 99,
  truncateLength: 30,
  showChildCount: true,
  lightGlowColor: "#007aff",
  darkGlowColor: "#ffffff"
};
var UnifiedOutlinePlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.applyCustomColors();
    this.registerView(VIEW_TYPE_UNIFIED_OUTLINE, (leaf) => new UnifiedOutlineView(leaf, this));
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
  // --- 动态色彩注入引擎 ---
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
            body.theme-light {
                --my-glow-color: ${this.settings.lightGlowColor} !important;
                --my-glow-shadow: 0 0 6px 1px rgba(${lightRgb}, 0.4) !important;
            }
            body.theme-dark {
                --my-glow-color: ${this.settings.darkGlowColor} !important;
                --my-glow-shadow: 0 0 8px 1.5px rgba(${darkRgb}, 0.65) !important;
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
    this.registerEvent(this.app.workspace.on("editor-change", debouncedUpdate));
    this.registerEvent(this.app.metadataCache.on("changed", (file) => {
      if (file === this.app.workspace.getActiveFile())
        debouncedUpdate();
    }));
    this.registerDomEvent(document, "selectionchange", debouncedHighlight);
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
  // --- 模块 A: 系统标题大纲 ---
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
    } else {
      caret.addClass("is-empty");
    }
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
  // --- 模块 B: 白板大纲 ---
  async renderCanvasOutline(file, container) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian.ItemView);
    if (!view || view.getViewType() !== "canvas")
      return;
    this.renderHeaderControls(container, file.basename);
    const canvas = view.canvas;
    const canvasData = canvas.getData();
    const nodes = canvasData.nodes || [];
    if (nodes.length === 0) {
      container.createDiv({ text: t.emptyState, cls: "outline-empty-state" });
      return;
    }
    const rootContainer = container.createDiv({ cls: "outline-root-container canvas-outline canvas-mode" });
    const tree = this.buildCanvasTree(nodes);
    for (const rootNode of tree)
      this.renderCanvasNode(rootNode, rootContainer, canvas, 1);
    this.expandToLevel(this.currentExpandLevel);
  }
  buildCanvasTree(nodes) {
    const groups = nodes.filter((n) => n.type === "group");
    groups.sort((a, b) => a.width * a.height - b.width * b.height);
    const treeNodes = nodes.map((n) => ({ data: n, children: [] }));
    const rootNodes = [];
    const nodeMap = new Map(treeNodes.map((tn) => [tn.data.id, tn]));
    const findParentGroup = (node) => {
      const cx = node.x + node.width / 2, cy = node.y + node.height / 2;
      for (const g of groups) {
        if (g.id === node.id)
          continue;
        if (cx >= g.x && cx <= g.x + g.width && cy >= g.y && cy <= g.y + g.height)
          return g;
      }
      return null;
    };
    for (const tn of treeNodes) {
      const parent = findParentGroup(tn.data);
      if (parent && nodeMap.has(parent.id))
        nodeMap.get(parent.id).children.push(tn);
      else
        rootNodes.push(tn);
    }
    return rootNodes.sort((a, b) => a.data.type === "group" ? -1 : 1);
  }
  countCanvasDescendants(node) {
    return node.children.reduce((acc, child) => acc + this.countCanvasDescendants(child), node.children.length);
  }
  renderCanvasNode(treeNode, parentEl, canvas, depth) {
    const nodeData = treeNode.data;
    const nodeContainer = parentEl.createDiv({ cls: "outline-node", attr: { "data-level": depth.toString() } });
    const row = nodeContainer.createDiv({ cls: "outline-row canvas-row" });
    const hasChildren = treeNode.children.length > 0;
    const caret = row.createDiv({ cls: "outline-caret" });
    if (hasChildren) {
      (0, import_obsidian.setIcon)(caret, "chevron-down");
      caret.addEventListener("click", (e) => this.toggleCollapse(e, nodeContainer, caret));
    } else {
      caret.addClass("is-empty");
    }
    const iconEl = row.createDiv({ cls: "canvas-icon" });
    let rawLabel = "Untitled";
    if (nodeData.type === "group") {
      (0, import_obsidian.setIcon)(iconEl, "box-select");
      rawLabel = nodeData.label || "Group";
    } else if (nodeData.type === "file") {
      (0, import_obsidian.setIcon)(iconEl, "file-text");
      rawLabel = nodeData.file ? nodeData.file.split(/[/\\]/).pop() || "File" : "File";
    } else if (nodeData.type === "text") {
      (0, import_obsidian.setIcon)(iconEl, "type");
      rawLabel = nodeData.text ? nodeData.text.split("\n")[0] : "Empty text";
    } else if (nodeData.type === "link") {
      (0, import_obsidian.setIcon)(iconEl, "link");
      rawLabel = nodeData.url || "Link";
    }
    const displayLabel = this.truncateText(rawLabel);
    row.createDiv({ cls: "outline-text canvas-text", text: displayLabel });
    if (hasChildren && this.plugin.settings.showChildCount) {
      row.createDiv({ cls: "outline-badge", text: this.countCanvasDescendants(treeNode).toString() });
    }
    row.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetCanvasNode = canvas.nodes.get(nodeData.id);
      if (targetCanvasNode) {
        canvas.deselectAll();
        canvas.select(targetCanvasNode);
        canvas.zoomToSelection();
        this.contentEl.querySelectorAll(".is-active").forEach((el) => el.classList.remove("is-active"));
        row.classList.add("is-active");
      }
    });
    if (hasChildren) {
      const childrenContainer = nodeContainer.createDiv({ cls: "outline-children" });
      for (const child of treeNode.children)
        this.renderCanvasNode(child, childrenContainer, canvas, depth + 1);
    }
  }
  // --- 模块 C: 无序列表大纲 ---
  async renderListOutline(file, container) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!view)
      return;
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
    let rowClasses = "outline-row list-row";
    if (hasChildren) {
      rowClasses += ` list-heading-depth-${safeDepth}`;
    }
    const row = nodeContainer.createDiv({ cls: rowClasses });
    row.setAttribute("data-line", node.line.toString());
    const caret = row.createDiv({ cls: "outline-caret" });
    if (hasChildren) {
      (0, import_obsidian.setIcon)(caret, "chevron-down");
      caret.addEventListener("click", (e) => this.toggleCollapse(e, nodeContainer, caret));
    } else {
      caret.addClass("is-empty");
    }
    row.createDiv({ cls: "outline-bullet" });
    const textSpan = row.createDiv({ cls: "outline-text" });
    await import_obsidian.MarkdownRenderer.renderMarkdown(node.text, textSpan, file.path, this);
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
  // --- 交互与定位引擎 ---
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
    const activeView = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
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
    new import_obsidian.Setting(containerEl).setName(t.defaultExpand).setDesc(t.defaultExpandDesc).addDropdown((d) => d.addOption("1", t.level("1")).addOption("2", t.level("2")).addOption("3", t.level("3")).addOption("4", t.level("4")).addOption("5", t.level("5")).addOption("6", t.level("6")).addOption("99", t.all).setValue(this.plugin.settings.defaultExpandLevel.toString()).onChange(async (v) => {
      this.plugin.settings.defaultExpandLevel = parseInt(v, 10);
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setHeading().setName(t.appearance);
    new import_obsidian.Setting(containerEl).setName(t.lightColor).setDesc(t.lightColorDesc).addColorPicker((color) => color.setValue(this.plugin.settings.lightGlowColor).onChange(async (value) => {
      this.plugin.settings.lightGlowColor = value;
      this.plugin.applyCustomColors();
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName(t.darkColor).setDesc(t.darkColorDesc).addColorPicker((color) => color.setValue(this.plugin.settings.darkGlowColor).onChange(async (value) => {
      this.plugin.settings.darkGlowColor = value;
      this.plugin.applyCustomColors();
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName(t.showChildCount).setDesc(t.showChildCountDesc).addToggle((t2) => t2.setValue(this.plugin.settings.showChildCount).onChange(async (v) => {
      this.plugin.settings.showChildCount = v;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName(t.truncate).setDesc(t.truncateDesc).addText((text) => text.setValue(this.plugin.settings.truncateLength.toString()).onChange(async (v) => {
      const parsed = parseInt(v, 10);
      if (!isNaN(parsed)) {
        this.plugin.settings.truncateLength = parsed;
        await this.plugin.saveSettings();
      }
    }));
  }
};
