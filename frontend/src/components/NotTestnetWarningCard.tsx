'use client';

import { useCurrentNetwork, useWalletConnected } from '@/providers/appProvider';

const noticeInfo = {
  title: "Wrong network detected. ",
  subtitle: "Please switch your wallet to the IOTA Testnet.",
  imageUrl: "/assets/testnet-network.png",
  imageAlt: "Wrong network detected.",
  buttonTextStartDiagnostic: "Switch Network",
  buttonTextRunningDiagnostic: "Switching Network...",
};

interface NotTestnetWarningCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonId?: string;
  opacity?: number;
  delay?: number;
  cardState?: 'normal' | 'muted' | 'highlighted';
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
      <section className="max-lg:hidden px-4 sm:px-6 xl:px-12 max-w-7xl mx-auto py-2 sm:py-3">
        <div>
          <div
            className={`rounded-lg shadow-xs transition-all duration-400 ease-out overflow-hidden p-3 sm:p-4 border border-gray-200 bg-gray-100`}
            data-section="diagnostic-tool"
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
                        alt={noticeInfo.imageAlt}
                        src={noticeInfo.imageUrl}
                      />
                    </div>
                  </div>

                  {/* Content Section (Right Column) */}
                  <div className="flex-1 flex flex-col justify-start py-6">
                    {/* Text Content */}
                    <div className="space-y-0.5">
                      <div className="text-sm text-gray-500 font-medium">{noticeInfo.title}</div>
                      <div className="text-lg text-gray-900 font-medium">{noticeInfo.subtitle}</div>
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
