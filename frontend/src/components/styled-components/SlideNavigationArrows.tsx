'use client';

import styled from 'styled-components';

const ArrowContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  
  &.left {
    left: ${({ theme }) => theme.spacing.xl};
  }
  
  &.right {
    right: ${({ theme }) => theme.spacing.xl};
  }
`;

const ArrowButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
  transition: opacity 0.2s ease;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

interface SlideNavigationArrowsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

export default function SlideNavigationArrows({
  onPrevious,
  onNext,
  canGoPrevious = true,
  canGoNext = true
}: SlideNavigationArrowsProps) {
  return (
    <>
      <ArrowContainer className="left">
        <ArrowButton
          onClick={onPrevious}
          disabled={!canGoPrevious}
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </ArrowButton>
      </ArrowContainer>
      <ArrowContainer className="right">
        <ArrowButton
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </ArrowButton>
      </ArrowContainer>
    </>
  );
}