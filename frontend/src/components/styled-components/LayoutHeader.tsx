'use client';

import styled from 'styled-components';
import Image from 'next/image';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.background};
  position: relative;
  z-index: 40;
`;

const HeaderContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  
  @media (min-width: 1280px) {
    padding: 1rem 3rem;
  }
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
`;

export default function LayoutHeader() {
  return (
    <HeaderContainer id="wallet">
      <HeaderContent>
        <HeaderInner>
          <LogoContainer>
            <Image
              src="/assets/logo.svg"
              alt="DPP Logo"
              width={32}
              height={32}
            />
          </LogoContainer>
        </HeaderInner>
      </HeaderContent>
    </HeaderContainer>
  );
}
