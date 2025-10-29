'use client';

import React, { useCallback, useState, useTransition } from 'react';
import Dialog from './Dialog';
import ItemValueRow from './ItemValueRow';
import BadgeWithLink from './BadgeWithLink';
import {
  DPP_ID,
  FEDERATION_ID,
  MANUFACTURER_DID,
  MANUFACTURER_NAME,
  NETWORK,
} from '@/utils/constants';
import { type ObjectRef, type Transaction } from '@iota/iota-sdk/transactions';
import { useCurrentAccount, useSignTransaction } from '@iota/dapp-kit';
import {
  createNotarizationEventTransaction,
  type CreateNotarizationEventTransactionArgs,
  getSponsorGas,
  sendTransaction,
} from '@/helpers/api';
import { useProductDetails } from '@/hooks/useProductDetails';
import { fromPosixMsToUtcDateFormat, generateRequestId, truncateAddress } from '@/utils/common';
import { useAppProvider, useNotification } from '@/providers/appProvider';

const diagnosticInfo = {
  technicianName: 'You',
  eventName: 'Health Checkup', // NOTE: what should be the event name? It is empty in the example, but I'm assuming "Health Checkup"
  eventDate: fromPosixMsToUtcDateFormat(Date.now()),
  healthScore: '76%',
  findings: 'Routine maintenance completed successfully',
  issuerRole: 'repairer',
};

interface ReserveGasResult {
  sponsor_address: string;
  reservation_id: number;
  gas_coins: ObjectRef[];
}

export interface ReserveGasResultResponse extends ReserveGasResult {
  gasBudget: number;
}

interface SaveDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const SaveDiagnosticModal: React.FC<SaveDiagnosticModalProps> = ({ isOpen, onClose, onSave }) => {
  const [healthScore] = useState(diagnosticInfo.healthScore);
  const [findings] = useState(diagnosticInfo.findings);
  const [federationAddress] = useState(FEDERATION_ID);

  /**
   * Coordinates component state during transaction processing
   */
  const [isPending, startTransition] = useTransition();

  /**
   * Pre-requisit information to send a transaction
   */
  const account = useCurrentAccount();
  const { isLoading } = useProductDetails(DPP_ID);

  /**
   * To be called in transaction submission
   */
  const { mutateAsync: signTransaction } = useSignTransaction();
  const { handleNotarizationSentSuccess } = useAppProvider();

  /**
   * To notify the user
   */
  const { handleNotificationSent } = useNotification();

  // Handle modal close
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle ESC key with same logic as close
  const handleEscape = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleSignature = useCallback(
    async (transaction: Transaction) => {
      const { bytes, signature } = await signTransaction({
        // eslint-disable-next-line -- TODO: replace `any` by Transaction type from dapp-kit, currently not available
        transaction: transaction as any,
        chain: `iota:${NETWORK}`,
      });

      return {
        bytes,
        signature,
      };
    },
    [signTransaction],
  );

