import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  position: relative;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  & > *:nth-child(3) {
    grid-column: span 1;
  }

  @media (max-width: 639px) {
    & > *:last-child {
      grid-column: span 2;
    }
  }
`;