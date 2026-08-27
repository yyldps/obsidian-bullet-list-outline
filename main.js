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
  default: () => ListOutlinePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var VIEW_TYPE_LIST_OUTLINE = "list-outline-view";
var ListOutlinePlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.registerView(VIEW_TYPE_LIST_OUTLINE, (leaf) => new ListOutlineView(leaf));
    this.addRibbonIcon("list-tree", "\u6253\u5F00\u65E0\u5E8F\u5217\u8868\u5927\u7EB2", () => this.activateView());
  }
  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_LIST_OUTLINE)[0];
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_LIST_OUTLINE, active: true });
    }
    workspace.revealLeaf(leaf);
  }
};
var ListOutlineView = class extends import_obsidian.ItemView {
  constructor(leaf) {
    super(leaf);
    this.icon = "list-tree";
  }
  getViewIcon() {
    return "list-tree";
  }
  getViewType() {
    return VIEW_TYPE_LIST_OUTLINE;
  }
  getDisplayText() {
    return "\u5217\u8868\u5927\u7EB2";
  }
  async onOpen() {
    this.updateOutline();
    const debouncedUpdate = (0, import_obsidian.debounce)(() => this.updateOutline(), 300, true);
    const debouncedHighlight = (0, import_obsidian.debounce)(() => this.highlightActiveNode(), 50, true);
    this.registerEvent(this.app.workspace.on("file-open", () => this.updateOutline()));
    this.registerEvent(this.app.workspace.on("editor-change", () => debouncedUpdate()));
    this.registerDomEvent(document, "selectionchange", () => debouncedHighlight());
  }
  updateOutline() {
    const container = this.containerEl.children[1];
    container.empty();
    const activeView = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    const fileName = (activeView == null ? void 0 : activeView.file) ? activeView.file.basename : "\u6682\u65E0\u6253\u5F00\u7684\u6587\u4EF6";
    container.createEl("div", { text: fileName, cls: "list-outline-title" });
    if (!activeView)
      return;
    const lines = activeView.editor.getValue().split("\n");
    const root = { text: "root", line: -1, level: -1, children: [] };
    const stack = [root];
    const listRegex = /^(\s*)([-*])\s+(.*)/;
    let inCodeBlock = false;
    lines.forEach((lineText, index) => {
      if (lineText.trim().startsWith("```") || lineText.trim().startsWith("~~~")) {
        inCodeBlock = !inCodeBlock;
        return;
      }
      if (inCodeBlock)
        return;
      const match = lineText.match(listRegex);
      if (match) {
        const level = match[1].length;
        const node = { text: match[3], line: index, level, children: [] };
        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }
        stack[stack.length - 1].children.push(node);
        stack.push(node);
      }
    });
    const rootContainer = container.createDiv({ cls: "outline-root-container" });
    root.children.forEach((childNode) => this.renderNode(childNode, rootContainer, activeView));
    this.highlightActiveNode();
  }
  renderRichText(text) {
    let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html = html.replace(/!\[\[(.*?)\]\]/g, "\u{1F5BC}\uFE0F [\u56FE\u7247]");
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, "\u{1F5BC}\uFE0F [\u56FE\u7247]");
    html = html.replace(/\[\[(.*?)\]\]/g, (m, p1) => `<span class="outline-wikilink">${p1.split("|").pop()}</span>`);
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<span class="outline-mdlink">$1</span>');
    html = html.replace(/(^|\s)#([^\s#]+)/g, '$1<span class="outline-tag">#$2</span>');
    return html;
  }
  countDescendants(node) {
    let count = node.children.length;
    for (const child of node.children)
      count += this.countDescendants(child);
    return count;
  }
  renderNode(node, parentEl, activeView) {
    const nodeContainer = parentEl.createDiv({ cls: "outline-node" });
    const row = nodeContainer.createDiv({ cls: "outline-row" });
    row.setAttribute("data-line", node.line.toString());
    const hasChildren = node.children.length > 0;
    const caret = row.createDiv({ cls: "outline-caret" });
    if (hasChildren) {
      (0, import_obsidian.setIcon)(caret, "chevron-down");
      caret.onclick = (e) => {
        e.stopPropagation();
        const childrenContainer = nodeContainer.querySelector(":scope > .outline-children");
        if (childrenContainer) {
          const isCollapsed = childrenContainer.style.display === "none";
          childrenContainer.style.display = isCollapsed ? "block" : "none";
          caret.style.transform = isCollapsed ? "rotate(0deg)" : "rotate(-90deg)";
        }
      };
    } else {
      caret.style.visibility = "hidden";
    }
    row.createDiv({ cls: "outline-bullet" });
    const textSpan = row.createDiv({ cls: "outline-text" });
    textSpan.innerHTML = this.renderRichText(node.text);
    if (hasChildren) {
      const count = this.countDescendants(node);
      row.createDiv({ cls: "outline-badge", text: count.toString() });
    }
    row.onclick = (e) => {
      e.stopPropagation();
      const editor = activeView.editor;
      editor.setCursor({ line: node.line, ch: 0 });
      editor.scrollIntoView({ from: { line: node.line, ch: 0 }, to: { line: node.line, ch: 0 } }, true);
      activeView.leaf.focus();
    };
    if (hasChildren) {
      const childrenContainer = nodeContainer.createDiv({ cls: "outline-children" });
      node.children.forEach((child) => this.renderNode(child, childrenContainer, activeView));
    }
  }
  highlightActiveNode() {
    const activeView = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!activeView)
      return;
    this.forceHighlightLine(activeView.editor.getCursor().line);
  }
forceHighlightLine(cursorLine) {
    const items = Array.from(this.containerEl.querySelectorAll(".outline-row"));
    let activeItem = null;
    let maxLine = -1;

    // 1. 找到当前光标对应的目标节点（原有计算逻辑）
    items.forEach((item) => {
      item.classList.remove("is-active");
      const nodeLine = parseInt(item.getAttribute("data-line") || "-1");
      if (nodeLine <= cursorLine && nodeLine > maxLine) {
        maxLine = nodeLine;
        activeItem = item;
      }
    });

    if (activeItem) {
      let nodeToHighlight = activeItem;
      let currentOutlineNode = activeItem.parentElement; // 获取当前行所在的 .outline-node 盒子

      // 2. 核心新增：向上追溯 DOM 树，检查节点是否被折叠隐藏
      while (currentOutlineNode) {
        let parentContainer = currentOutlineNode.parentElement;
        
        // 如果已经爬到了大纲的最顶层根容器，就停止追溯
        if (!parentContainer || !parentContainer.classList.contains("outline-children")) {
          break;
        }

        // 如果发现外层的子节点容器是隐藏的（display: none）
        if (parentContainer.style.display === "none") {
          let parentOutlineNode = parentContainer.parentElement; // 找到上一级的 .outline-node
          if (parentOutlineNode) {
            let parentRow = parentOutlineNode.querySelector(":scope > .outline-row");
            if (parentRow) {
              // ★ 将高亮接力棒交给它可见的父级节点 ★
              nodeToHighlight = parentRow;
            }
          }
        }
        
        // 继续向上爬层级，应对多层连续折叠的情况
        currentOutlineNode = parentContainer.parentElement; 
      }

      // 3. 为最终决出的“可见节点”添加高亮，并平滑滚动到它
      nodeToHighlight.classList.add("is-active");
      nodeToHighlight.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
};
