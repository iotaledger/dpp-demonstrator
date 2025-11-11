/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useRef } from 'react';

import { ConnectButton } from '@iota/dapp-kit';

import { useWalletUpdateEffects } from '@/hooks/useWalletUpdateEffects';

import IotaLogoIcon from './icons/IotaLogoIcon';

interface PassportHeaderProps {
  opacity?: number;
  delay?: number;
  tutorialState?: 'selected' | 'muted' | 'no';
  showPopover?: boolean;
}

const PassportHeader: React.FC<PassportHeaderProps> = ({
  opacity = 100,
  delay = 0,
  tutorialState = 'no',
  showPopover = false,
}) => {
  useWalletUpdateEffects();
  const connectRef: React.Ref<HTMLButtonElement> = useRef(null);

  const getConnectionDisabled = () => {
    const disabled = true;
    const enabled = false;
    if (tutorialState === 'muted') {
      return disabled;
    }
    return enabled;
  };

  const getShowPopover = () => {
    if (tutorialState === 'selected' && showPopover) {
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    if (tutorialState === 'selected') {
      connectRef.current?.focus();
    }
  }, [tutorialState]);

  return (
    <section className='py-0'>
      <header
        id='wallet'
        className='relative z-40 bg-white'
        style={{
          opacity: opacity / 100,
          transition: `opacity ${delay}s ease-out`,
        }}
      >
        <div className='mx-auto max-w-7xl px-6 py-4 xl:px-12'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <IotaLogoIcon />
            </div>

            <div className='relative'>
              {getShowPopover() && (
                <div className='pointer-events-none absolute top-[calc(100%_+_2*4px)] right-[calc(50%_-_20px)] bottom-0 z-[60]'>
                  <div className='relative max-w-sm min-w-max rounded-lg border border-blue-700 bg-blue-600 px-4 py-3 text-white shadow-xl'>
                    <div className='absolute -top-2 right-4 h-0 w-0 border-r-4 border-b-4 border-l-4 border-r-transparent border-b-blue-600 border-l-transparent'></div>
                    <p className='text-sm font-medium whitespace-nowrap'>
                      {'Click "Connect" to continue'}
                    </p>
                  </div>
                </div>
              )}
              {/* NOTE: ConnectButton is a component from dapp-kit UI and requires an inline CSS customization. */}
              <ConnectButton
                ref={connectRef}
                variant='primary'
                size='md'
                className='text-primary-foreground focus-visible:ring-ring focus-visible:text-primary h-10 bg-blue-700 p-6 px-4 py-2 transition-all duration-200 ease-out hover:bg-blue-600 focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50'
                style={
                  {
                    '--dapp-kit-backgroundColors-primaryButton': 'var(--color-blue-700)',
                    '--dapp-kit-backgroundColors-primaryButtonHover': 'var(--color-blue-600)',
                    '--tw-ring-color': 'var(--color-blue-700)',
                    color: 'var(--color-primary-foreground)',
                  } as React.CSSProperties & {
                    '--dapp-kit-backgroundColors-primaryButton': string;
                    '--dapp-kit-backgroundColors-primaryButtonHover': string;
                    '--tw-ring-color': string;
                  }
                }
                connectText={'Connect'}
                disabled={getConnectionDisabled()}
              />
            </div>
          </div>
        </div>
      </header>
    </section>
  );
};

export default PassportHeader;
