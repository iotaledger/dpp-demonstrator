'use client';

import styled from 'styled-components';

const ProgressContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const Progress = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease-in-out;
`;

interface SlideProgressBarProps {
  currentSlide: number;
  totalSlides: number;
}

export default function SlideProgressBar({
  currentSlide,
  totalSlides
}: SlideProgressBarProps) {
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <ProgressContainer role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <Progress progress={progress} />
    </ProgressContainer>
  );
}