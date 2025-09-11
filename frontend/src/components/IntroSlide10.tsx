import React from 'react';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';
import FeaturesGrid from './FeaturesGrid';
import NoticeCard from './NoticeCard';
import ClientCard from './ClientCard';

const IntroSlide10: React.FC = () => {
  return (
    <div className="grid grid-cols-1 items-center self-center md:px-0 w-full mx-auto max-w-6xl py-6 sm:py-0">
      <div className="mb-8 max-w-3xl pt-6 md:pt-0">
        <SlideTitle size="large">Prepare your Wallet</SlideTitle>
        <SlideDescription margin='mb-2' width='max-w-4xl'>
          Desktop extension or mobile app — choose your path for the demo. Both wallets enable secure interaction with this demo without requiring any token balance. Note: Mockup testers don't need a wallet for this walkthrough. We're seeking feedback on storyline, structure, and design.
        </SlideDescription>
      </div>

      <FeaturesGrid columns="grid-cols-2 sm:grid-cols-3" width="max-w-6xl" gap="gap-4">
        <ClientCard
          image="/assets/intro/desktop.webp"
          alt="On desktop"
          title="On desktop"
          description="install the IOTA Browser Wallet extension and connect when prompted"
          opacity={100}
          translateY={0}
          delay={0.25}
        />

        <ClientCard
          image="/assets/intro/mobile.webp"
          alt="On mobile"
          title="On mobile"
          description="install the Nightly Wallet app (iOS or Android) then scan the QR code"
          opacity={100}
          translateY={0}
          delay={0.35}
        />

        <ClientCard
          image="/assets/intro/both.webp"
          alt="Both wallets"
          title="Both wallets"
          description="enable secure interaction with this demo without requiring any token balance"
          opacity={100}
          translateY={0}
          delay={0.45}
        />

        <NoticeCard
          background="bg-gradient-to-br from-blue-500 to-blue-600"
          colSpan="col-span-1 sm:col-span-3"
          delay={0.55}
          opacity={100}
          translateY={0}
        >
          <div className="text-white/80">
            <h4 className="text-sm md:text-sm">
              Note for Demo User: The current walkthrough not require a wallet connection.
              For internal UX & UI feedback only.
            </h4>
          </div>
        </NoticeCard>
      </FeaturesGrid>
    </div>
  );
};

export default IntroSlide10;
