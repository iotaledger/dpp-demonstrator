import { SnackbarType } from '@iota/apps-ui-kit'

type CopyToClipboardParams = {
  text: string
  onResult: (message: { text: string; snackbarType: SnackbarType }) => void
  t: (key: string) => string
}

export const copyToClipboard = ({ text, onResult, t }: CopyToClipboardParams) => {
  if (!text) return

  navigator.clipboard
    .writeText(text)
    .then(() => {
      onResult({ text: t('copiedToClipboard'), snackbarType: SnackbarType.Default })
    })
    .catch(() => {
      onResult({ text: t('copyFailed'), snackbarType: SnackbarType.Error })
    })
}
