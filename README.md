# obsidian-bullet-list-outline
An outline plugin for bullet lists in Obsidian

<img width="2079" height="1396" alt="bullet-list-outline" src="https://github.com/user-attachments/assets/ed07f28d-7347-4d61-9340-4303052116bd" />


# Bullet List Outline

[English](#english) | [中文说明](#中文说明)

---

## English

An Obsidian plugin that applies hierarchical heading styles to unordered list items in the editor and automatically generates a navigable tree-view outline in the sidebar.

### Features
* **List Outline View**: Parses unordered bullet lists in the current file and renders a hierarchical outline in the sidebar.
* **Active Node Tracking**: Automatically tracks cursor movement and text edits to highlight the corresponding item in the outline in real time.
* **Two-Way Navigation**: Clicking an outline item scrolls the editor directly to the target line and sets focus.
* **Inline Element Parsing**: Preserves and renders WikiLinks, Markdown links, and tags within list items.

### 📦 Installation

#### From Obsidian Community Plugins (Recommended)
1. Open Obsidian **Settings** > **Community plugins**.
2. Turn off *Restricted mode*.
3. Search for **Bullet List Outline** and click **Install** then **Enable**.

#### Manual Installation
1. Download `main.js`, `manifest.json`, and `styles.css` from the latest [Releases](https://github.com/yyldps/obsidian-bullet-list-outline/releases).
2. Create a folder named `bullet-list-outline` inside your vault's `.obsidian/plugins/` directory.
3. Place the downloaded files into that folder.
4. Reload Obsidian and enable the plugin in Settings.

### Support & Contact / 

If you encounter any issues or have feature suggestions, feel free to reach out via:
* **GitHub Issues**: [Open an issue](https://github.com/yyldps/obsidian-bullet-list-outline/issues) 
* **Email**: `yyldps@163.com`

### 📄 License
This project is licensed under the [MIT License](LICENSE).

---

## 中文说明

一个专为 Obsidian 设计的轻量插件，可将正文中的无序列表项按层级呈现为标题视觉样式，并在侧边栏自动生成与之对应的树状层级大纲视图。

### 核心功能
* **无序列表大纲**：解析当前文档的无序列表层级，在侧边栏生成结构化树状大纲。
* **光标位置同步**：跟随光标移动与文本编辑，实时高亮大纲中对应的列表节点。
* **双向跳转定位**：点击大纲节点，正文平滑滚动至对应行并自动聚焦光标。
* **行内语法支持**：解析并渲染列表项中的双链（WikiLinks）、Markdown 链接与标签。

### 📦 安装方式

#### 官方社区市场安装（推荐）
1. 打开 Obsidian **设置** > **第三方插件**。
2. 关闭*安全模式*。
3. 在社区插件市场中搜索 **Bullet List Outline**，点击安装并启用。

#### 手动安装
1. 从 [Releases](https://github.com/yyldps/obsidian-bullet-list-outline/releases) 下载最新的 `main.js`、`manifest.json` 与 `styles.css`。
2. 在知识库的 `.obsidian/plugins/` 目录下新建 `bullet-list-outline` 文件夹。
3. 将下载的文件放入该文件夹中。
4. 在 Obsidian 设置中重新加载并启用插件。

### 联系与反馈
如果你在使用过程中遇到任何问题或有好的建议，欢迎通过以下方式反馈：
* **GitHub Issues**：[提交反馈](https://github.com/yyldps/obsidian-bullet-list-outline/issues)
* **Email**: `yyldps@163.com`

### 📄 开源协议
本项目采用 [MIT License](LICENSE) 开源协议。
