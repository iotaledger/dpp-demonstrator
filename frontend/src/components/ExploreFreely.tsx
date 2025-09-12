import React from 'react';

import TutorialCard from './TutorialCard';
import CardHeader from './CardHeader';
import TutorialScrollContainer from './TutorialScrollContainer';
import PassportHeader from './PassportHeader';
import ServiceRequestCard from './ServiceRequestCard';
import DiagnosticCard from './DiagnosticCard';
import ProductHeaderCard from './ProductHeaderCard';
import ProductDetailsCard from './ProductDetailsCard';
import RoleDetailsCard from './RoleDetailsCard';
import RewardPoolCard from './RewardPoolCard';
import ServiceHistoryCard from './ServiceHistoryCard';
import EndOfPassportMessage from './EndOfPassportMessage';

const ExploreFreely: React.FC = () => {
  return (
    <TutorialCard>
      <CardHeader
        canGoBack={true}
        backText='↺ Reset to Intro'
        backUrl='/introduction/1'
        linkText='Switch to Guided Tour'
        linkUrl='/explore-guided'
      />
      <TutorialScrollContainer>
        <div className="dpp-content-container">
          <PassportHeader />
          <ServiceRequestCard />
          <DiagnosticCard />
          <ProductHeaderCard />
          <ProductDetailsCard />
          <RoleDetailsCard />
          <RewardPoolCard />
          {/* TODO: Implement Reward Transactions component */}
          <ServiceHistoryCard />
          <EndOfPassportMessage />
          <div className="absolute top-4 right-4 z-[70] space-y-3 pointer-events-none" />
        </div>
      </TutorialScrollContainer>
    </TutorialCard>
  );
};

export default ExploreFreely;
