'use client';

import React, { useCallback, useState, useTransition } from 'react';

import { useCurrentAccount, useSignTransaction } from '@iota/dapp-kit';

import { createNotarizationEventTransaction, getSponsorGas, sendTransaction } from '@/helpers/api';
import { useProductDetails } from '@/hooks/useProductDetails';
import { useAppProvider, useNotification } from '@/providers/appProvider';
import { fromPosixMsToUtcDateFormat, generateRequestId, getAddressExplorerUrl, getObjectExplorerUrl, truncateAddress } from '@/utils/common';
import {
  DPP_ID,
  MANUFACTURER_DID,
  NETWORK,
} from '@/utils/constants';

import BadgeWithLink from './BadgeWithLink';
import Dialog from './Dialog';
import ItemValueRow from './ItemValueRow';
import CloseIcon from './icons/CloseIcon';
import type { CreateNotarizationEventTransactionArgs, ObjectRef, Transaction } from '@/types/api';
import { NOTIFICATION } from '@/contents/notification';

const diagnosticInfo = {
  technicianName: 'You',
  eventName: 'Health Checkup',
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

  /**
   * Coordinates component state during transaction processing
   */
  const [isPending, startTransition] = useTransition();

  /**
   * Pre-requisit information to send a transaction
   */
  const account = useCurrentAccount();
  const { isLoading, isSuccess: isLoaded, productDetails } = useProductDetails();

  /**
   * To be called in transaction submission
   */
  const { mutateAsync: signTransaction } = useSignTransaction();
  const { handleNotarizationSentSuccess } = useAppProvider();

  /**
   * To notify the user
   */
  const { handleNotificationSent } = useNotification();

  const onNotarizationSuccess = () => {
    startTransition(() => {
      const requestId = generateRequestId();
      handleNotarizationSentSuccess(requestId);
      onSave();
      handleNotificationSent!({
        id: generateRequestId(),
        type: 'success',
        message: NOTIFICATION.savedHealthSnapshot,
      });
    });
  };

  const onNotarizationError = (error: unknown) => {
    console.error('❌ Error while calling sendTransaction.', error);
    handleNotificationSent!({
      id: generateRequestId(),
      type: 'error',
      message: NOTIFICATION.errorSendTransaction,
    });
  };

  const handleClose = () => {
    onClose();
  };

  // Handle ESC key with same logic as close
  const handleEscape = () => {
    onClose();
  };

  const handleSignature = useCallback(
    async (transaction: Transaction) => {
      const { bytes, signature } = await signTransaction({
        // eslint-disable-next-line -- can't use Transaction type because of a package conflict
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
  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      // Simulate API call (replace with actual API call later)
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

        onNotarizationSuccess();
      } catch (error: unknown) {
        onNotarizationError(error);
      } finally {
        onClose();
      }
    });
  };

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
        <div className='mx-auto w-full max-w-xl flex-wrap'>
          {/* Header with close button */}
          <div className='mb-8 flex items-center justify-between'>
            <h2 id='dialog-title' className='text-xl font-semibold text-gray-900'>
              Health Snapshot
            </h2>
            <button
              onClick={onClose}
              className='cursor-pointer p-1 text-gray-400 hover:text-gray-600'
              disabled={isPending}
              aria-label='Close modal'
            >
              <CloseIcon />
            </button>
          </div>

          {/* Data display section matching HTML structure */}
          {isLoaded && (
            <div className='space-y-2'>
              {/* DPP ID */}
              <ItemValueRow
                label='DPP ID'
                labelWidth={150}
                value={truncateAddress(DPP_ID)}
                isLink={true}
                linkHref={getObjectExplorerUrl(DPP_ID)}
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
                      badgeText={productDetails?.billOfMaterials?.manufacturerName}
                      linkText={`did:iota:testnet:${truncateAddress(MANUFACTURER_DID)}`}
                      linkHref={getObjectExplorerUrl(MANUFACTURER_DID)}
                      showVerification={true}
                      verificationDid={productDetails?.manufacturer}
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
                      linkHref={getAddressExplorerUrl(account?.address as string)}
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
          )}

          {/* Save button matching HTML styling */}
          <div className='mt-8'>
            <button
              onClick={handleSave}
              disabled={isPending || isLoading}
              className='focus-visible:ring-ring text-primary-foreground inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-blue-600 bg-blue-700 px-4 py-2 py-3 font-medium text-white transition-all duration-200 ease-out hover:bg-blue-700 hover:bg-blue-700/90 focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50'
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
