# obsidian-bullet-list-outline

An outline plugin for Obsidian that supports bullet lists, headings, and canvas.

<img width="1717" height="1186" alt="list-outline-mode" src="https://github.com/user-attachments/assets/d4b89752-ec76-4a71-973a-c1c41ad5912c" />

<img width="1717" height="1186" alt="swich" src="https://github.com/user-attachments/assets/a83ba744-4172-4069-95f5-46291fb5439e" />


[English](#english) | [中文说明](#中文说明)

---

## English

A simple sidebar outline plugin for Obsidian. It provides a tree-view outline for unordered lists, document headings, and canvas files.

### Recent Updates
* **Outline Toggle**: The list outline mode can now be enabled or disabled via document properties (frontmatter).
* **Outline Switching**: The sidebar outline automatically adapts to the active document, supporting Heading, List, and Canvas outlines.
* **Level Management**: Added global settings for default expansion levels and sidebar controls for custom expansion/collapse.
* **Navigation**: Added "Jump to Top" and "Jump to Bottom" buttons in the sidebar.
* **Display Adjustments**: Added custom color options for the light theme and the ability to truncate heading display lengths.

### Core Features
* Automatically tracks the cursor and highlights the corresponding item in the outline.
* Clicking an outline item scrolls the editor to the target line.
* Preserves and renders WikiLinks, Markdown links, and tags within the outline.

### Installation
*Note: Requires Obsidian v1.4.0 or higher.*

**Community Plugins**
1. Go to **Settings** > **Community plugins**.
2. Turn off *Restricted mode*.
3. Search for **Bullet List Outline** and install.

**Manual**
1. Download `main.js`, `manifest.json`, and `styles.css` from [Releases](https://github.com/yyldps/obsidian-bullet-list-outline/releases).
2. Place them in your vault under `.obsidian/plugins/bullet-list-outline/`.
3. Reload Obsidian and enable the plugin.

### Contact & License
* **Issues**: [GitHub Issues](https://github.com/yyldps/obsidian-bullet-list-outline/issues)
* **Email**: yyldps@163.com
* **License**: [MIT](LICENSE)

### Acknowledgements
* This plugin was inspired by [obsidian-quiet-outline]([https://github.com/author/plugin](https://github.com/guopenghui/obsidian-quiet-outline)). 

---

## 中文说明

一款 Obsidian 侧边栏大纲插件，支持显示无序列表、正文标题以及白板（Canvas）的结构化大纲。

### 近期更新
* **模式开关**：支持通过文档属性（Properties）直接开启或关闭列表大纲模式。
* **大纲切换**：侧边栏自动跟随当前文档适配，目前支持标题大纲、列表大纲和白板大纲。
* **层级控制**：新增全局默认层级展开设置，并支持在侧边栏自定义层级的展开与折叠。
* **快速跳转**：侧边栏新增“跳转至顶部”和“跳转至底部”功能。
* **显示优化**：支持在明亮模式下自定义外观颜色，并支持自定义或限制标题的显示长度。

### 核心功能
* 自动跟随光标位置，在侧边栏高亮当前所在的列表或标题节点。
* 点击大纲节点，正文可直接定位并滚动至对应行。
* 支持解析并渲染大纲中的双链（WikiLinks）、Markdown 链接与标签。

### 安装方式
*注：需要 Obsidian v1.4.0 及以上版本。*

**插件市场安装**
1. 打开 **设置** > **第三方插件**，关闭**安全模式**。
2. 搜索 **Bullet List Outline** 并安装启用。

**手动安装**
1. 从 [Releases](https://github.com/yyldps/obsidian-bullet-list-outline/releases) 下载最新版本的 `main.js`、`manifest.json` 与 `styles.css`。
2. 将文件放入 `.obsidian/plugins/bullet-list-outline/` 文件夹。
3. 重启 Obsidian 并启用插件。

### 联系与协议
* **反馈**：[提交 Issue](https://github.com/yyldps/obsidian-bullet-list-outline/issues)
* **邮箱**：yyldps@163.com
* **开源协议**：[MIT](LICENSE)

### 鸣谢
* 本插件的开发灵感来源于 [obsidian-quiet-outline]([https://github.com/author/plugin](https://github.com/guopenghui/obsidian-quiet-outline)). 
