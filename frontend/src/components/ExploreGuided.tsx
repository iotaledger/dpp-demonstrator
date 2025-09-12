import React from 'react';

import TutorialCard from './TutorialCard';
import CardHeader from './CardHeader';
import TutorialScrollContainer from './TutorialScrollContainer';
import TwoColumnLayout from './TwoColumnLayout';
import PassportHeader from './PassportHeader';
import ServiceRequestCard from './ServiceRequestCard';
import ProductHeaderCard from './ProductHeaderCard';
import ProductDetailsCard from './ProductDetailsCard';
import RoleDetailsCard from './RoleDetailsCard';
import RewardPoolCard from './RewardPoolCard';
import ServiceHistoryCard from './ServiceHistoryCard';
import EndOfPassportMessage from './EndOfPassportMessage';
import GuidedSidebar from './GuidedSidebar';
import DiagnosticCard from './DiagnosticCard';
import { useTutorialNavigation } from '@/hooks/useTutorialNavigation';

const INITIAL_STEP = 1;
const GUIDE_STEPS = 13;

const ExploreGuided: React.FC = () => {
  const {
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    progress,
    goNext,
    goPrevious,
  } = useTutorialNavigation(INITIAL_STEP, GUIDE_STEPS);

  // TODO: Manage tutorial steps

  const mainContent = (
    <TutorialCard>
      <CardHeader
        canGoBack={true}
        backText='↺ Reset to Intro'
        backUrl='/introduction/1'
        linkText='Switch to free exploration'
        linkUrl='/explore-freely'
        variation='primary'
      />
      <TutorialScrollContainer>
        <div className="dpp-content-container">
          <PassportHeader />
          <ServiceRequestCard />
          <DiagnosticCard />
          <ProductHeaderCard tutorialState='no' />
          <ProductDetailsCard tutorialState='no' />
          <RoleDetailsCard tutorialState='no' />
          <RewardPoolCard tutorialState='no' />
          {/* TODO: Implement Reward Transactions component */}
          <ServiceHistoryCard tutorialState='no' />
          <EndOfPassportMessage />
          <div className="absolute top-4 right-4 z-[70] space-y-3 pointer-events-none" />
        </div>
      </TutorialScrollContainer>
    </TutorialCard>
  );

  const sidebarContent = (
    <GuidedSidebar
      currentStep={currentStep}
      totalSteps={totalSteps}
      progressPercentage={progress}
      canGoPrevious={canGoPrevious}
      canGoNext={canGoNext}
      onPrevious={goPrevious}
      onNext={goNext}
      previousLabel={"Back"}
      nextLabel={"Next"}
    />
  );

  return (
    <TwoColumnLayout
      mainContent={mainContent}
      sidebarContent={sidebarContent}
      sidebarWidth="400px"
      gap="gap-1"
    />
  );
};

export default ExploreGuided;
