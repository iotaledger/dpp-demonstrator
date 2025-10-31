'use client';

import React, { useCallback, useState, useTransition } from 'react';

import { useCurrentAccount, useCurrentWallet } from '@iota/dapp-kit';

import { createAccreditation } from '@/helpers/api';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useAppProvider, useNotification } from '@/providers/appProvider';
import { generateRequestId, truncateAddress } from '@/utils/common';
import { FEDERATION_ID, HAS_NFT_REWARD } from '@/utils/constants';

import Dialog from './Dialog';
import CloseIcon from './icons/CloseIcon';
import CopyIcon from './icons/CopyIcon';
import { Roles } from '@/types/identity';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// TODO: Replicate this structure to other components
// Content constants (equivalent to Svelte pageContent)
const MODAL_CONTENT = {
  title: 'Request Service Network Access',
  labels: {
    federationAddress: 'Service Network Address',
    role: 'Role',
  },
  buttons: {
    submit: 'Submit',
    submitting: 'Submitting...',
  },
  messages: {
    successToast: 'Service request submitted successfully!',
    addressCopied: 'Address copied to clipboard!',
  },
};

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { isConnected } = useCurrentWallet();
  const { handleHierarchySentSuccess } = useAppProvider();

  const [isPending, startTransition] = useTransition();
  const [federationAddress] = useState(FEDERATION_ID!);
  const [selectedRole, setSelectedRole] = useState(Roles.Repairer);

  /**
   * To notify the user
   */
  const { handleNotificationSent } = useNotification();

  // Copy to clipboard functionality using extracted hook
  const { copied, copyToClipboard } = useCopyToClipboard({
    successMessage: MODAL_CONTENT.messages.addressCopied,
  });

  const account = useCurrentAccount();

  // Handle modal close
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle ESC key with same logic as close
  const handleEscape = useCallback(() => {
    handleClose();
  }, [handleClose]);

  // Copy federation address to clipboard
  const handleCopyAddress = useCallback(async () => {
    await copyToClipboard(federationAddress);
  }, [federationAddress, copyToClipboard]);

  // Handle form submission
  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      // TODO: Validate inputs, and send error notification if fail
      // like: 'Missing required data to perform the action'
      if (!account?.address) {
        console.warn('❌ Missing account address. You need connect your wallet first.');
        onClose();
      }

      if (HAS_NFT_REWARD) {
        // TODO: Implement QR code interaction route
        // setQrCodeUrl(`${DAPP_URL}/dynamic_redirect?url=${DAPP_URL}/admin?recipient=${account.address}`)
        // setShowQrCode(true)
        console.warn('🚧 reward route not implemented yet!!!');
      }

      startTransition(async () => {
        try {
          // TODO: validate `account.address and `federationAddr`, if fails trigger an error notification
          // like: 'Missing required data to perform the action'

          const { isError } = await createAccreditation(
            federationAddress,
            account!.address,
            selectedRole.value,
          );

          if (isError) {
            throw new Error(isError);
          }

          const requestId = generateRequestId();
          handleHierarchySentSuccess(requestId);

          if (onSuccess) {
            onSuccess();
          }
        } catch (error) {
          console.error('❌ Error while calling createAccreditation.', error);
          handleNotificationSent!({
            id: generateRequestId(),
            type: 'error',
            message: 'Error while requesting accreditation.',
          });
        } finally {
          startTransition(() => {
            onClose();
          });
        }
      });
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * handleHierarchySentSuccess and handleNotificationSent are stable functions
     */
    [federationAddress, selectedRole, account, onClose, onSuccess],
  );

  if (!isConnected) {
    return null;
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} onEscape={handleEscape}>
      {/* Match exact HTML structure from service-request.html */}
      <div className='mx-auto w-full max-w-xl'>
        <div className='mb-8 flex items-center justify-between'>
          <h2 id='dialog-title' className='text-xl font-semibold text-gray-900'>
            {MODAL_CONTENT.title}
          </h2>
          <button
            onClick={handleClose}
            className='cursor-pointer p-1 text-gray-400 hover:text-gray-600 focus-visible:outline-gray-300'
            disabled={isPending}
            aria-label='Close modal'
          >
            <CloseIcon />
          </button>
        </div>

        {/* Match exact form structure and attributes from HTML */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Federation Address - exact structure match */}
          <div className='space-y-2'>
            <label
              htmlFor='federationAddressCopy'
              className='block text-sm font-medium text-gray-700'
            >
              {MODAL_CONTENT.labels.federationAddress}
            </label>
            <div className='relative'>
              <input
                id='federationAddress'
                name='federationAddress'
                type='text'
                readOnly
                value={truncateAddress(federationAddress)}
                onChange={() => { }} // Controlled component requirement
                className='w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500'
                disabled={true}
              />
              <button
                id='federationAddressCopy'
                type='button'
                onClick={handleCopyAddress}
                className='absolute top-1/2 right-2 -translate-y-1/2 transform cursor-pointer p-1 text-gray-400 hover:text-gray-600 focus-visible:outline-gray-300'
                title={copied ? 'Copied!' : 'Copy address'}
                aria-label={copied ? 'Address copied' : 'Copy address'}
              >
                <CopyIcon />
              </button>
            </div>
          </div>

          {/* Role Selection - exact structure match */}
          <div className='space-y-2'>
            <label htmlFor='role' className='block text-sm font-medium text-gray-700'>
              {MODAL_CONTENT.labels.role}
            </label>
            <select
              id='role'
              name='selectedRole'
              value={selectedRole.value}
              onChange={(e) => setSelectedRole(Roles[e.target.value])}
              className='focus-visible focus-visible:ring-ring w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus-visible:outline-gray-300'
            >
              <option value={Roles.Repairer.value}>
                {Roles.Repairer.label}
              </option>
              <option disabled value={Roles.Manufacturer.value}>
                {Roles.Manufacturer.label}
              </option>
            </select>
          </div>

          {/* Submit Button - exact classes match (cleaned up) */}
          <div className='pt-4'>
            <button
              className='focus-visible:ring-ring text-primary-foreground inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-blue-700 px-4 py-2 text-white transition-all duration-200 ease-out hover:bg-blue-700/90 focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50'
              type='submit'
              disabled={isPending}
            >
              {isPending ? MODAL_CONTENT.buttons.submitting : MODAL_CONTENT.buttons.submit}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default ServiceRequestModal;
