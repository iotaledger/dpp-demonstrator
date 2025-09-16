'use client';

import { useCurrentWallet } from '@iota/dapp-kit';
import React, { useTransition, useCallback, useState } from 'react';
import SaveDiagnosticModal from './SaveDiagnosticModal';

interface DiagnosticCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  userAddress?: string;
  findings?: string;
  buttonText?: string;
  formAction?: string;
  formMethod?: 'POST' | 'GET';
  onSubmit?: (data: { userAddress: string; findings: string }) => void;
  opacity?: number;
  delay?: number;
  cardState?: 'normal' | 'muted' | 'highlighted';
  buttonId?: string;
}

const DiagnosticCard: React.FC<DiagnosticCardProps> = ({
  title = "EcoBike Pro Battery diagnostic tool",
  subtitle = "Annual Health Snapshot",
  description,
  imageUrl = "https://dpp-demo-three.vercel.app/_app/immutable/assets/step_11.DFR7MaqW.webp",
  imageAlt = "Diagnostic tool",
  userAddress = "0xad2f16bc4d93c294d655abfebac363c010f05fb8",
  findings = "Routine maintenance completed successfully",
  buttonText = "Start diagnostic now",
  formAction = "?/submitDiagnostic",
  formMethod = "POST",
  onSubmit,
  opacity = 100,
  delay = 0.4,
  cardState = 'highlighted',
  buttonId = "diagnostic-button"
}) => {
  const { isConnected } = useCurrentWallet();
  const [isPending, startTransition] = useTransition();
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);

  // Handle form submission
  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    startTransition(() => {
      const formData = new FormData(event.currentTarget as HTMLFormElement);
      const data = {
        userAddress: formData.get('userAddress') as string,
        findings: formData.get('findings') as string
      };

      console.log('🔴 Diagnostic form submitted:', data);

      // Call optional onSubmit callback
      onSubmit?.(data);

      // TODO: Replace with actual API call or form handling
      setTimeout(() => {
        console.log('🟢 Diagnostic submission completed');
        // Open save snapshot modal after successful diagnostic
        setIsSnapshotModalOpen(true);
      }, 1000);
    });
  }, [onSubmit]);

  if (!isConnected) {
    return null;
  }

  // Card state styling (following ServiceRequestCard pattern)
  const getCardStateClasses = () => {
    switch (cardState) {
      case 'muted':
        return 'border border-gray-200 !opacity-40';
      case 'highlighted':
        return 'border border-blue-500 !bg-blue-50';
      case 'normal':
      default:
        return 'border border-gray-200 !bg-gray-100';
    }
  };

  return (
    <>
      <section className="px-4 sm:px-6 xl:px-12 max-w-7xl mx-auto py-2 sm:py-3">
        <div>
          <div
            className={`bg-white rounded-lg shadow-xs transition-all duration-400 ease-out overflow-hidden p-3 sm:p-4 ${getCardStateClasses()}`}
            data-card-state={cardState}
            data-section="diagnostic-tool"
            id="diagnostic-tool"
            style={{
              opacity: opacity / 100,
              transition: `opacity ${delay}s ease-out`
            }}
          >
            <div className="transition-all duration-500 ease-out opacity-100 scale-100">
              <div className="p-0">
                {/* Two-column layout matching HTML structure exactly */}
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  {/* Image Section (Left Column) */}
                  <div className="flex justify-center sm:max-w-xs sm:justify-start">
                    <div className="w-full max-h-[220px] bg-blue-50 relative overflow-hidden rounded-lg">
                      <img
                        className="w-full h-full object-cover"
                        alt={imageAlt}
                        src={imageUrl}
                      />
                    </div>
                  </div>

                  {/* Content Section (Right Column) */}
                  <div className="flex-1 flex flex-col justify-center space-y-4 p-6">
                    {/* Text Content */}
                    <div className="space-y-0.5">
                      <div className="text-sm text-gray-500 font-medium">{title}</div>
                      <div className="text-lg text-gray-900 font-medium">{subtitle}</div>
                      {description && (
                        <p className="text-gray-600 mt-2">{description}</p>
                      )}
                    </div>

                    {/* Form Section */}
                    <div className="mt-2 space-y-3">
                      <form method={formMethod} action={formAction} onSubmit={handleSubmit}>
                        {/* Hidden Inputs (matching HTML structure) */}
                        <input type="hidden" name="userAddress" value={userAddress} />
                        <input type="hidden" name="findings" value={findings} />

                        {/* Submit Button */}
                        <button
                          className="inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 bg-blue-700 text-primary-foreground hover:bg-blue-700/90 h-10 px-4 py-2"
                          type="submit"
                          data-diagnostic-button="true"
                          id={buttonId}
                          disabled={isPending}
                        >
                          {isPending ? 'Running diagnostic...' : buttonText}
                        </button>
                      </form>
                      {isPending && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span className="animate-pulse">Analyzing battery health...</span>
                            <span>100%</span></div>
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-75 ease-out shadow-sm"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SaveDiagnosticModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        onSave={() => setIsSnapshotModalOpen(false)}
      />
    </>
  );
};

export default DiagnosticCard;
