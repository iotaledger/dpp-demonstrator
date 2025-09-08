import React from 'react';
import SlideContent from './SlideContent';
import SlideTitle from './SlideTitle';
import SlideDescription from './SlideDescription';
import FeaturesGrid from './FeaturesGrid';
import FeatureCard from './FeatureCard';
import NoticeCard from './NoticeCard';

const Slide9: React.FC = () => {
  return (
    <>
      <div className="mb-10 pt-4 md:pt-0">
        <SlideContent textAlign="center" opacity={100} translateY={0} delay={0.15}>
          <SlideTitle size="large">Prepare your Wallet</SlideTitle>
          <SlideDescription>
            Desktop extension or mobile app — choose your path for the demo. Both wallets 
            enable secure interaction with this demo without requiring any token balance.
            <br /><br />
            Note: Mockup testers don't need a wallet for this walkthrough. We're seeking 
            feedback on storyline, structure, and design.
          </SlideDescription>
        </SlideContent>
      </div>

      <div className="relative pb-6 md:pb-0">
        <FeaturesGrid columns="grid-cols-2 sm:grid-cols-3" gap="gap-4">
          <FeatureCard
            image="/assets/intro/desktop.webp"
            alt="On desktop"
            title="On desktop"
            description="install the IOTA Browser Wallet extension and connect when prompted"
            opacity={100}
            translateY={0}
            delay={0.25}
            titleWeight="semibold"
            variant="default"
          />
          
          <FeatureCard
            image="/assets/intro/mobile.webp"
            alt="On mobile"
            title="On mobile"
            description="install the Nightly Wallet app (iOS or Android) then scan the QR code"
            opacity={100}
            translateY={0}
            delay={0.35}
            titleWeight="semibold"
            variant="default"
          />
          
          <FeatureCard
            image="/assets/intro/both.webp"
            alt="Both wallets"
            title="Both wallets"
            description="enable secure interaction with this demo without requiring any token balance"
            opacity={100}
            translateY={0}
            delay={0.45}
            colSpan="col-span-1 sm:col-span-1"
            titleWeight="semibold"
            variant="default"
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
    </>
  );
};

export default Slide9;