'use client';

import styled from 'styled-components';

const HintContainer = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  z-index: 10;
`;

const KeyHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const KeyBox = styled.kbd`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 ${({ theme }) => theme.spacing.xs};
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-family: monospace;
  font-size: 0.875rem;
`;

export default function SlideKeyboardHint() {
  return (
    <HintContainer aria-label="Keyboard navigation hints">
      <KeyHint>
        <KeyBox>←</KeyBox>
        <KeyBox>→</KeyBox>
        <span>to navigate</span>
      </KeyHint>
      <KeyHint>
        <KeyBox>Esc</KeyBox>
        <span>to exit</span>
      </KeyHint>
    </HintContainer>
  );
}