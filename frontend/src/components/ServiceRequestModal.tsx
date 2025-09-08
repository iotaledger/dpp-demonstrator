'use client';

import React, { useState, useTransition, useCallback } from 'react';
import { useCurrentAccount, useCurrentWallet, useSignTransaction } from '@iota/dapp-kit';
import Dialog from './Dialog';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { createDppTx } from '@/helpers/transaction';
import { AUDIT_TRAIL_DETAILS, FEDERATION_DETAILS, HAS_NFT_REWARD, PRODUCT_DETAILS, REWARD_POOL_STATUS } from '@/utils/constants';
import { ObjectRef } from '@iota/iota-sdk/transactions'
import { createAccreditation } from '@/helpers/api';
import { Role } from '@/helpers/federation';
import { truncateAddress } from '@/utils/common';

const HAS_REWARD = HAS_NFT_REWARD;

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// TODO: Replicate this structure to other components
// Content constants (equivalent to Svelte pageContent)
const MODAL_CONTENT = {
  title: "Request Service Network Access",
  labels: {
    federationAddress: "Service Network Address",
    role: "Role"
  },
  roleOptions: {
    [Role.manufacturer]: { label: "Manufacturer", value: Role.manufacturer },
    [Role.repairer]: { label: "Service Technician", value: Role.repairer },
  },
  buttons: {
    submit: "Submit",
    submitting: "Submitting..."
  },
  messages: {
    successToast: "Service request submitted successfully!",
    addressCopied: "Address copied to clipboard!"
  }
};

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { isConnected } = useCurrentWallet();

  const [isPending, startTransition] = useTransition();
  const [federationAddress] = useState(FEDERATION_DETAILS.federationAddr);
  const [selectedRole, setSelectedRole] = useState(MODAL_CONTENT.roleOptions[Role.repairer]);

  // Copy to clipboard functionality using extracted hook
  const { copied, copyToClipboard } = useCopyToClipboard({
    successMessage: MODAL_CONTENT.messages.addressCopied,
    onSuccess: () => {
      // For now just log success - will be replaced with toast system later
      console.log('✅ Address copied to clipboard');
    },
    onError: (error) => {
      console.error('❌ Failed to copy address:', error);
    }
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
  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    // TODO: Validate inputs, and send error notification if fail
    // like: 'Missing required data to perform the action'
    if (!account?.address) {
      console.log('❌ Missing account address. You need connect your wallet first.');
      onClose();
    }

    if (HAS_REWARD) {
      // TODO: Implement QR code interaction route
      // setQrCodeUrl(`${DAPP_URL}/dynamic_redirect?url=${DAPP_URL}/admin?recipient=${account.address}`)
      // setShowQrCode(true)
      console.log('🚧 reward route not implemented yet!!!');
    }

    startTransition(async () => {
      // Simulate API call (replace with actual API call later)
      console.log('🔴 Form submit started');
      console.log('📋 Federation Address:', federationAddress);
      console.log('👤 Selected Role:', selectedRole.label);

      try {
        // TODO: validate `account.address and `federationAddr`, if fails trigger an error notification
        // like: 'Missing required data to perform the action'

        const { isError, result } = await createAccreditation(federationAddress, account!.address, selectedRole.value);
        if (isError) throw new Error(isError || 'unknownError')
        // TODO: notification success
      } catch (error) {
        console.log('❌ Error while calling createAccreditation.');
        const message = error instanceof Error ? error.message : 'unknownError'
        // TODO: notification error
      } finally {
        startTransition(() => {
          onClose();
        });
      }
    });
  }, [federationAddress, selectedRole, account, onClose, onSuccess]);

  if (!isConnected) {
    return null;
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      onEscape={handleEscape}
    >
      {/* Match exact HTML structure from service-request.html */}
      <div className="w-full max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 id="dialog-title" className="text-xl font-semibold text-gray-900">
            {MODAL_CONTENT.title}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            disabled={isPending}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Match exact form structure and attributes from HTML */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Federation Address - exact structure match */}
          <div className="space-y-2">
            <label htmlFor="federationAddress" className="block text-sm font-medium text-gray-700">
              {MODAL_CONTENT.labels.federationAddress}
            </label>
            <div className="relative">
              <input
                id="federationAddress"
                name="federationAddress"
                type="text"
                readOnly
                value={truncateAddress(federationAddress)}
                onChange={() => { }} // Controlled component requirement
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
              <button
                type="button"
                onClick={handleCopyAddress}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                title={copied ? "Copied!" : "Copy address"}
                aria-label={copied ? "Address copied" : "Copy address"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Role Selection - exact structure match */}
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              {MODAL_CONTENT.labels.role}
            </label>
            <select
              id="role"
              name="selectedRole"
              value={selectedRole.value}
              onChange={(e) => setSelectedRole(MODAL_CONTENT.roleOptions[e.target.value as Role])}
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={MODAL_CONTENT.roleOptions[Role.repairer].value}>{MODAL_CONTENT.roleOptions[Role.repairer].label}</option>
              <option disabled value={MODAL_CONTENT.roleOptions[Role.manufacturer].value}>{MODAL_CONTENT.roleOptions[Role.manufacturer].label}</option>
            </select>
          </div>

          {/* Submit Button - exact classes match (cleaned up) */}
          <div className="pt-4">
            <button
              className="inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 bg-blue-700 text-primary-foreground hover:bg-blue-700/90 h-10 px-4 py-2 w-full text-white"
              type="submit"
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
