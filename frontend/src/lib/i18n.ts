import en from '~/locales/en'

export const useTranslation = (category: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNestedKey = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  return {
    t: (key: string, params?: { [key: string]: string | number }) => {
      const fullPath = `${category}.${key}`
      let translation = getNestedKey(en, fullPath)

      if (!translation) {
        return key
      }

      if (params && Object.entries(params)?.length) {
        Object.entries(params).forEach(([key, value]) => {
          translation = translation.replace(`{{${key}}}`, String(value))
        })
      }

      return translation
    },
  }
}
