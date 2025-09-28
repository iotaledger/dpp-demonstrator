import React, { useCallback } from 'react';
import StepContent from './StepContent';
import StepProgress from './StepProgress';
import StepNavigation from './StepNavigation';
import { useCurrentWallet } from '@iota/dapp-kit';
import { useHierarchySent, useNotarizationSent } from '@/providers/appProvider';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const TUTORIAL_STEPS = new Map([
  [1, [{
    key: 1,
    imageSrc: "/assets/steps/step_1.webp",
    imageAlt: "Meet the Product",
    stepTitle: "Meet the Product",
    stepDescription: "<p>This e-bike battery is the product we will track throughout the demo. Its Digital Product Passport was created by EcoBike, and every service event or reward you add later will link back to this single on-chain identity.</p>",
  }]],
  [2, [{
    key: 2,
    imageSrc: "/assets/steps/step_2.webp",
    imageAlt: "Product Details",
    stepTitle: "Product Details",
    stepDescription: "<p>Here you can review the product details that the manufacturer initially attached to the passport, including production facts, key attributes, and the bill of materials. The DPP ID is this battery's unique identifier on the IOTA network. Follow the link to open the <strong>IOTA Explorer</strong> and view the on-chain record and metadata in full. Thanks to IOTA's core characteristics and <strong>IOTA Notarization</strong>, this information is immutably stored and accessible to everyone.</p>",
  }]],
  [3, [{
    key: 3,
    imageSrc: "/assets/steps/step_3.webp",
    imageAlt: "Manufacturer Identity",
    stepTitle: "Manufacturer Identity",
    stepDescription: "<p>EcoBike is the legal entity that produced this battery and is responsible for its Digital Product Passport. EcoBike represents itself via an <strong>IOTA Identity</strong> called a Decentralized Identifier (DID) on the IOTA network.</p>",
  }]],
  [4, [{
    key: 4,
    imageSrc: "/assets/steps/step_4.webp",
    imageAlt: "Service Network",
    stepTitle: "Service Network",
    stepDescription: "<p>For products that can move freely across this planet, a manufacturer needs a reliable way to let trusted repairers and recyclers add information to the passport. EcoBike solves this by keeping an on-chain Service Network via <strong>IOTA Hierarchies</strong>. Only trusted actors on that list are eligible to write to the passport. Your address - the Technician - isn't on that list yet, but you'll request access throughout this demo.</p>",
  }]],
  [5, [{
    key: 5,
    imageSrc: "/assets/steps/step_5.webp",
    imageAlt: "Reward Pool",
    stepTitle: "Reward Pool",
    stepDescription: "<p>A major challenge in building useful DPPs is motivating actors to participate in this circular economy. Why should a service technician document their actions? Why should an owner bring the product to a certified recycler?<br><br>EcoBike solves this with a pre-funded reward pool using <strong>IOTA Tokenization</strong>. Each verified service or recycling event automatically triggers a token reward through transparent smart contract logic. This creates direct economic incentives for proper product care throughout the entire lifecycle.</p>",
  }]],
  [6, [{
    key: 6,
    imageSrc: "/assets/steps/step_6.webp",
    imageAlt: "Reward Transactions",
    stepTitle: "Reward Transactions",
    stepDescription: "<p>Each time a certified technician performs a verified action like an annual health check, the DPP triggers an automated reward token payout. Each payout is recorded immutably on the IOTA ledger and can be verified publicly via the <strong>IOTA Explorer</strong>. This ensures transparency, traceability, and accountability for every reward that gets distributed.</p>",
  }]],
  [7, [{
    key: 7,
    imageSrc: "/assets/steps/step_7.webp",
    imageAlt: "Service History",
    stepTitle: "Service History",
    stepDescription: "<p>Every entry in this timeline reflects a real action, such as a maintenance check or component replacement, performed by a certified actor. The data is digitally signed, timestamped, and immutably anchored on the IOTA network using <strong>IOTA Notarization</strong>.<br><br>This creates a tamper-proof audit trail that regulators, manufacturers, and future owners can rely on to verify that the product was properly maintained throughout its lifecycle.</p>",
  }]],
  [8, [{
    key: 8,
    imageSrc: "/assets/steps/step_8.webp",
    imageAlt: "Explore Mode",
    stepTitle: "Explore Mode",
    stepDescription: "<p>You've now been guided through each section of the Digital Product Passport and seen how different IOTA components contribute to it.<br><br>Take a moment to explore freely: scroll through the full DPP, review product details, inspect service records, and follow any links to the <strong>IOTA Explorer</strong> for a deeper look at on-chain data.<br><br>When you're ready, continue to the next step to connect your wallet and begin interacting with the system as a certified technician.</p>",
  }]],
  [9, [{
    key: 9,
    imageSrc: "/assets/steps/step_9.webp",
    imageAlt: "Connect Wallet",
    stepTitle: "Connect Wallet",
    stepDescription: "<p>In order to let the DPP application know who you are, you now need to connect your wallet. This lets the system recognize your identity and determine which actions you're allowed to perform.<br><br>On the desktop, use the <strong>IOTA Browser Wallet</strong> extension. On mobile, use the Nightly app.<br><br>Don't worry, you don't need to hold IOTA or any other tokens. The wallet simply proves who you are and lets you sign messages and transactions when needed.<br><br>Once connected, you'll be able to request access and start interacting with the product's Digital Product Passport.</p>",
  }]],
  [10, [{
    key: 10,
    imageSrc: "/assets/steps/step_10.webp",
    imageAlt: "Request Access",
    stepTitle: "Request Access",
    stepDescription: "<p>Earlier, you learned that EcoBike maintains a trusted Service Network through <strong>IOTA Hierarchies</strong>. Only certified technicians in that list are allowed to add information to the Digital Product Passport.<br><br>Now that your wallet is connected, you can request to join. Clicking the button simulates how a technician contacts the manufacturer through one of the channels defined in EcoBike's <strong>IOTA Identity</strong>.<br><br>If approved, you will be able to add verified service records to the passport.</p>",
  }]],
  [11, [{
    key: 11,
    imageSrc: "/assets/steps/step_11.webp",
    imageAlt: "Start Diagnostic",
    stepTitle: "Start Diagnostic",
    stepDescription: "<p>You've been approved as a trusted technician! EcoBike has added your wallet address to their Service Network through <strong>IOTA Hierarchies</strong>.<br><br>Now you can simulate running a diagnostic and writing a health snapshot to the passport. Your service record will become part of the product's permanent, verifiable history.</p>",
  }]],
  [12, [{
    key: 12,
    imageSrc: "/assets/steps/step_12.webp",
    imageAlt: "View New History Entry",
    stepTitle: "View New History Entry",
    stepDescription: "<p>Your health snapshot has been written to the IOTA network — immutably and verifiably. You didn't need to pay fees or hold tokens. The <strong>IOTA Gas Station</strong> sponsored your transaction in the background, ensuring a smooth experience.<br><br>Your entry is now part of the product's permanent service history, visible to all future owners and stakeholders.</p>",
  }]],
  [13, [{
    key: 13,
    imageSrc: "/assets/steps/step_13.webp",
    imageAlt: "View Reward Information",
    stepTitle: "View Reward Information",
    stepDescription: "<p>Congratulations! Your verified service action has triggered an automated reward payout from EcoBike's reward pool.<br><br>The smart contract logic recognized your certified maintenance work and released tokens accordingly. Look at the reward contract and reward distributed entries in the service history below - these show the on-chain reward transaction details.<br><br>This reward can later be redeemed through an Extended Producer Responsibility Organization (EPRO) for real-world value. This incentive system encourages proper product care throughout the entire lifecycle.</p>",
  }]],
]);

