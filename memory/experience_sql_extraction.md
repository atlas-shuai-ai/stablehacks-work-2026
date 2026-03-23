# 通用 Web 复杂组件数据提取经验 (Deep-Dive Extraction)

针对现代 Web 应用中常见的复杂组件（如 Monaco/Ace 编辑器、虚拟滚动列表、高度折叠区域），当常规的文本抓取或 UI 截图无法获取完整内容时，应采用“深入 DOM/API 内存”的提取策略。

## 核心方法：API 内存读取与 DOM 深度遍历

### 1. 代码编辑器 (Monaco / Ace / CodeMirror)
此类组件为了性能会只渲染可见区域。必须直接调用其实例 API 获取完整文本。

- **Ace Editor** (当前 TA 平台使用):
  ```javascript
  (function(){
    const el = document.querySelector('.ace_editor');
    return window.ace ? ace.edit(el).getValue() : 'Ace instance not found';
  })()
  ```
- **Monaco Editor** (VS Code Web 版核心):
  ```javascript
  (function(){
    return monaco.editor.getModels()[0].getValue();
  })()
  ```

### 2. 虚拟滚动列表 (Virtual Scroll / Infinite List)
当页面只存在几十行 DOM，但实际有成千上万条数据时：
- **方案 A：触发滚动采集**。通过脚本控制自动 PageDown，并在每一步采集后去重合并。
- **方案 B：拦截 Data Source**。检查全局变量（如 `window.__INITIAL_STATE__` 或 React/Vue 的内部 Store）直接读取原始 JSON 数据。

### 3. 被折叠/动态加载的内容
- **自动触发器**：搜索并模拟点击所有带有“展开”、“更多”、“Show More”关键词的按钮。
- **计算样式覆盖**：通过注入 CSS 强制将 `overflow: hidden` 或 `max-height` 设为 `none`，使隐藏内容在一次性截图中可见。

### 4. 长截图与全页面导出 (Full Page Export)
对于需要完整展示页面内容（而非仅提取文本）的任务：
- **普通长截图**：使用 `agent-browser screenshot --full`。
- **穿透式长截图 (Deep Scroll)**：针对数数平台等带有内部滚动容器 (Overflow-Y: Scroll) 的复杂页面，普通长截图会失效。
  - **解决方法**：先通过 JS 查找到滚动容器，强制修改其样式为 `height: auto !important; overflow: visible !important;`。
  - **然后再执行** `screenshot --full`，即可捕捉到隐藏在容器下方的所有内容。
- **PDF 导出**：如果需要更正式的文档，可以使用 `agent-browser pdf` 将整个页面导出为 PDF 格式。

## 执行原则
- **优先 API**：如果组件暴露了 API（如 `.getValue()`, `.getData()`），永远不要通过解析 HTML 来获取数据。
- **全量视觉**：对于看板展示类需求，优先使用 `--full` 截图；若内容不全，则手动解除容器限制后再截。
- **降级滚动**：如果没有 API 且全页面截图失效，则通过 `window.scrollTo` 配合多步采样。
- **后端思维**：思考数据是如何渲染到页面的，寻找原始数据源往往比解析 UI 更有力。
