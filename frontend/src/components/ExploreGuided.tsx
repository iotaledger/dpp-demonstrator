'use client';

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
import { useCurrentWallet, useDisconnectWallet } from '@iota/dapp-kit';
import { useHierarchySent, useNotarizationSent } from '@/providers/appProvider';
import NotTestnetWarningCard from './NotTestnetWarningCard';

const INITIAL_STEP = 1;
const TUTORIAL_STEPS = new Map([
  [1, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='selected' />,
  ]],
  [2, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='selected' scrollIntoView={true} />,
  ]],
  [3, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' scrollIntoView={true} />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='manufacturerSelected' scrollIntoView={true} />,
  ]],
  [4, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' scrollIntoView={true} />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='networkSelected' scrollIntoView={true} />,
  ]],
  [5, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' scrollIntoView={true} />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='muted' scrollIntoView={true} />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='selected' scrollIntoView={true} />,
  ]],
  [6, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' scrollIntoView={true} />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='muted' scrollIntoView={true} />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='muted' scrollIntoView={true} />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='selected' scrollIntoView={true} />,
  ]],
  [7, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' scrollIntoView={true} />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='muted' scrollIntoView={true} />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='muted' scrollIntoView={true} />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='muted' scrollIntoView={true} />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='selected' scrollIntoView={true} />,
  ]],
  [8, [
    <PassportHeader key={'passportHeader'} tutorialState='muted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='no' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='no' scrollIntoView={true} />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='no' scrollIntoView={true} />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='no' scrollIntoView={true} />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='no' scrollIntoView={true} />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='no' scrollIntoView={true} />,
  ]],
  [9, [
    <PassportHeader key={'passportHeader'} tutorialState='selected' showPopover={true} />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='open-muted' scrollIntoView={true} />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='open-muted' scrollIntoView={true} />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='open-muted' scrollIntoView={true} />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='open-muted' scrollIntoView={true} />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='open-muted' scrollIntoView={true} />,
  ]],
  [10, [
    <PassportHeader key={'passportHeader'} tutorialState='no' />,
    <NotTestnetWarningCard key={'NotTestnetWarningCard'} />,
    <ServiceRequestCard key={'ServiceRequestCard'} cardState='highlighted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='open-muted' scrollIntoView={true} />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='open-muted' scrollIntoView={true} />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='open-muted' scrollIntoView={true} />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='open-muted' scrollIntoView={true} />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='open-muted' scrollIntoView={true} />,
  ]],
  [11, [
    <PassportHeader key={'passportHeader'} tutorialState='no' />,
    <NotTestnetWarningCard key={'NotTestnetWarningCard'} />,
    <DiagnosticCard key={'DiagnosticCard'} cardState='highlighted' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='open-muted' scrollIntoView={true} />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='open-muted' scrollIntoView={true} />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='open-muted' scrollIntoView={true} />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='open-muted' scrollIntoView={true} />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='open-muted' scrollIntoView={true} />,
  ]],
  [12, [
    <PassportHeader key={'passportHeader'} tutorialState='no' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' scrollIntoView={true} />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='muted' scrollIntoView={true} />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='muted' scrollIntoView={true} />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='muted' scrollIntoView={true} />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='detailsSelected' scrollIntoView={true} />,
  ]],
  [13, [
    <PassportHeader key={'passportHeader'} tutorialState='no' />,
    <ProductHeaderCard key={'ProductHeaderCard'} tutorialState='muted' />,
    <ProductDetailsCard key={'ProductDetailsCard'} tutorialState='muted' scrollIntoView={true} />,
    <RoleDetailsCard key={'RoleDetailsCard'} tutorialState='muted' scrollIntoView={true} />,
    <RewardPoolCard key={'RewardPoolCard'} tutorialState='muted' scrollIntoView={true} />,
    <RewardTransactionsCard key={'RewardTransactionsCard'} tutorialState='muted' scrollIntoView={true} />,
    <ServiceHistoryCard key={'ServiceHistoryCard'} tutorialState='rewardSelected' scrollIntoView={true} />,
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
  const { mutateAsync } = useDisconnectWallet();

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
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * goNext is a stable function that doesn't require to be a dependency.
     */
  }, [currentStep, isConnected, isHierarchySent, isNotarizationSent, isGoingPrevious]);

  async function handleBackAction() {
    if (isConnected) {
      await mutateAsync();
    }
  }

  const mainContent = (
    <TutorialCard>
      <CardHeader
        canGoBack={true}
        backText='↺ Reset to Intro'
        backUrl='/introduction/1'
        onBack={handleBackAction}
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
    />
  );
};

export default ExploreGuided;
