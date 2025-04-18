import { useEffect, useState } from 'react'
import { Button, ButtonType, Input, InputType } from '@iota/apps-ui-kit'
import { useRouter } from 'next/router'

import styles from '~/styles/Admin.module.css'

export default function Admin() {
  const { query } = useRouter()
  const [addressValue, setAddressValue] = useState('')

  useEffect(() => {
    if (typeof query.address === 'string') setAddressValue(query.address)
  }, [query.address])

  const handleAuthorize = () => {
    const event = new CustomEvent('authorize', { detail: { address: addressValue } })
    window.dispatchEvent(event)
  }

  return (
    <div className={styles.card}>
      <Input
        label="Address"
        type={InputType.Text}
        value={addressValue}
        onChange={(e) => setAddressValue(e.target.value)}
      />
      <Button text="Authorize" type={ButtonType.Primary} onClick={handleAuthorize} />
    </div>
  )
}
