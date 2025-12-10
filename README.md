 # 项目功能说明

 ## 概览
 - 技术栈：Rsbuild + React 18 + Ant Design 5 + React Query + ECharts。
 - 依赖管理：pnpm。
 - 定位：自助 BI 应用，支持指标探索、图表配置、看板拖拽、报表模板等场景。

 ## 核心模块
 - MetricPortal（指标门户）
   - 指标多选，时间范围筛选，高级条件筛选（字段/操作符/值），维度或时间聚合。
   - 图表类型切换（折线/柱状/饼/面积/散点/雷达/热力/气泡/漏斗/仪表盘/树图等）。
   - 图表配置（平滑、堆叠、配色、半径）与 CSV 导出。
   - 视图保存/应用（若开启相应存储逻辑），可快速复用配置。
   - 智能推荐/模板与配色预设（若开启）：根据指标类型推荐图表或套用模板。
   - 智能洞察摘要（若开启）：数据条数、时间范围、指标统计、维度覆盖度。
 - Board / Dashboard（看板）
   - 图表卡片的新增、编辑、删除与拖拽排序。
   - 图表联动（若实现）：点击图表按时间或维度过滤其他图表。
   - 指标多选、图表类型选择、配置面板（如样式/配色）。
 - ReportTemplate（报表模板）
   - 过滤区（维度/指标/聚合函数/时间）与预览区。
   - 高级筛选条件行编辑。
   - 报表组件聚合配置与保存（视实际实现）。
 - ChartView（通用渲染）
   - 基于 ECharts 渲染多图类型，支持表格/图表双模式。
   - 自动维度列渲染，货币与百分比格式化。
 - 其他公共模块
   - MetricSelector / QueryFilter 等公共筛选组件。
   - Data/ 下的 mock 数据与类型定义；Hooks/ 中的请求与业务逻辑；Utils/ 的导出、数据聚合等工具。

 ## 运行与开发
 ```bash
 pnpm install   # 安装依赖
 pnpm dev       # 开发模式，默认 http://localhost:3000
 pnpm build     # 生产构建
 pnpm preview   # 本地预览生产包
 pnpm check     # Biome 检查并自动修复
 pnpm format    # Biome 格式化
 ```

 ## 目录约定（关键路径）
 - `src/index.tsx`：应用入口挂载，包含 QueryProvider。
 - `src/App.tsx`：路由入口。
 - `src/Routes/`：路由配置。
 - `src/Providers/`：全局 Provider（如 React Query）。
 - `src/MetricPortal/`、`src/Board/`、`src/Dashboard/`、`src/ReportTemplate/`：核心业务页面。
 - `src/ChartView/`：统一的图表/表格展示组件。
 - `src/Components/`：公用 UI 组件（聚合、过滤、配置面板等）。
 - `src/Data/`：mock 数据、类型与图表选项。
 - `src/Hooks/`：数据获取与业务逻辑 hooks。
 - `src/Utils/`：导出、数据聚合、工具函数。

 ## 使用建议
 - 确保 Node 与 pnpm 版本与 `packageManager` 字段一致。
 - 上线前建议执行 `pnpm build` 或 `pnpm check` 确认构建与格式/质量。
 - 若需自定义端口、代理或产物配置，可修改 `rsbuild.config.ts`。
 - 如需接入真实数据源，可在 `Data/` 替换 mock，并在 `Hooks/` 中对接实际接口。

