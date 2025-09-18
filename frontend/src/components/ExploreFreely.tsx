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
import { useHierarchySent, useNotarizationSent } from '@/providers/appProvider';
import { Notifications } from './Notifications';

const ExploreFreely: React.FC = () => {
  const { isHierarchySent } = useHierarchySent();
  const { isNotarizationSent } = useNotarizationSent();
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
          {!isHierarchySent && <ServiceRequestCard />}
          {isHierarchySent && !isNotarizationSent && <DiagnosticCard />}
          <ProductHeaderCard />
          <ProductDetailsCard />
          <RoleDetailsCard />
          <RewardPoolCard />
          {/* TODO: Implement Reward Transactions component */}
          <ServiceHistoryCard />
          <EndOfPassportMessage />
          <Notifications />
        </div>
      </TutorialScrollContainer>
    </TutorialCard>
  );
};

export default ExploreFreely;
