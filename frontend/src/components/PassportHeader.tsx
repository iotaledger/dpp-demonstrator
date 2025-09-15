import React, { RefObject, useRef } from 'react';
import { ConnectButton } from '@iota/dapp-kit';

interface ConnectButtonProps {
  handleConnect?: () => void;
  connectText?: string;
}


const MyConnectButton: React.FC<ConnectButtonProps> = ({
  handleConnect,
  connectText,
}) => {
  return (
    <button
      className="inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 bg-blue-700 text-primary-foreground hover:bg-blue-700/90 h-10 px-4 py-2 p-6 bg-blue-500 hover:bg-blue-600 text-white"
      id="tutorial-connect-button"
      onClick={handleConnect}
    >
      {connectText}
    </button>
  );
};

const MyWalletConnectedButton: React.FC = () => {
  return (
    <button className=" inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 border border-gray-700  hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 p-6  s-R7G0-bQFHUk3">
      <span className="flex items-center gap-2">
        <div className="flex flex-col items-end text-right">
          <span className="text-xs opacity-75 font-mono">0x5c94...cf1e</span>
        </div>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"></path></svg>
      </span>
    </button>
  );
};

interface PassportHeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  onConnect?: () => void;
  connectText?: string;
  opacity?: number;
  delay?: number;
  tutorialState?: 'selected' | 'muted' | 'no';
}

const PassportHeader: React.FC<PassportHeaderProps> = ({
  logoSrc = "/assets/iota-logo.svg",
  logoAlt = "IOTA Digital Product Passport",
  onConnect,
  connectText = "Connect",
  opacity = 100,
  delay = 0,
  tutorialState = 'no',
}) => {
  const connectRef: RefObject<HTMLButtonElement | null> = useRef(null);

  React.useEffect(() => {
    if (tutorialState === 'selected') {
      (connectRef.current as HTMLElement).focus();
    }
  }, [tutorialState]);

  const handleConnect = () => {
    if (onConnect) {
      onConnect();
    }
  };

  const getConnectionDisabled = () => {
    const disabled = true;
    const enabled = false;
    if (tutorialState === 'muted') {
      return disabled;
    }
    return enabled;
  };

  return (
    <section className="py-0">
      <header
        id="wallet"
        className="bg-white relative z-40"
        style={{
          opacity: opacity / 100,
          transition: `opacity ${delay}s ease-out`
        }}
      >
        <div className="max-w-7xl mx-auto px-6 xl:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* TODO: Load the logo from `/assets` source */}
              <svg
                aria-hidden="true"
                role="figure"
                width="249"
                height="37"
                viewBox="0 0 249 37"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-auto"
              >
                <path d="M58.0306 7.18585H55.335V30.4266H58.0306V7.18585Z" fill="currentColor" />
                <path d="M66.7081 18.7875C66.7081 12.2754 72.2583 6.76017 78.7853 6.76017C85.3502 6.76017 90.8209 12.2343 90.8209 18.7875C90.8209 25.3408 85.3123 30.8149 78.7853 30.8149C72.2962 30.8523 66.7081 25.3408 66.7081 18.7875ZM88.1253 18.7875C88.1253 13.6234 83.8661 9.22837 78.7853 9.22837C73.7045 9.22837 69.4075 13.6234 69.4075 18.7875C69.4075 23.9928 73.7045 28.3841 78.7853 28.3841C83.8661 28.3841 88.1253 23.9928 88.1253 18.7875Z" fill="currentColor" />
                <path d="M104.655 9.6914H96.7232V7.18585H115.248V9.6914H107.313V30.4266H104.617L104.655 9.6914Z" fill="currentColor" />
                <path d="M129.392 10.4233L120.442 30.4266H117.512L127.321 8.4965C127.673 7.68621 128.495 7.18585 129.354 7.18585C130.252 7.18585 131.035 7.68621 131.388 8.4965L141.197 30.4266H138.267L129.392 10.4233Z" fill="currentColor" />
              </svg>
            </div>
            {/* TODO: Set style to connection button */}

            <ConnectButton
              ref={connectRef}
              variant='primary'
              size='md'
              className='transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 active:scale-98 bg-blue-700 text-primary-foreground hover:bg-blue-700/90 h-10 px-4 py-2 p-6 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:text-primary'
              style={{
                '--dapp-kit-backgroundColors-primaryButton': 'var(--color-blue-700)',
                '--dapp-kit-backgroundColors-primaryButtonHover': 'var(--color-blue-600)',
                '--tw-ring-color': 'var(--color-blue-700)',
                color: 'var(--color-primary-foreground)',
              }}
              connectText={'Connect'}
              disabled={getConnectionDisabled()}
            />
          </div>
        </div>
      </header>
    </section>
  );
};

export default PassportHeader;
