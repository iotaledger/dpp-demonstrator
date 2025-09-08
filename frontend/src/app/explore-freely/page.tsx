'use client';

// In your page.tsx or component
import ExploreFreely from '@/components/ExploreFreely';

export default function ExplorePage() {
  const handleSwitchToGuided = () => {
    // Your navigation logic
  };

  const handleConnectWallet = () => {
    // Your wallet connection logic
  };

  return (
    <ExploreFreely
      onHeaderButtonClick={handleSwitchToGuided}
      onConnectWallet={handleConnectWallet}
    />
  );
}
