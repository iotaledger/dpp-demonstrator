'use client';

import styled from 'styled-components';
import Image from 'next/image';

interface FooterProps {
  className?: string;
}

const FooterContainer = styled.footer<{ className?: string }>`
  background-color: ${props => props.theme.colors.background};
  margin-top: 3rem;
  ${props => props.className}
`;

const FooterContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem;
`;

const FooterInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
`;

const Copyright = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.mutedForeground};
`;

export default function LayoutFooter({ className }: FooterProps) {
  return (
    <FooterContainer className={className}>
      <FooterContent>
        <FooterInner>
          <Image
            src="/assets/icons/iota-logo.svg"
            alt="IOTA Logo"
            width={36}
            height={36}
            style={{ opacity: 0.6 }}
          />
          <Copyright>
            © 2025 IOTA Foundation. All Rights Reserved.
          </Copyright>
        </FooterInner>
      </FooterContent>
    </FooterContainer>
  );
}