# Ant Design 5.x 迁移说明

## 已完成的改造

### 1. 依赖版本更新
- ✅ `antd`: `^6.0.1` → `^5.21.6`
- ✅ `@ant-design/icons`: `5.x` → `^5.5.1` (确保版本匹配)

### 2. 代码兼容性修复

#### ColorPicker 组件移除
- **问题**: Ant Design 5.x 不包含 `ColorPicker` 组件
- **解决方案**: 使用原生 HTML5 `<input type="color">` 替代
- **文件**: `src/Components/ChartConfigPanel/index.tsx`
- **改动**: 
  - 移除了 `ColorPicker` 导入
  - 使用 `<Input type="color">` 和文本输入框组合实现颜色选择

#### Drawer 和 Modal 组件
- ✅ 使用 `open` 属性（Ant Design 5.x 支持）
- ✅ 无需修改

#### 类型导入修复
- ✅ 修复了 `useApiQuery.tsx` 中的类型导入问题
- ✅ 使用 `import type` 进行类型导入

### 3. 图标使用
根据 [Ant Design 5.x 图标文档](https://5x.ant.design/components/icon-cn)：
- ✅ 所有图标都从 `@ant-design/icons` 正确导入
- ✅ 使用 `Outlined` 主题图标（符合 antd5 规范）

## 安装步骤

1. **删除旧的 node_modules 和 lock 文件**（可选，但推荐）:
```bash
rm -rf node_modules pnpm-lock.yaml
```

2. **安装依赖**:
```bash
pnpm install
```

3. **启动项目**:
```bash
pnpm dev
```

## 主要变化

### API 兼容性
- ✅ `Drawer` 使用 `open` 属性（antd5 支持）
- ✅ `Modal` 使用 `open` 属性（antd5 支持）
- ✅ `Tabs` 使用 `items` 属性（antd5 支持）
- ✅ `Menu` 使用 `items` 属性（antd5 支持）

### 移除的功能
- ❌ `ColorPicker` - 已替换为原生 HTML5 颜色选择器

### 保持不变的功能
- ✅ 所有其他组件 API 保持不变
- ✅ 样式系统（Less）保持不变
- ✅ 主题配置保持不变

## 验证清单

- [x] package.json 中的 antd 版本已更新为 5.x
- [x] @ant-design/icons 版本匹配
- [x] ColorPicker 已替换
- [x] 所有组件使用正确的 API
- [x] 类型导入已修复
- [x] 项目可以正常启动

## 参考文档

- [Ant Design 5.x 官方文档](https://5x.ant.design)
- [Ant Design 5.x 图标文档](https://5x.ant.design/components/icon-cn)
- [Ant Design 5.x 迁移指南](https://ant.design/docs/react/migration-v5-cn)

