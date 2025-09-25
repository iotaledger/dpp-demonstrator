import { useCurrentNetwork, useWalletConnected } from '@/providers/appProvider';
import { clsx } from 'clsx';

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
      <section className="px-4 sm:px-6 xl:px-12 max-w-7xl mx-auto py-2 sm:py-3">
        <div>
          <div
            className={clsx(['bg-white rounded-lg shadow-xs transition-all duration-400 ease-out overflow-hidden p-4 sm:p-6', 'bg-yellow-50 border border-yellow-200 text-yellow-800'])}
            style={{
              opacity: opacity / 100,
              transition: `opacity ${delay}s ease-out`
            }}
          >
            <div className="transition-all duration-500 ease-out opacity-100 scale-100">
              {/* Header Area */}
              <div className="flex flex-col space-y-1.5 px-0.5">
                <h3 className="font-semibold leading-none tracking-tight">{"Not connected to testnet"}</h3>
              </div>

              {/* Content Area */}
              <div className="p-0 px-0.5">
                <div className="space-y-4 pt-2">
                  <p className="text-gray-600">{"The app is aimed to operate in a testnet environment. Please, configure your wallet to use the testnet network."}</p>
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
