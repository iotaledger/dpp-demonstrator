'use client';

import React, { useCallback } from 'react';
import { useCurrentWallet } from '@iota/dapp-kit';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import CaretUpIcon from './icons/CaretUpIcon';
import CaretDownIcon from './icons/CaretDownIcon';

import { useHierarchySent, useNotarizationSent } from '@/providers/appProvider';

import StepContent from './StepContent';
import StepNavigation from './StepNavigation';
import StepProgress from './StepProgress';
import { TUTORIAL_STEP_1, TUTORIAL_STEP_10, TUTORIAL_STEP_11, TUTORIAL_STEP_12, TUTORIAL_STEP_13, TUTORIAL_STEP_2, TUTORIAL_STEP_3, TUTORIAL_STEP_4, TUTORIAL_STEP_5, TUTORIAL_STEP_6, TUTORIAL_STEP_7, TUTORIAL_STEP_8, TUTORIAL_STEP_9 } from '@/contents/explore';

const TUTORIAL_STEPS = new Map([
  [
    1,
    [
      {
        key: 1,
        imageSrc: TUTORIAL_STEP_1.image.src,
        imageAlt: TUTORIAL_STEP_1.image.alt,
        stepTitle: TUTORIAL_STEP_1.title,
        stepDescription: TUTORIAL_STEP_1.description,
      },
    ],
  ],
  [
    2,
    [
      {
        key: 2,
        imageSrc: TUTORIAL_STEP_2.image.src,
        imageAlt: TUTORIAL_STEP_2.image.alt,
        stepTitle: TUTORIAL_STEP_2.title,
        stepDescription: TUTORIAL_STEP_2.description,
      },
    ],
  ],
  [
    3,
    [
      {
        key: 3,
        imageSrc: TUTORIAL_STEP_3.image.src,
        imageAlt: TUTORIAL_STEP_3.image.alt,
        stepTitle: TUTORIAL_STEP_3.title,
        stepDescription: TUTORIAL_STEP_3.description,
      },
    ],
  ],
  [
    4,
    [
      {
        key: 4,
        imageSrc: TUTORIAL_STEP_4.image.src,
        imageAlt: TUTORIAL_STEP_4.image.alt,
        stepTitle: TUTORIAL_STEP_4.title,
        stepDescription: TUTORIAL_STEP_4.description,
      },
    ],
  ],
  [
    5,
    [
      {
        key: 5,
        imageSrc: TUTORIAL_STEP_5.image.src,
        imageAlt: TUTORIAL_STEP_5.image.alt,
        stepTitle: TUTORIAL_STEP_5.title,
        stepDescription: TUTORIAL_STEP_5.description,
      },
    ],
  ],
  [
    6,
    [
      {
        key: 6,
        imageSrc: TUTORIAL_STEP_6.image.src,
        imageAlt: TUTORIAL_STEP_6.image.alt,
        stepTitle: TUTORIAL_STEP_6.title,
        stepDescription: TUTORIAL_STEP_6.description,
      },
    ],
  ],
  [
    7,
    [
      {
        key: 7,
        imageSrc: TUTORIAL_STEP_7.image.src,
        imageAlt: TUTORIAL_STEP_7.image.alt,
        stepTitle: TUTORIAL_STEP_7.title,
        stepDescription: TUTORIAL_STEP_7.description,
      },
    ],
  ],
  [
    8,
    [
      {
        key: 8,
        imageSrc: TUTORIAL_STEP_8.image.src,
        imageAlt: TUTORIAL_STEP_8.image.alt,
        stepTitle: TUTORIAL_STEP_8.title,
        stepDescription: TUTORIAL_STEP_8.description,
      },
    ],
  ],
  [
    9,
    [
      {
        key: 9,
        imageSrc: TUTORIAL_STEP_9.image.src,
        imageAlt: TUTORIAL_STEP_9.image.alt,
        stepTitle: TUTORIAL_STEP_9.title,
        stepDescription: TUTORIAL_STEP_9.description,
      },
    ],
  ],
  [
    10,
    [
      {
        key: 10,
        imageSrc: TUTORIAL_STEP_10.image.src,
        imageAlt: TUTORIAL_STEP_10.image.alt,
        stepTitle: TUTORIAL_STEP_10.title,
        stepDescription: TUTORIAL_STEP_10.description,
      },
    ],
  ],
  [
    11,
    [
      {
        key: 11,
        imageSrc: TUTORIAL_STEP_11.image.src,
        imageAlt: TUTORIAL_STEP_11.image.alt,
        stepTitle: TUTORIAL_STEP_11.title,
        stepDescription: TUTORIAL_STEP_11.description,
      },
    ],
  ],
  [
    12,
    [
      {
        key: 12,
        imageSrc: TUTORIAL_STEP_12.image.src,
        imageAlt: TUTORIAL_STEP_12.image.alt,
        stepTitle: TUTORIAL_STEP_12.title,
        stepDescription: TUTORIAL_STEP_12.description,
      },
    ],
  ],
  [
    13,
    [
      {
        key: 13,
        imageSrc: TUTORIAL_STEP_13.image.src,
        imageAlt: TUTORIAL_STEP_13.image.alt,
        stepTitle: TUTORIAL_STEP_13.title,
        stepDescription: TUTORIAL_STEP_13.description,
      },
    ],
  ],
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
    const goNext = true;

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
      return goNext;
    }

    return canGoNext;
  }, [currentStep, canGoNext, isHierarchySent, isNotarizationSent, isConnected]);

  const getPreviousLabel = (): string => {
    return 'Back';
  };

  const getNextLabel = (): string => {
    if (currentStep === 9 && !isConnected) {
      return 'Connect';
    }

    if (currentStep === 10 && !isHierarchySent) {
      return 'Request';
    }

    if (currentStep === 11 && !isNotarizationSent) {
      return 'Diagnostic';
    }

    if (currentStep === 13) {
      return 'Finish';
    }

    return 'Next';
  };

  const handleOnNext = () => {
    if (currentStep === 13) {
      router.push('/recap/1');
      return;
    }
    onNext();
  };

  return (
    <>
      <SideBarForLargeScreen
        currentStep={currentStep}
        opacity={opacity}
        delay={delay}
        navigation={
          <div className='flex-shrink-0 border-t border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
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
        }
      />
      <DrawerOtherwise
        currentStep={currentStep}
        navigation={
          <div className='flex-shrink-0 cursor-auto border-t border-gray-200 bg-white px-6 py-4 select-none'>
            <div className='flex items-center justify-between'>
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
        }
      />
    </>
  );
};

