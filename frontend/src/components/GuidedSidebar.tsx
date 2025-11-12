/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useCurrentWallet } from '@iota/dapp-kit';
import clsx from 'clsx';

import { GUIDED_SIDEBAR } from '@/contents/common';
import {
  TUTORIAL_STEP_1,
  TUTORIAL_STEP_2,
  TUTORIAL_STEP_3,
  TUTORIAL_STEP_4,
  TUTORIAL_STEP_5,
  TUTORIAL_STEP_6,
  TUTORIAL_STEP_7,
  TUTORIAL_STEP_8,
  TUTORIAL_STEP_9,
  TUTORIAL_STEP_10,
  TUTORIAL_STEP_11,
  TUTORIAL_STEP_12,
  TUTORIAL_STEP_13,
} from '@/contents/explore';
import { useHierarchySent, useNotarizationSent } from '@/providers/appProvider';

import CaretDownIcon from './icons/CaretDownIcon';
import CaretUpIcon from './icons/CaretUpIcon';
import StepContent from './StepContent';
import StepNavigation from './StepNavigation';
import StepProgress from './StepProgress';

const TUTORIAL_STEPS = new Map([
  [
    1,
    [
      {
        key: 1,
        imageSrc: TUTORIAL_STEP_1.asset.imageSrc,
        imageAlt: TUTORIAL_STEP_1.content.imageAlt,
        stepTitle: TUTORIAL_STEP_1.content.title,
        stepDescription: TUTORIAL_STEP_1.content.description,
      },
    ],
  ],
  [
    2,
    [
      {
        key: 2,
        imageSrc: TUTORIAL_STEP_2.asset.imageSrc,
        imageAlt: TUTORIAL_STEP_2.content.imageAlt,
        stepTitle: TUTORIAL_STEP_2.content.title,
        stepDescription: TUTORIAL_STEP_2.content.description,
      },
    ],
  ],
  [
    3,
    [
      {
        key: 3,
        imageSrc: TUTORIAL_STEP_3.asset.imageSrc,
        imageAlt: TUTORIAL_STEP_3.content.imageAlt,
        stepTitle: TUTORIAL_STEP_3.content.title,
        stepDescription: TUTORIAL_STEP_3.content.description,
      },
    ],
  ],
  [
    4,
    [
      {
        key: 4,
        imageSrc: TUTORIAL_STEP_4.asset.imageSrc,
        imageAlt: TUTORIAL_STEP_4.content.imageAlt,
        stepTitle: TUTORIAL_STEP_4.content.title,
        stepDescription: TUTORIAL_STEP_4.content.description,
      },
    ],
  ],
  [
    5,
    [
      {
        key: 5,
        imageSrc: TUTORIAL_STEP_5.asset.imageSrc,
        imageAlt: TUTORIAL_STEP_5.content.imageAlt,
        stepTitle: TUTORIAL_STEP_5.content.title,
        stepDescription: TUTORIAL_STEP_5.content.description,
      },
    ],
  ],
  [
    6,
    [
      {
        key: 6,
        imageSrc: TUTORIAL_STEP_6.asset.imageSrc,
        imageAlt: TUTORIAL_STEP_6.content.imageAlt,
        stepTitle: TUTORIAL_STEP_6.content.title,
        stepDescription: TUTORIAL_STEP_6.content.description,
      },
    ],
  ],
  [
    7,
    [
      {
        key: 7,
        imageSrc: TUTORIAL_STEP_7.asset.imageSrc,
        imageAlt: TUTORIAL_STEP_7.content.imageAlt,
        stepTitle: TUTORIAL_STEP_7.content.title,
        stepDescription: TUTORIAL_STEP_7.content.description,
      },
    ],
  ],
  [
    8,
    [
      {
        key: 8,
        imageSrc: TUTORIAL_STEP_8.asset.imageSrc,
        imageAlt: TUTORIAL_STEP_8.content.imageAlt,
        stepTitle: TUTORIAL_STEP_8.content.title,
        stepDescription: TUTORIAL_STEP_8.content.description,
      },
    ],
  ],
  [
    9,
    [
      {
        key: 9,
        imageSrc: TUTORIAL_STEP_9.asset.imageSrc,
        imageAlt: TUTORIAL_STEP_9.content.imageAlt,
        stepTitle: TUTORIAL_STEP_9.content.title,
        stepDescription: TUTORIAL_STEP_9.content.description,
      },
    ],
  ],
  [
    10,
    [
      {
        key: 10,
        imageSrc: TUTORIAL_STEP_10.asset.imageSrc,
        imageAlt: TUTORIAL_STEP_10.content.imageAlt,
        stepTitle: TUTORIAL_STEP_10.content.title,
        stepDescription: TUTORIAL_STEP_10.content.description,
      },
    ],
  ],
  [
    11,
    [
      {
        key: 11,
        imageSrc: TUTORIAL_STEP_11.asset.imageSrc,
        imageAlt: TUTORIAL_STEP_11.content.imageAlt,
        stepTitle: TUTORIAL_STEP_11.content.title,
        stepDescription: TUTORIAL_STEP_11.content.description,
      },
    ],
  ],
  [
    12,
    [
      {
        key: 12,
        imageSrc: TUTORIAL_STEP_12.asset.imageSrc,
        imageAlt: TUTORIAL_STEP_12.content.imageAlt,
        stepTitle: TUTORIAL_STEP_12.content.title,
        stepDescription: TUTORIAL_STEP_12.content.description,
      },
    ],
  ],
  [
    13,
    [
      {
        key: 13,
        imageSrc: TUTORIAL_STEP_13.asset.imageSrc,
        imageAlt: TUTORIAL_STEP_13.content.imageAlt,
        stepTitle: TUTORIAL_STEP_13.content.title,
        stepDescription: TUTORIAL_STEP_13.content.description,
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
    return GUIDED_SIDEBAR.content.back;
  };

  const getNextLabel = (): string => {
    if (currentStep === 9 && !isConnected) {
      return GUIDED_SIDEBAR.content.connect;
    }

    if (currentStep === 10 && !isHierarchySent) {
      return GUIDED_SIDEBAR.content.request;
    }

    if (currentStep === 11 && !isNotarizationSent) {
      return GUIDED_SIDEBAR.content.diagnostic;
    }

    if (currentStep === 13) {
      return GUIDED_SIDEBAR.content.finish;
    }

    return GUIDED_SIDEBAR.content.next;
  };

  const handleOnNext = () => {
    if (currentStep === 13) {
      router.push(GUIDED_SIDEBAR.navigation.recapUrl);
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
          <h3 className='text-md text-gray-600 select-none'>
            {GUIDED_SIDEBAR.content.behindTheScene}
          </h3>
          <button
            className='cursor-pointer rounded-md p-1 transition-colors select-none hover:bg-slate-200'
            aria-label='Collapse tutorial panel'
            onClick={toggleExpanded}
          >
            {isExpanded ? (
              <CaretUpIcon className='h-6 w-6 rotate-180 text-gray-400 transition-transform duration-200 select-none' />
            ) : (
              <CaretDownIcon className='h-6 w-6 rotate-180 text-gray-400 transition-transform duration-200 select-none' />
            )}
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
        <h4>{GUIDED_SIDEBAR.content.behindTheScene}</h4>
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
