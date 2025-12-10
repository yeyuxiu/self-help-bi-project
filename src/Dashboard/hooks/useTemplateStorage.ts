import { useEffect } from 'react'
import { Template, TemplateComponent } from '../type'
import { STORAGE_KEYS } from '../constants'

export const useTemplateStorage = (
  setComponents: React.Dispatch<React.SetStateAction<TemplateComponent[]>>
) => {
  // 加载保存的模板
  useEffect(() => {
    const savedTemplate = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEMPLATE)
    if (savedTemplate) {
      try {
        const template: Template = JSON.parse(savedTemplate)
        setComponents(template.components)
      } catch (e) {
        console.error('加载模板失败:', e)
      }
    }
  }, [setComponents])

  const saveTemplate = (name: string, components: TemplateComponent[]) => {
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
    } else {
      templates.push(template)
    }

    localStorage.setItem(
      STORAGE_KEYS.CUSTOM_TEMPLATES,
      JSON.stringify(templates)
    )
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TEMPLATE, JSON.stringify(template))
    
    return existingIndex >= 0
  }

  return { saveTemplate }
}

