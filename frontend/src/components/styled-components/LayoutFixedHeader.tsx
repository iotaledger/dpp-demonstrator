'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

interface FixedHeaderProps {
  homeUrl?: string;
}

const HeaderContainer = styled.div<{ isHeroVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: all 300ms;
  background: ${props => props.isHeroVisible 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: ${props => props.isHeroVisible 
    ? 'blur(4px)' 
    : 'blur(8px)'};
  border-bottom: ${props => props.isHeroVisible 
    ? 'none' 
    : '1px solid rgba(243, 244, 246, 1)'};
`;

const HeaderContent = styled.div`
  max-width: 80rem;
  width: 100%;
  margin: 0 auto;
  padding: 1rem 1.5rem;
`;

const LogoContainer = styled.div<{ isHeroVisible: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;

  img {
    height: 2rem;
    width: auto;
    color: ${props => props.isHeroVisible 
      ? props.theme.colors.background 
      : props.theme.colors.foreground};
  }
`;

export default function LayoutFixedHeader({ homeUrl = '/' }: FixedHeaderProps) {
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    const heroElement = document.getElementById('hero');
    if (!heroElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '-80px 0px 0px 0px'
      }
    );

    observer.observe(heroElement);
    return () => observer.disconnect();
  }, []);

  return (
    <HeaderContainer isHeroVisible={isHeroVisible}>
      <HeaderContent>
        <LogoContainer isHeroVisible={isHeroVisible}>
          <Image
            src="/assets/icons/dpp-logo.svg"
            alt="DPP Logo"
            width={32}
            height={32}
          />
        </LogoContainer>
      </HeaderContent>
    </HeaderContainer>
  );
}