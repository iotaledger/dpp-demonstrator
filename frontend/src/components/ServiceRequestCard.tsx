'use client';

import React, { useMemo, useState } from 'react';
import ServiceRequestModal from './ServiceRequestModal';
import { useCurrentNetwork, useHierarchySent, useWalletConnected } from '@/providers/appProvider';

const serviceInfo = {
  title: 'Request Service Network Access',
  description:
    'To add information to this Digital Product Passport, you must be certified by EcoBike through their Service Network. Click below to request access as a trusted technician.',
  buttonText: 'Service Network Request',
};

interface ServiceRequestCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonId?: string;
  opacity?: number;
  delay?: number;
  cardState?: 'normal' | 'muted' | 'highlighted';
}

const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({
  opacity = 100,
  delay = 0.4,
  cardState = 'normal',
  onButtonClick,
}) => {
  // Card state styling for tutorial integration
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
    <div>
      <div
        className={`bg-white rounded-lg shadow-xs transition-all duration-400 ease-out overflow-hidden p-4 sm:p-6 ${getCardStateClasses()}`}
        data-card-state={cardState}
        data-section='request'
        id='request'
        style={{
          opacity: opacity / 100,
          transition: `opacity ${delay}s ease-out`,
        }}
      >
        <div className='transition-all duration-500 ease-out opacity-100 scale-100'>
          {/* Header Area */}
          <div className='flex flex-col space-y-1.5 px-0.5'>
            <h3 className='font-semibold leading-none tracking-tight'>{serviceInfo.title}</h3>
          </div>

          {/* Content Area */}
          <div className='p-0 px-0.5'>
            <div className='space-y-4 pt-2'>
              <p className='text-gray-600'>{serviceInfo.description}</p>
              <button
                id='tutorial-request-button'
                className='inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 bg-blue-500 hover:bg-blue-600 text-white h-10 px-4 py-2'
                onClick={onButtonClick}
              >
                {serviceInfo.buttonText}
              </button>
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isWalletConnected } = useWalletConnected();
  const { isHierarchySent } = useHierarchySent();
  const { notTestnet } = useCurrentNetwork();

  const isAllowedToShowOnLargeScreen = useMemo(() => {
    if (!isWalletConnected || isHierarchySent || notTestnet) {
      return false;
    }
    return true;
  }, [isWalletConnected, isHierarchySent, notTestnet]);

  // INFO: It doesn't account for testnet check-up
  const isAllowedToShowOnMobileScreen = useMemo(() => {
    if (!isWalletConnected || isHierarchySent) {
      return false;
    }
    return true;
  }, [isWalletConnected, isHierarchySent]);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {/* TODO: Replace by `CollapsibleSection` without button */}
      {isAllowedToShowOnLargeScreen && (
        <CardForLargeScreen>
          <ServiceRequestCard cardState={cardState} onButtonClick={handleButtonClick} />
        </CardForLargeScreen>
      )}
      {isAllowedToShowOnMobileScreen && (
        <CardForMobileScreen>
          <ServiceRequestCard cardState={cardState} onButtonClick={handleButtonClick} />
        </CardForMobileScreen>
      )}
      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </>
  );
};

const CardForLargeScreen: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <section className='max-lg:hidden px-4 sm:px-6 xl:px-12 max-w-7xl mx-auto py-2 sm:py-3'>
      {children}
    </section>
  );
};

const CardForMobileScreen: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <section className='lg:hidden px-4 sm:px-6 xl:px-12 max-w-7xl mx-auto py-2 sm:py-3'>
      {children}
    </section>
  );
};

export default CardWrapper;
