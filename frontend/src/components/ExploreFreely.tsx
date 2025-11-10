'use client';

import React from 'react';

import { useCurrentWallet, useDisconnectWallet } from '@iota/dapp-kit';

import { EXPLORE_FREELY_NAVIGATION } from '@/contents/explore';

import CardHeader from './CardHeader';
import DiagnosticCard from './DiagnosticCard';
import EndOfPassportMessage from './EndOfPassportMessage';
import { Notifications } from './Notifications';
import NotTestnetWarningCard from './NotTestnetWarningCard';
import PassportHeader from './PassportHeader';
import ProductDetailsCard from './ProductDetailsCard';
import ProductHeaderCard from './ProductHeaderCard';
import RewardPoolCard from './RewardPoolCard';
import RewardTransactionsCard from './RewardTransactionsCard';
import RoleDetailsCard from './RoleDetailsCard';
import ServiceHistoryCard from './ServiceHistoryCard';
import ServiceRequestCard from './ServiceRequestCard';
import TutorialCard from './TutorialCard';
import TutorialScrollContainer from './TutorialScrollContainer';

const ExploreFreely: React.FC = () => {
  const { isConnected } = useCurrentWallet();
  const { mutateAsync } = useDisconnectWallet();

  async function handleBackAction() {
    if (isConnected) {
      await mutateAsync();
    }
  }

  return (
    <TutorialCard>
      <CardHeader
        canGoBack={true}
        backText={EXPLORE_FREELY_NAVIGATION.content.backText}
        backUrl={EXPLORE_FREELY_NAVIGATION.navigation.backUrl}
        onBack={handleBackAction}
        linkText={EXPLORE_FREELY_NAVIGATION.content.linkText}
        linkUrl={EXPLORE_FREELY_NAVIGATION.navigation.linkUrl}
      />
      <TutorialScrollContainer>
        <div className='dpp-content-container'>
          <PassportHeader />
          <NotTestnetWarningCard />
          <ServiceRequestCard />
          <DiagnosticCard />
          <ProductHeaderCard />
          <ProductDetailsCard />
          <RoleDetailsCard />
          <RewardPoolCard />
          <RewardTransactionsCard />
          <ServiceHistoryCard />
          <EndOfPassportMessage />
          <Notifications />
        </div>
      </TutorialScrollContainer>
    </TutorialCard>
  );
};

export default ExploreFreely;
