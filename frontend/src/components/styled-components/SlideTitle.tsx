'use client';

import styled from 'styled-components';

const TitleWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Overline = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text}80;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: 300;
  letter-spacing: 0.025em;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.5rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 3rem;
  }
`;

interface SlideTitleProps {
  title: string;
  overline?: string;
  className?: string;
}

export default function SlideTitle({ 
  title, 
  overline, 
  className 
}: SlideTitleProps) {
  return (
    <TitleWrapper className={className}>
      {overline && <Overline>{overline}</Overline>}
      <Title>{title}</Title>
    </TitleWrapper>
  );
}