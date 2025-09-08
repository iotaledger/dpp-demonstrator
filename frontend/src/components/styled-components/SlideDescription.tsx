'use client';

import styled from 'styled-components';

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text}90;
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.125rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 1.25rem;
    line-height: 1.7;
  }
`;

interface SlideDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export default function SlideDescription({ 
  children,
  className 
}: SlideDescriptionProps) {
  return (
    <Description className={className}>
      {children}
    </Description>
  );
}