  // Handle save snapshot
  const handleSave = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      startTransition(async () => {
        // Simulate API call (replace with actual API call later)
        console.log('🔴 Saving diagnostic snapshot');
        console.log('📋 Federation Address:', federationAddress);

        try {
          const sponsoredGas = await getSponsorGas();
          const txInputs: CreateNotarizationEventTransactionArgs = {
            accountAddress: account!.address,
            gas: sponsoredGas.result!,
            issuerRole: diagnosticInfo.issuerRole,
            entryDataKeys: ['HealthScore', 'Findings'],
            entryDataValues: [healthScore, findings],
          };
          const tx = createNotarizationEventTransaction(txInputs);
          const { bytes, signature } = await handleSignature(tx);
          const { isError } = await sendTransaction(
            bytes,
            signature,
            sponsoredGas.result!.reservation_id!,
          );

          if (isError) {
            throw new Error(isError);
          }

          startTransition(() => {
            const requestId = generateRequestId();
            handleNotarizationSentSuccess(requestId);
            console.log('🟢 Diagnostic snapshot saved successfully');
            onSave();
            handleNotificationSent!({
              id: generateRequestId(),
              type: 'success',
              message: 'Health snapshot saved to service history.',
            });
          });
        } catch (error: unknown) {
          console.log('❌ Error while calling sendTransaction.', (error as Error).message);
          handleNotificationSent!({
            id: generateRequestId(),
            type: 'error',
            message: 'Error while calling sendTransaction.',
          });
        } finally {
          startTransition(() => {
            handleClose();
          });
        }
      });
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * handleNotarizationSentSuccess, handleNotificationSent and onSave are stable functions
     */
    [account, federationAddress, findings, healthScore, handleSignature, handleClose],
  );

  const getButtonText = () => {
    if (isPending) {
      return 'Saving...';
    }

    if (isLoading) {
      return 'Loading...';
    }

    return 'Save Snapshot';
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} onEscape={handleEscape}>
      <div className='overflow-hidden'>
        {/* Match exact HTML structure from save-diagnostic.html */}
        <div className='w-full max-w-xl mx-auto flex-wrap'>
          {/* Header with close button */}
          <div className='flex items-center justify-between mb-8'>
            <h2 id='dialog-title' className='text-xl font-semibold text-gray-900'>
              Health Snapshot
            </h2>
            <button
              onClick={handleClose}
              className='text-gray-400 hover:text-gray-600 p-1 cursor-pointer'
              disabled={isPending}
              aria-label='Close modal'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                ></path>
              </svg>
            </button>
          </div>

          {/* Data display section matching HTML structure */}
          <div className='space-y-2'>
            {/* DPP ID */}
            <ItemValueRow
              label='DPP ID'
              labelWidth={150}
              value={truncateAddress(DPP_ID)}
              isLink={true}
              linkHref={`https://explorer.iota.org/object/${DPP_ID}?network=testnet`}
              fontMono={true}
              valueColor='text-blue-600'
            />

            {/* Manufacturer with badge and address */}
            <ItemValueRow
              label='Manufacturer'
              labelWidth={150}
              isValuePending={isLoading}
              value={
                <div className='flex items-center gap-3'>
                  <BadgeWithLink
                    badgeText={MANUFACTURER_NAME}
                    linkText={`did:iota:testnet:${truncateAddress(MANUFACTURER_DID)}`}
                    linkHref={`https://explorer.iota.org/object/${MANUFACTURER_DID}?network=testnet`}
                    showVerification={true}
                    verificationDid={`did:iota:testnet:${MANUFACTURER_DID}`}
                  />
                </div>
              }
            />

            {/* Technician with badge and address */}
            <ItemValueRow
              label='Technician'
              labelWidth={150}
              value={
                <div className='flex items-center gap-3'>
                  <BadgeWithLink
                    badgeText={diagnosticInfo.technicianName}
                    linkText={`${truncateAddress(account?.address)}`}
                    linkHref={`https://explorer.iota.org/address/${account?.address}?network=testnet`}
                  />
                </div>
              }
            />

            {/* HR Separator */}
            <hr className='my-1 border-[var(--border)]' />

            {/* Event */}
            <ItemValueRow label='Event' labelWidth={150} value={diagnosticInfo.eventName} />

            {/* Date */}
            <ItemValueRow label='Date' labelWidth={150} value={diagnosticInfo.eventDate} />

            {/* HR Separator */}
            <hr className='my-1 border-[var(--border)]' />

            {/* Health Score */}
            <ItemValueRow label='Health Score' labelWidth={150} value={healthScore} />

            {/* Findings */}
            <ItemValueRow label='Findings' labelWidth={150} value={findings} />
          </div>

          {/* Save button matching HTML styling */}
          <div className='mt-8'>
            <button
              onClick={handleSave}
              disabled={isPending || isLoading}
              className='inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 bg-blue-700 text-primary-foreground hover:bg-blue-700/90 h-10 px-4 py-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium'
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SaveDiagnosticModal;
