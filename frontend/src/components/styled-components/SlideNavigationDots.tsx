'use client';

import styled from 'styled-components';

const DotsContainer = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.xl};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 10;
`;

const Dot = styled.button<{ active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background-color: ${({ theme, active }) => 
    active ? theme.colors.primary : 'rgba(0, 0, 0, 0.2)'};
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, active }) => 
      active ? theme.colors.primary : 'rgba(0, 0, 0, 0.4)'};
  }
`;

interface SlideNavigationDotsProps {
  totalSlides: number;
  currentSlide: number;
  onDotClick?: (index: number) => void;
}

export default function SlideNavigationDots({
  totalSlides,
  currentSlide,
  onDotClick
}: SlideNavigationDotsProps) {
  return (
    <DotsContainer>
      {Array.from({ length: totalSlides }, (_, index) => (
        <Dot
          key={index}
          active={index === currentSlide}
          onClick={() => onDotClick?.(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === currentSlide}
        />
      ))}
    </DotsContainer>
  );
}