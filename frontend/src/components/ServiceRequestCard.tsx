'use client';

import React, { useMemo, useState } from 'react';

import { useCurrentNetwork, useHierarchySent, useWalletConnected } from '@/providers/appProvider';

import ServiceRequestModal from './ServiceRequestModal';

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
        className={`overflow-hidden rounded-lg bg-white p-4 shadow-xs transition-all duration-400 ease-out sm:p-6 ${getCardStateClasses()}`}
        data-card-state={cardState}
        data-section='request'
        id='request'
        style={{
          opacity: opacity / 100,
          transition: `opacity ${delay}s ease-out`,
        }}
      >
        <div className='scale-100 opacity-100 transition-all duration-500 ease-out'>
          {/* Header Area */}
          <div className='flex flex-col space-y-1.5 px-0.5'>
            <h3 className='leading-none font-semibold tracking-tight'>{serviceInfo.title}</h3>
          </div>

          {/* Content Area */}
          <div className='p-0 px-0.5'>
            <div className='space-y-4 pt-2'>
              <p className='text-gray-600'>{serviceInfo.description}</p>
              <button
                id='tutorial-request-button'
                className='focus-visible:ring-ring inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-white transition-all duration-200 ease-out hover:bg-blue-600 focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50'
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
