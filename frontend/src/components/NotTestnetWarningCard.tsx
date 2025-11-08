'use client';

import { useCurrentNetwork, useWalletConnected } from '@/providers/appProvider';
import { NOT_TESTNET_WARNING_CARD } from '@/contents/common';

interface NotTestnetWarningCardProps {
  opacity?: number;
  delay?: number;
}

const NotTestnetWarningCard: React.FC<NotTestnetWarningCardProps> = ({
  opacity = 100,
  delay = 0.4,
}) => {
  const { isWalletConnected } = useWalletConnected();
  const { isTestnet } = useCurrentNetwork();

  if (!isWalletConnected || isTestnet) {
    return null;
  }

  return (
    <>
      <section className='mx-auto max-w-7xl px-4 py-2 max-lg:hidden sm:px-6 sm:py-3 xl:px-12'>
        <div>
          <div
            className={`overflow-hidden rounded-lg border border-gray-200 bg-gray-100 p-3 shadow-xs transition-all duration-400 ease-out sm:p-4`}
            data-section='diagnostic-tool'
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
                        alt={NOT_TESTNET_WARNING_CARD.content.imageAlt}
                        src={NOT_TESTNET_WARNING_CARD.content.imageUrl}
                      />
                    </div>
                  </div>

                  {/* Content Section (Right Column) */}
                  <div className='flex flex-1 flex-col justify-start py-6'>
                    {/* Text Content */}
                    <div className='space-y-0.5'>
                      <div className='text-sm font-medium text-gray-500'>{NOT_TESTNET_WARNING_CARD.content.title}</div>
                      <div className='text-lg font-medium text-gray-900'>{NOT_TESTNET_WARNING_CARD.content.subtitle}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotTestnetWarningCard;