interface GuidedSidebarProps {
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  opacity?: number;
  delay?: number;
}

const GuidedSidebar: React.FC<GuidedSidebarProps> = ({
  currentStep,
  totalSteps,
  progressPercentage,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  opacity = 100,
  delay = 0,
}) => {
  const { isConnected } = useCurrentWallet();
  const { isHierarchySent } = useHierarchySent();
  const { isNotarizationSent } = useNotarizationSent();
  const router = useRouter();

  const getCanGoNext = useCallback(() => {
    const dontGoNext = false;
    const canGoNext = true;

    if (currentStep === 9 && !isConnected) {
      return dontGoNext;
    }

    if (currentStep === 10 && !isHierarchySent) {
      return dontGoNext;
    }

    if (currentStep === 11 && !isNotarizationSent) {
      return dontGoNext;
    }

    if (currentStep === 13) {
      return canGoNext;
    }

    return canGoNext;
  }, [currentStep, canGoNext, isHierarchySent, isNotarizationSent, isConnected]);

  const getPreviousLabel = (): string => {
    return "Back";
  };

  const getNextLabel = (): string => {
    if (currentStep === 9 && !isConnected) {
      return "Connect";
    }

    if (currentStep === 10 && !isHierarchySent) {
      return "Request";
    }

    if (currentStep === 11 && !isNotarizationSent) {
      return "Diagnostic";
    }

    if (currentStep === 13) {
      return "Finish";
    }

    return "Next";
  };

  const handleOnNext = () => {
    if (currentStep === 13) {
      router.push('/recap/1');
      return;
    }
    onNext();
  }

  return (
    <>
      <SideBarForLargeScreen
        currentStep={currentStep}
        opacity={opacity}
        delay={delay}
        navigation={(
          <div className="flex-shrink-0 border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <StepProgress
                currentStep={currentStep}
                totalSteps={totalSteps}
                progressPercentage={progressPercentage}
              />

              <StepNavigation
                canGoPrevious={canGoPrevious}
                canGoNext={getCanGoNext()}
                onPrevious={onPrevious}
                onNext={handleOnNext}
                previousLabel={getPreviousLabel()}
                nextLabel={getNextLabel()}
              />
            </div>
          </div>
        )}
      />
      <DrawerOtherwise
        currentStep={currentStep}
        navigation={(
          <div className="flex-shrink-0 px-6 py-4 border-t bg-white border-gray-200 cursor-auto select-none">
            <div className="flex items-center justify-between">
              <StepProgress
                currentStep={currentStep}
                totalSteps={totalSteps}
                progressPercentage={progressPercentage}
              />

              <StepNavigation
                canGoPrevious={canGoPrevious}
                canGoNext={getCanGoNext()}
                onPrevious={onPrevious}
                onNext={handleOnNext}
                previousLabel={getPreviousLabel()}
                nextLabel={getNextLabel()}
              />
            </div>
          </div>
        )}
      />
    </>
  );
};

