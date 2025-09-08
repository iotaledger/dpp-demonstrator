'use client';

import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

interface SlideContainerProps {
  children: React.ReactNode;
}

export default function SlideContainer({ children }: SlideContainerProps) {
  return <Container>{children}</Container>;
}