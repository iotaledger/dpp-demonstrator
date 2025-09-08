'use client';

import styled from 'styled-components';
import SlideContainer from './SlideContainer';
import SlideContent from './SlideContent';

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.p`
  font-size: 1.25rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.text};
`;

interface SlideLayoutBaseProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function SlideLayoutBase({
  title,
  description,
  children
}: SlideLayoutBaseProps) {
  return (
    <SlideContainer>
      <SlideContent>
        {title && <Title>{title}</Title>}
        {description && <Description>{description}</Description>}
        {children}
      </SlideContent>
    </SlideContainer>
  );
}