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
import GuidedSidebar from './GuidedSidebar';
import DiagnosticCard from './DiagnosticCard';
import { useTutorialNavigation } from '@/hooks/useTutorialNavigation';
import { Notifications } from './Notifications';
import RewardTransactionsCard from './RewardTransactionsCard';
import { useCurrentWallet, useWallets } from '@iota/dapp-kit';
import { useHierarchySent, useNotarizationSent } from '@/providers/appProvider';

const INITIAL_STEP = 1;
const TUTORIAL_STEPS = new Map([
  [1, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='selected' />,
  ]],
  [2, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='selected' />,
  ]],
  [3, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='manufacturerSelected' />,
  ]],
  [4, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='networkSelected' />,
  ]],
  [5, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='muted' />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='selected' />,
  ]],
  [6, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='muted' />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='muted' />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='selected' />,
  ]],
  [7, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='muted' />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='muted' />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='muted' />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='selected' />,
  ]],
  [8, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='no' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='no' />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='no' />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='no' />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='no' />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='no' />,
  ]],
  [9, [
    <PassportHeader key={'passportHeader'} tutorialState='selected' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='open-muted' />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='open-muted' />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='open-muted' />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='open-muted' />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='open-muted' />,
  ]],
  [10, [
    <PassportHeader key={'passportHeader'} tutorialState='no' />,
    <ServiceRequestCard key={'ServiceRequestCard'} cardState='highlighted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='open-muted' />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='open-muted' />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='open-muted' />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='open-muted' />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='open-muted' />,
  ]],
  [11, [
    <PassportHeader key={'passportHeader'} tutorialState='no' />,
    <DiagnosticCard key={'DiagnosticCard'} cardState='highlighted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='open-muted' />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='open-muted' />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='open-muted' />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='open-muted' />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='open-muted' />,
  ]],
  [12, [
    <PassportHeader key={'passportHeader'} tutorialState='no' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='muted' />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='muted' />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='muted' />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='detailsSelected' />,
  ]],
  [13, [
    <PassportHeader key={'passportHeader'} tutorialState='no' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='muted' />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='muted' />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='muted' />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='rewardSelected' />,
  ]],
]);

const ExploreGuided: React.FC = () => {
  const {
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    isGoingPrevious,
    progress,
    goNext,
    goPrevious,
  } = useTutorialNavigation(INITIAL_STEP, TUTORIAL_STEPS.size);

  const { isConnected } = useCurrentWallet();
  const { isHierarchySent } = useHierarchySent();
  const { isNotarizationSent } = useNotarizationSent()

  React.useEffect(() => {
    if (!isGoingPrevious && currentStep === 9 && isConnected) {
      // Next when connected
      goNext();
    } else if (!isGoingPrevious && currentStep === 10 && isConnected && isHierarchySent) {
      // Next when accreditation request is success
      goNext();
    } else if (!isGoingPrevious && currentStep === 11 && isConnected && isNotarizationSent) {
      // Next when diagnostic request is success
      goNext();
    }
  }, [currentStep, isConnected, isHierarchySent, isNotarizationSent]);

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
          {TUTORIAL_STEPS.get(currentStep)}
          <Notifications />
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
