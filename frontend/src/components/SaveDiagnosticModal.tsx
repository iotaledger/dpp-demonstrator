'use client';

import React, { useCallback, useState, useTransition } from 'react';
import Dialog from './Dialog';
import ItemValueRow from './ItemValueRow';
import BadgeWithLink from './BadgeWithLink';
import { FEDERATION_DETAILS, PRODUCT_DETAILS, REWARD_POOL_STATUS } from '@/utils/constants';
import { createDppTx } from '@/helpers/transaction';
import { ObjectRef, Transaction } from '@iota/iota-sdk/transactions';
import { useCurrentAccount, useSignTransaction } from '@iota/dapp-kit';
import { createNotarizationEventTransaction, type CreateNotarizationEventTransactionArgs, getSponsorGas, sendTransaction } from '@/helpers/api';
import { Role } from '@/helpers/federation';
import { useProductDetails } from '@/hooks/useProductDetails';
import { fromPosixMsToUtcDateFormat, truncateAddress } from '@/utils/common';

interface ReserveGasResult {
  sponsor_address: string
  reservation_id: number
  gas_coins: ObjectRef[]
}

export interface ReserveGasResultResponse extends ReserveGasResult {
  gasBudget: number
}

const AUDIT_TRAIL_PKG = "0x1d0b1bdb1b5ff25102e2e9d3858f898cd6c9f016b87b496c2e041f0ac060c5e7";
const WHITELIST_ID = "0xaa90b38876f747ffe4bf405b3639f528e4d78d6230812817bbfd20b5b34e6df6";
const VAULT_ID = REWARD_POOL_STATUS.vaultId;
const CURRENT_CHAIN = "iota:testnet";

const DPP_ID = PRODUCT_DETAILS.dppId;
// TODO: Extract from product details
const MANUFACTURER_NAME = "EcoBike";

interface SaveDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SaveDiagnosticModal: React.FC<SaveDiagnosticModalProps> = ({
  isOpen,
  onClose,
}) => {
  const technicianName = "You";
  // NOTE: what should be the event name? It is empty in the example, but I'm assuming "Health Checkup"
  const eventName = "Health Checkup";
  const eventDate = fromPosixMsToUtcDateFormat(Date.now())
  // NOTE: make an input out or these values?
  const [healthScore, setHealthScore] = useState("76%");
  const [findings, setFindings] = useState("Routine maintenance completed successfully");

  const { mutateAsync: signTransaction } = useSignTransaction();
  const account = useCurrentAccount()
  const [isPending, startTransition] = useTransition();
  const [federationAddress] = useState(FEDERATION_DETAILS.federationAddr);

  const { productDetails, isSuccess } = useProductDetails(DPP_ID);
  const getManufacturerAddress = useCallback(() => {
    if (productDetails) {
      return productDetails?.manufacturer;
    }
    return null;
  }, [productDetails]);

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
      chain: CURRENT_CHAIN,
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
        const sendResult = await sendTransaction(bytes, signature, sponsoredGas.result!.reservation_id!);

        startTransition(() => {
          // TODO: call success notification
          console.log('🟢 Diagnostic snapshot saved successfully');
          onClose();
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'unknownError';
        // TODO: call error notification
      } finally {
        startTransition(() => {
          handleClose();
        });
      }
    });

  }, [handleSignature, handleClose]);

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
            value={
              <div className="flex items-center gap-3">
                <BadgeWithLink
                  badgeText={MANUFACTURER_NAME}
                // className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                />
                {/* TODO: show only when address is loaded */}
                <span className="text-blue-600 font-mono text-sm">{truncateAddress(getManufacturerAddress()!)}</span>
              </div>
            }
          />

          {/* Technician with badge and address */}
          <ItemValueRow
            label="Technician"
            value={
              <div className="flex items-center gap-3">
                <BadgeWithLink
                  badgeText={technicianName}
                // className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
            value={eventName}
          />

          {/* Date */}
          <ItemValueRow
            label="Date"
            value={eventDate}
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
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 bg-blue-700 text-primary-foreground hover:bg-blue-700/90 h-10 px-4 py-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium"
          >
            {isPending ? 'Saving...' : 'Save Snapshot'}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default SaveDiagnosticModal;
