type T = (key: string, params?: { [key: string]: string | number }) => string

export default function (role: string, t: T) {
  if (role === 'Repairer') {
    return t('Repairment')
  }

  return undefined
}
