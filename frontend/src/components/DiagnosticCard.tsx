'use client';

import React, { useCallback, useMemo, useState, useTransition } from 'react';

import { useProgress } from '@/hooks/useProgress';
import {
  useCurrentNetwork,
  useHierarchySent,
  useNotarizationSent,
  useWalletConnected,
} from '@/providers/appProvider';

import { LoadingBar } from './LoadingBar';
import SaveDiagnosticModal from './SaveDiagnosticModal';

const DIAGNOSTIC_MUTED_STYLE = 'border border-gray-200 !opacity-40';
const DIAGNOSTIC_HIGHLIGHTED_STYLE = 'border border-blue-500 !bg-blue-50';
const DIAGNOSTIC_NORMAL_STYLE = 'border border-gray-200 !bg-gray-100';

const diagnosticInfo = {
  title: 'EcoBike Pro Battery diagnostic tool',
  subtitle: 'Annual Health Snapshot',
  imageUrl: 'https://dpp-demo-three.vercel.app/_app/immutable/assets/step_11.DFR7MaqW.webp',
  imageAlt: 'Diagnostic tool',
  userAddress: '0xad2f16bc4d93c294d655abfebac363c010f05fb8',
  findings: 'Routine maintenance completed successfully',
  buttonTextStartDiagnostic: 'Start diagnostic now',
  buttonTextRunningDiagnostic: 'Running diagnostic...',
};

interface DiagnosticCardProps {
  opacity?: number;
  delay?: number;
  cardState?: 'normal' | 'muted' | 'highlighted';
  onButtonClick?: () => void;
}

const DiagnosticCard: React.FC<DiagnosticCardProps> = ({
  opacity = 100,
  delay = 0.4,
  cardState = 'normal',
  onButtonClick,
}) => {
  const [isPending, startTransition] = useTransition();
  const { progress, startProgress, resetProgress } = useProgress();

  // Handle form submission
  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      resetProgress();

      startTransition(async () => {
        if (!onButtonClick) {
          return;
        }

        console.log('🔴 Diagnostic loading...:');
        const hasCompleted = await startProgress();
        if (hasCompleted) {
          console.log('🟢 Diagnostic loaded');
          startTransition(() => {
            onButtonClick();
          });
        } else {
          console.log('❌ Error while loading diagnostic.');
        }
      });
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * resetProgress and startProgress are stable functions
     */
    [onButtonClick],
  );

  // Card state styling (following ServiceRequestCard pattern)
  const getCardStateClasses = () => {
    switch (cardState) {
      case 'muted':
        return DIAGNOSTIC_MUTED_STYLE;
      case 'highlighted':
        return DIAGNOSTIC_HIGHLIGHTED_STYLE;
      case 'normal':
      default:
        return DIAGNOSTIC_NORMAL_STYLE;
    }
  };

  return (
    <div>
      <div
        className={`overflow-hidden rounded-lg bg-white p-3 shadow-xs transition-all duration-400 ease-out sm:p-4 ${getCardStateClasses()}`}
        data-card-state={cardState}
        data-section='diagnostic-tool'
        id='diagnostic-tool'
        style={{
          opacity: opacity / 100,
          transition: `opacity ${delay}s ease-out`,
        }}
      >
        <div className='scale-100 opacity-100 transition-all duration-500 ease-out'>
          <div className='p-0'>
            {/* Two-column layout matching HTML structure exactly */}
            <div className='flex flex-col sm:flex-row sm:gap-8'>
              {/* Image Section (Left Column) */}
              <div className='flex justify-center sm:max-w-xs sm:justify-start'>
                <div className='relative max-h-[220px] w-full overflow-hidden rounded-lg bg-blue-50'>
                  <img
                    className='h-full w-full object-cover'
                    alt={diagnosticInfo.imageAlt}
                    src={diagnosticInfo.imageUrl}
                  />
                </div>
              </div>

              {/* Content Section (Right Column) */}
              <div className='flex flex-1 flex-col justify-center space-y-4 p-6'>
                {/* Text Content */}
                <div className='space-y-0.5'>
                  <div className='text-sm font-medium text-gray-500'>{diagnosticInfo.title}</div>
                  <div className='text-lg font-medium text-gray-900'>{diagnosticInfo.subtitle}</div>
                  {/* NOTE: Left it commented because it may receive a description latter on */}
                  {/* TODO: Remove if final version doesn't account for this */}
                  {/* <p className="text-gray-600 mt-2">{description}</p> */}
                </div>

                {/* Form Section */}
                <div className='mt-2 space-y-3'>
                  <form onSubmit={handleSubmit}>
                    {/* Submit Button */}
                    <button
                      className='focus-visible:ring-ring text-primary-foreground inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-blue-700 px-4 py-2 transition-all duration-200 ease-out hover:bg-blue-700/90 focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50'
                      type='submit'
                      data-diagnostic-button='true'
                      id={'diagnostic-button'}
                      disabled={isPending}
                    >
                      {isPending
                        ? diagnosticInfo.buttonTextRunningDiagnostic
                        : diagnosticInfo.buttonTextStartDiagnostic}
                    </button>
                  </form>
                  {isPending && (
                    <LoadingBar progress={progress} loadingText='Analyzing battery health...' />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CardWrapperProps {
  cardState?: 'normal' | 'muted' | 'highlighted';
}
const CardWrapper: React.FC<CardWrapperProps> = ({ cardState }) => {
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);

  const { isWalletConnected } = useWalletConnected();
  const { isHierarchySent } = useHierarchySent();
  const { isNotarizationSent } = useNotarizationSent();
  const { notTestnet } = useCurrentNetwork();

  const isAllowedToShowOnLargeScreen = useMemo(() => {
    if (!isWalletConnected || !isHierarchySent || isNotarizationSent || notTestnet) {
      return false;
    }
    return true;
  }, [isWalletConnected, isHierarchySent, isNotarizationSent, notTestnet]);

  // INFO: It doesn't account for testnet check-up
  const isAllowedToShowOnMobileScreen = useMemo(() => {
    if (!isWalletConnected || !isHierarchySent || isNotarizationSent) {
      return false;
    }
    return true;
  }, [isWalletConnected, isHierarchySent, isNotarizationSent]);

  const handleButtonClick = () => {
    setIsSnapshotModalOpen(true);
  };

  return (
    <>
      {/* TODO: Replace by `CollapsibleSection` without button */}
      {isAllowedToShowOnLargeScreen && (
        <CardForLargeScreen>
          <DiagnosticCard cardState={cardState} onButtonClick={handleButtonClick} />
        </CardForLargeScreen>
      )}
      {isAllowedToShowOnMobileScreen && (
        <CardForMobileScreen>
          <DiagnosticCard cardState={cardState} onButtonClick={handleButtonClick} />
        </CardForMobileScreen>
      )}
      <SaveDiagnosticModal
        isOpen={isSnapshotModalOpen}
        onClose={() => {
          setIsSnapshotModalOpen(false);
        }}
        onSave={() => setIsSnapshotModalOpen(false)}
      />
    </>
  );
};

const CardForLargeScreen: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <section className='mx-auto max-w-7xl px-4 py-2 max-lg:hidden sm:px-6 sm:py-3 xl:px-12'>
      {children}
    </section>
  );
};

const CardForMobileScreen: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <section className='mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-3 lg:hidden xl:px-12'>
      {children}
    </section>
  );
};

export default CardWrapper;
