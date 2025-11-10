import i18n from '@/i18n';

const t = i18n.t;

export const NOTIFICATION = {
  content: {
    savedHealthSnapshot: t('Health snapshot saved to service history.'),
    errorSendTransaction: t('Error while calling sendTransaction.'),
    submittedAccreditation: t('Service request submitted successfully!'),
    errorAccreditation: t('Error while requesting accreditation.'),
    connectedWallet: t('Wallet connected successfully! You can now request service access.'),
    approvedRole: t('Role request approved! You can now access diagnostic tools.'),
  },
};
