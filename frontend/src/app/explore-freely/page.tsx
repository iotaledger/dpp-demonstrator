'use client';

// In your page.tsx or component
import ExploreFreely from '@/components/ExploreFreely';
import GridContainer from '@/components/GridContainer';
import Main from '@/components/Main';
import MainContent from '@/components/MainContent';

export default function ExploreFreelyPage() {
  const handleSwitchToGuided = () => {
    // Your navigation logic
  };

  const handleConnectWallet = () => {
    // Your wallet connection logic
  };

  return (
    <Main>
      <GridContainer>
        <MainContent>
          <ExploreFreely
            onHeaderButtonClick={handleSwitchToGuided}
            onConnectWallet={handleConnectWallet}
          />
        </MainContent>
      </GridContainer>
    </Main>
  );
}