interface DrawerOtherwiseProps {
  currentStep: number;
  navigation: React.ReactNode;
};

const DrawerOtherwise: React.FC<DrawerOtherwiseProps> = ({
  currentStep,
  navigation,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const stepObj = React.useMemo(() => {
    return TUTORIAL_STEPS.get(currentStep)!.at(0)
  }, [currentStep]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      aria-label="Drag to expand or collapse tutorial panel"
      className="lg:hidden fixed bottom-0 inset-x-0 border-t border-gray-200 z-30 pb-safe select-none flex flex-col cursor-grab active:cursor-grabbing"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.1) 0px -10px 25px -3px, rgba(0, 0, 0, 0.05) 0px -4px 6px -2px",
      }}>
      <div className="flex-shrink-0 px-6 py-2 bg-slate-200/50 backdrop-blur-md border-b border-slate-200 select-none">
        <div className="flex items-center justify-between select-none">
          <h3 className="text-md text-gray-600 select-none">Behind the Scene</h3>
          <button
            className="p-1 rounded-md hover:bg-slate-200 transition-colors cursor-pointer select-none"
            aria-label="Collapse tutorial panel"
            onClick={toggleExpanded}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-gray-400 transition-transform duration-200 select-none rotate-180">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isExpanded ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-white backdrop-blur-md ">
        <div className={clsx([
          "px-6 pt-4 select-none",
          isExpanded && "pb-12 overflow-y-auto",
          !isExpanded && "pb-2 overflow-hidden",
        ])}>
          <div className="space-y-1 select-none overflow-hidden">
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide select-none"></div>
            <h2 className="text-xl font-semibold text-gray-900 pb-4 leading-tight select-none">
              {stepObj?.stepTitle}
            </h2>
            <div className={clsx([
              "text-base text-gray-700 leading-relaxed space-y-4 select-none",
              !isExpanded && "h-0"
            ])}
              style={{
                transition: "height 0.3s cubic-bezier(0.2, 0, 0, 1)",
              }}
              dangerouslySetInnerHTML={{ __html: stepObj!.stepDescription }}
            />
          </div>
        </div>
      </div>

      {navigation && navigation}
    </div>
  );
}

interface SideBarForLargeScreenProps {
  currentStep: number;
  navigation: React.ReactNode;
  opacity: number;
  delay: number;
};

const SideBarForLargeScreen: React.FC<SideBarForLargeScreenProps> = ({ currentStep, opacity, delay, navigation }) => {
  return (
    <div
      className="max-lg:hidden flex bg-white rounded-xl border border-gray-300 h-full flex-col overflow-hidden"
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`
      }}
    >
      <div className="flex-shrink-0 bg-slate-100 px-6 py-3 border-b border-gray-200 text-xs text-gray-500">
        <h4>Behind the Scene</h4>
      </div>

      {TUTORIAL_STEPS.get(currentStep)!.map((step) => (
        <StepContent
          key={step.key}
          imageSrc={step.imageSrc}
          imageAlt={step.imageAlt}
          stepTitle={step.stepTitle}
          stepDescription={step.stepDescription}
        />
      ))}

      {navigation && navigation}
    </div>
  );
}

export default GuidedSidebar;
