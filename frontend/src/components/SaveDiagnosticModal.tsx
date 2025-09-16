'use client';

import React, { useCallback, useState, useTransition } from 'react';
import Dialog from './Dialog';
import ItemValueRow from './ItemValueRow';
import BadgeWithLink from './BadgeWithLink';
import { DPP_ID, FEDERATION_ID, MANUFACTURER_NAME, NETWORK } from '@/utils/constants';
import { ObjectRef, Transaction } from '@iota/iota-sdk/transactions';
import { useCurrentAccount, useSignTransaction } from '@iota/dapp-kit';
import { createNotarizationEventTransaction, type CreateNotarizationEventTransactionArgs, getSponsorGas, sendTransaction } from '@/helpers/api';
import { Role } from '@/helpers/federation';
import { useProductDetails } from '@/hooks/useProductDetails';
import { fromPosixMsToUtcDateFormat, generateRequestId, truncateAddress } from '@/utils/common';
import { useAppProvider } from '@/providers/appProvider';

const diagnosticInfo = {
  technicianName: "You",
  eventName: "Health Checkup", // NOTE: what should be the event name? It is empty in the example, but I'm assuming "Health Checkup"
  eventDate: fromPosixMsToUtcDateFormat(Date.now()),
  healthScore: "76%",
  findings: "Routine maintenance completed successfully",
};

interface ReserveGasResult {
  sponsor_address: string
  reservation_id: number
  gas_coins: ObjectRef[]
}

export interface ReserveGasResultResponse extends ReserveGasResult {
  gasBudget: number
}

interface SaveDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const SaveDiagnosticModal: React.FC<SaveDiagnosticModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  // NOTE: These values should be collected by user input?
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
  const account = useCurrentAccount()
  const { productDetails, isLoading } = useProductDetails(DPP_ID);

  /**
   * To be called in transaction submission
   */
  const { mutateAsync: signTransaction } = useSignTransaction();
  const { handleNotarizationSentSuccess } = useAppProvider();

  // Handle modal close
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle ESC key with same logic as close
  const handleEscape = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleSignature = useCallback(async (transaction: Transaction) => {
    const { bytes, signature } = await signTransaction({
      transaction,
      chain: `iota:${NETWORK}`,
    })

    return {
      bytes,
      signature,
    }
  }, [signTransaction])

  // Handle save snapshot
  const handleSave = useCallback(async (event: React.FormEvent) => {
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
          issuerRole: Role.manufacturer,
          entryDataKeys: ['HealthScore', 'Findings'],
          entryDataValues: [healthScore, findings],
        };
        const tx = createNotarizationEventTransaction(txInputs);
        const { bytes, signature } = await handleSignature(tx);
        const { result, isError } = await sendTransaction(bytes, signature, sponsoredGas.result!.reservation_id!);

        if (isError) {
          throw new Error(isError);
        }

        startTransition(() => {
          const requestId = generateRequestId();
          handleNotarizationSentSuccess(requestId);
          console.log('🟢 Diagnostic snapshot saved successfully');
          onSave();
          // TODO: call success notification
        });
      } catch (error: unknown) {
        console.log('❌ Error while calling sendTransaction.', (error as Error).message);
        const message = error instanceof Error ? error.message : 'unknownError';
        // TODO: call error notification
      } finally {
        startTransition(() => {
          handleClose();
        });
      }
    });

  }, [handleSignature, handleClose]);

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
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      onEscape={handleEscape}
    >
      {/* Match exact HTML structure from save-diagnostic.html */}
      <div className="w-full max-w-xl mx-auto">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-8">
          <h2 id="dialog-title" className="text-xl font-semibold text-gray-900">
            Health Snapshot
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

        {/* Data display section matching HTML structure */}
        <div className="space-y-2">
          {/* DPP ID */}
          <ItemValueRow
            label="DPP ID"
            value={truncateAddress(DPP_ID)}
            fontMono={true}
            valueColor='text-blue-600'
          />

          {/* Manufacturer with badge and address */}
          <ItemValueRow
            label="Manufacturer"
            isValuePending={isLoading}
            value={
              <div className="flex items-center gap-3">
                <BadgeWithLink
                  badgeText={MANUFACTURER_NAME}
                />
                <span className="text-blue-600 font-mono text-sm">{truncateAddress(productDetails?.manufacturer)}</span>
              </div>
            }
          />

          {/* Technician with badge and address */}
          <ItemValueRow
            label="Technician"
            value={
              <div className="flex items-center gap-3">
                <BadgeWithLink
                  badgeText={diagnosticInfo.technicianName}
                />
                <span className="text-blue-600 font-mono text-sm">{truncateAddress(account?.address)}</span>
              </div>
            }
          />

          {/* HR Separator */}
          <hr className="my-1" />

          {/* Event */}
          <ItemValueRow
            label="Event"
            value={diagnosticInfo.eventName}
          />

          {/* Date */}
          <ItemValueRow
            label="Date"
            value={diagnosticInfo.eventDate}
          />

          {/* HR Separator */}
          <hr className="my-1" />

          {/* Health Score */}
          <ItemValueRow
            label="Health Score"
            value={healthScore}
          />

          {/* Findings */}
          <ItemValueRow
            label="Findings"
            value={findings}
          />
        </div>

        {/* Save button matching HTML styling */}
        <div className="mt-8">
          <button
            onClick={handleSave}
            disabled={isPending || isLoading}
            className="inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 bg-blue-700 text-primary-foreground hover:bg-blue-700/90 h-10 px-4 py-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium"
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default SaveDiagnosticModal;
