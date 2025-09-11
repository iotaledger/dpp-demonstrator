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

interface ExploreFreeyProps {
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

  // Diagnostic card props
  diagnosticTitle?: string;
  diagnosticSubtitle?: string;
  diagnosticDescription?: string;
  diagnosticImageUrl?: string;
  diagnosticImageAlt?: string;
  diagnosticButtonText?: string;
  onDiagnosticSubmit?: (data: { userAddress: string; findings: string }) => void;
  diagnosticCardState?: 'normal' | 'muted' | 'highlighted';

  // Product header props
  productImage?: string;
  productImageAlt?: string;
  productName?: string;
  manufacturerName?: string;
  productHeaderCardState?: 'default' | 'muted';
}

// TODO: review all components signature
const ExploreFreely: React.FC<ExploreFreeyProps> = ({
  title = "Digital Product Passport",
  headerButtonText = "Switch to Guided",
  onHeaderButtonClick,
  onConnectWallet,

  // Service request defaults
  serviceRequestTitle,
  serviceRequestDescription,
  serviceRequestButtonText,
  onServiceRequest,
  serviceRequestCardState = 'normal',

  // Diagnostic card defaults
  diagnosticTitle,
  diagnosticSubtitle,
  diagnosticDescription,
  diagnosticImageUrl,
  diagnosticImageAlt,
  diagnosticButtonText,
  onDiagnosticSubmit,
  diagnosticCardState = 'normal',

  // Product header defaults
  productImage,
  productImageAlt,
  productName,
  manufacturerName,
  productHeaderCardState = 'default',
}) => {
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
          <PassportHeader onConnect={onConnectWallet} />
          <ServiceRequestCard
            title={serviceRequestTitle}
            description={serviceRequestDescription}
            buttonText={serviceRequestButtonText}
            onButtonClick={onServiceRequest}
            opacity={100}
            delay={0.2}
            cardState={serviceRequestCardState}
          />
          <DiagnosticCard
            title={diagnosticTitle}
            subtitle={diagnosticSubtitle}
            description={diagnosticDescription}
            imageUrl={diagnosticImageUrl}
            imageAlt={diagnosticImageAlt}
            buttonText={diagnosticButtonText}
            onSubmit={onDiagnosticSubmit}
            opacity={100}
            delay={0.3}
            cardState={diagnosticCardState}
          />
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
