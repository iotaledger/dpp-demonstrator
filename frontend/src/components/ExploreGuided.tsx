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

interface ExploreGuidedProps {
  title?: string;
  headerButtonText?: string;
  onHeaderButtonClick?: () => void;
  onConnectWallet?: () => void;

  // Service request props
  serviceRequestTitle?: string;
  serviceRequestDescription?: string;
  serviceRequestButtonText?: string;
  onServiceRequest?: () => void;
  serviceRequestCardState?: 'normal' | 'muted' | 'highlighted';

  // Product header props
  productImage?: string;
  productImageAlt?: string;
  productName?: string;
  manufacturerName?: string;
  productHeaderCardState?: 'default' | 'muted';

  // Step content props
  imageSrc?: string;
  imageAlt?: string;
  stepType?: string;
  stepTitle?: string;
  stepDescription?: string;

  // Navigation props
  currentStep?: number;
  totalSteps?: number;
  progressPercentage?: number;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
}

const ExploreGuided: React.FC<ExploreGuidedProps> = ({
  title = "Digital Product Passport",
  headerButtonText = "Switch to Freely",
  onHeaderButtonClick,
  onConnectWallet,

  // Service request defaults
  serviceRequestTitle,
  serviceRequestDescription,
  serviceRequestButtonText,
  onServiceRequest,
  serviceRequestCardState = 'normal',

  // Product header defaults
  productImage,
  productImageAlt,
  productName,
  manufacturerName,
  productHeaderCardState = 'default',

  // Step content defaults
  imageSrc = "/assets/steps/step_8.webp",
  imageAlt = "Explore Mode",
  stepType = "",
  stepTitle = "Explore Mode",
  stepDescription = "<p>You've now been guided through each section of the Digital Product Passport and seen how different IOTA components contribute to it.<br><br>Take a moment to explore freely: scroll through the full DPP, review product details, inspect service records, and follow any links to the <strong>IOTA Explorer</strong> for a deeper look at on-chain data.<br><br>When you're ready, continue to the next step to connect your wallet and begin interacting with the system as a certified technician.</p>",

  // Navigation defaults
  currentStep = 8,
  totalSteps = 13,
  progressPercentage = 61.5385,
  canGoPrevious = true,
  canGoNext = true,
  onPrevious,
  onNext,
  previousLabel = "Back",
  nextLabel = "Continue"
}) => {
  const mainContent = (
    <TutorialCard>
      <CardHeader
        title={title}
        linkText={headerButtonText}
      />
      <TutorialScrollContainer>
        <div className="dpp-content-container">
          <ProductHeaderCard
            productImage={productImage}
            productImageAlt={productImageAlt}
            productName={productName}
            manufacturerName={manufacturerName}
            opacity={100}
            delay={0.4}
            cardState={productHeaderCardState}
          />
          <ProductDetailsCard />
          <RoleDetailsCard />
          <RewardPoolCard />
          <ServiceHistoryCard />
          <EndOfPassportMessage />
          <div className="absolute top-4 right-4 z-[70] space-y-3 pointer-events-none" />
        </div>
      </TutorialScrollContainer>
    </TutorialCard>
  );

  const sidebarContent = (
    <GuidedSidebar
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      stepType={stepType}
      stepTitle={stepTitle}
      stepDescription={stepDescription}
      currentStep={currentStep}
      totalSteps={totalSteps}
      progressPercentage={progressPercentage}
      canGoPrevious={canGoPrevious}
      canGoNext={canGoNext}
      onPrevious={onPrevious}
      onNext={onNext}
      previousLabel={previousLabel}
      nextLabel={nextLabel}
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
