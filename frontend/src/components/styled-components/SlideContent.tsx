'use client';

import styled from 'styled-components';

const Content = styled.div`
  position: relative;
  width: 100%;
  max-width: 1280px;
  height: 100%;
  max-height: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface SlideContentProps {
  children: React.ReactNode;
}

export default function SlideContent({ children }: SlideContentProps) {
  return <Content>{children}</Content>;
}