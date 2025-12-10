import { message } from 'antd'
import { Template, TemplateComponent } from '../type'
import { STORAGE_KEYS } from '../constants'

/**
 * 保存模板到本地存储
 */
export const saveTemplateToStorage = (
  name: string,
  components: TemplateComponent[]
): boolean => {
  const template: Template = {
    id: Date.now().toString(),
    name,
    components,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const savedTemplates = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEMPLATES)
  let templates: Template[] = []
  if (savedTemplates) {
    try {
      templates = JSON.parse(savedTemplates)
    } catch (e) {
      console.error('解析模板列表失败:', e)
    }
  }

  const existingIndex = templates.findIndex((t) => t.name === name)
  if (existingIndex >= 0) {
    templates[existingIndex] = template
    message.success('模板已更新')
  } else {
    templates.push(template)
    message.success('模板保存成功')
  }

  localStorage.setItem(
    STORAGE_KEYS.CUSTOM_TEMPLATES,
    JSON.stringify(templates)
  )
  localStorage.setItem(STORAGE_KEYS.CUSTOM_TEMPLATE, JSON.stringify(template))
  
  return existingIndex >= 0
}

/**
 * 从本地存储加载模板
 */
export const loadTemplateFromStorage = (): TemplateComponent[] => {
  const savedTemplate = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEMPLATE)
  if (savedTemplate) {
    try {
      const template: Template = JSON.parse(savedTemplate)
      return template.components
    } catch (e) {
      console.error('加载模板失败:', e)
    }
  }
  return []
}