interface DrawerOtherwiseProps {
  currentStep: number;
  navigation: React.ReactNode;
}

const DrawerOtherwise: React.FC<DrawerOtherwiseProps> = ({ currentStep, navigation }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const stepObj = React.useMemo(() => {
    return TUTORIAL_STEPS.get(currentStep)!.at(0);
  }, [currentStep]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      aria-label='Drag to expand or collapse tutorial panel'
      className='pb-safe fixed inset-x-0 bottom-0 z-30 flex cursor-grab flex-col border-t border-gray-200 select-none active:cursor-grabbing lg:hidden'
      style={{
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px -10px 25px -3px, rgba(0, 0, 0, 0.05) 0px -4px 6px -2px',
      }}
    >
      <div className='flex-shrink-0 border-b border-slate-200 bg-slate-200/50 px-6 py-2 backdrop-blur-md select-none'>
        <div className='flex items-center justify-between select-none'>
          <h3 className='text-md text-gray-600 select-none'>Behind the Scene</h3>
          <button
            className='cursor-pointer rounded-md p-1 transition-colors select-none hover:bg-slate-200'
            aria-label='Collapse tutorial panel'
            onClick={toggleExpanded}
          >
            {isExpanded ? <CaretUpIcon className='h-6 w-6 rotate-180 text-gray-400 transition-transform duration-200 select-none' /> : <CaretDownIcon className='h-6 w-6 rotate-180 text-gray-400 transition-transform duration-200 select-none' />}
          </button>
        </div>
      </div>
      <div className='flex-1 overflow-hidden bg-white backdrop-blur-md'>
        <div
          className={clsx([
            'px-6 pt-4 select-none',
            isExpanded && 'overflow-y-auto pb-12',
            !isExpanded && 'overflow-hidden pb-2',
          ])}
        >
          <div className='space-y-1 overflow-hidden select-none'>
            <div className='text-sm font-medium tracking-wide text-gray-500 uppercase select-none'></div>
            <h2 className='pb-4 text-xl leading-tight font-semibold text-gray-900 select-none'>
              {stepObj?.stepTitle}
            </h2>
            <div
              className={clsx([
                'space-y-4 text-base leading-relaxed text-gray-700 select-none',
                !isExpanded && 'summarize h-7',
              ])}
              style={{
                transition: 'height 0.3s cubic-bezier(0.2, 0, 0, 1)',
              }}
              dangerouslySetInnerHTML={{ __html: stepObj!.stepDescription }}
            />
          </div>
        </div>
      </div>

      {navigation && navigation}
    </div>
  );
};

interface SideBarForLargeScreenProps {
  currentStep: number;
  navigation: React.ReactNode;
  opacity: number;
  delay: number;
}

const SideBarForLargeScreen: React.FC<SideBarForLargeScreenProps> = ({
  currentStep,
  opacity,
  delay,
  navigation,
}) => {
  return (
    <div
      className='flex h-full flex-col overflow-hidden rounded-xl border border-gray-300 bg-white max-lg:hidden'
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`,
      }}
    >
      <div className='flex-shrink-0 border-b border-gray-200 bg-slate-100 px-6 py-3 text-xs text-gray-500'>
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
};

export default GuidedSidebar;
