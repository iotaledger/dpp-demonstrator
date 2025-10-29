'use client';

import React, { useRef } from 'react';
import { ConnectButton } from '@iota/dapp-kit';
import { useWalletUpdateEffects } from '@/hooks/useWalletUpdateEffects';

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
        className='bg-white relative z-40'
        style={{
          opacity: opacity / 100,
          transition: `opacity ${delay}s ease-out`,
        }}
      >
        <div className='max-w-7xl mx-auto px-6 xl:px-12 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {/* TODO: Load the logo from `/assets` source */}
              <svg
                aria-hidden='true'
                role='figure'
                width='249'
                height='37'
                viewBox='0 0 249 37'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
                className='h-8 w-auto'
              >
                <path d='M58.0306 7.18585H55.335V30.4266H58.0306V7.18585Z' fill='currentColor' />
                <path
                  d='M66.7081 18.7875C66.7081 12.2754 72.2583 6.76017 78.7853 6.76017C85.3502 6.76017 90.8209 12.2343 90.8209 18.7875C90.8209 25.3408 85.3123 30.8149 78.7853 30.8149C72.2962 30.8523 66.7081 25.3408 66.7081 18.7875ZM88.1253 18.7875C88.1253 13.6234 83.8661 9.22837 78.7853 9.22837C73.7045 9.22837 69.4075 13.6234 69.4075 18.7875C69.4075 23.9928 73.7045 28.3841 78.7853 28.3841C83.8661 28.3841 88.1253 23.9928 88.1253 18.7875Z'
                  fill='currentColor'
                />
                <path
                  d='M104.655 9.6914H96.7232V7.18585H115.248V9.6914H107.313V30.4266H104.617L104.655 9.6914Z'
                  fill='currentColor'
                />
                <path
                  d='M129.392 10.4233L120.442 30.4266H117.512L127.321 8.4965C127.673 7.68621 128.495 7.18585 129.354 7.18585C130.252 7.18585 131.035 7.68621 131.388 8.4965L141.197 30.4266H138.267L129.392 10.4233Z'
                  fill='currentColor'
                />
              </svg>
            </div>

            {/* NOTE: There is a style method mismatch between this project and dapp-kit UI
             *  because the other uses radix and a custom style and this uses tailwind.
             *  I believe it would be beneficial to decide on which one we should relly on as a whole.
             */}

            <div className='relative'>
              {getShowPopover() && (
                <div className='absolute top-[calc(100%_+_2*4px)] right-[calc(50%_-_20px)] bottom-0 z-[60] pointer-events-none'>
                  <div className='bg-blue-600 text-white px-4 py-3 rounded-lg shadow-xl border border-blue-700 min-w-max max-w-sm relative'>
                    <div className='absolute -top-2 right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-blue-600'></div>
                    <p className='text-sm font-medium whitespace-nowrap'>
                      {'Click "Connect" to continue'}
                    </p>
                  </div>
                </div>
              )}
              <ConnectButton
                ref={connectRef}
                variant='primary'
                size='md'
                className='transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 active:scale-98 bg-blue-700 text-primary-foreground h-10 px-4 py-2 p-6 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:text-primary'
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
