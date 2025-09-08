import styled from 'styled-components';

export interface SlideCardProps {
  title: string;
  description?: string;
  asset?: string;
  layout?: 'default' | 'explore' | 'disclaimer';
  className?: string;
}

const CardContainer = styled.div<{ $layout: string }>`
  height: 100%;
  width: 100%;
  border-radius: 1.5rem;
  overflow: hidden;
  ${props => props.$layout === 'explore' && `
    background: linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(255,255,255,0.7));
    backdrop-filter: blur(8px);
    border: 1px solid rgba(229, 231, 235, 1);
  `}
  ${props => props.$layout === 'disclaimer' && `
    background: linear-gradient(to bottom right, rgb(59, 130, 246), rgb(37, 99, 235));
    border: 1px solid rgba(96, 165, 250, 1);
  `}
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ImageContainer = styled.div`
  flex: 1;
  overflow: hidden;
  border-radius: 1.5rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TextContent = styled.div<{ $layout: string }>`
  padding: 0.75rem 1rem;
  @media (min-width: 768px) {
    padding: 1rem;
  }

  ${props => props.$layout === 'disclaimer' && `
    color: rgba(255, 255, 255, 0.8);
  `}
`;

const Title = styled.h4<{ $layout: string }>`
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  ${props => props.$layout === 'default' && `
    font-weight: 600;
    color: rgb(17, 24, 39);
    @media (min-width: 768px) {
      font-size: 1.125rem;
    }
  `}
  ${props => props.$layout === 'explore' && `
    font-weight: 300;
    color: rgb(31, 41, 55);
    font-size: 1rem;
  `}
  ${props => props.$layout === 'disclaimer' && `
    font-size: 0.875rem;
    @media (min-width: 768px) {
      font-size: 0.875rem;
    }
  `}
`;

const Description = styled.p<{ $layout: string }>`
  font-size: 0.75rem;
  ${props => props.$layout === 'default' && `
    color: rgb(75, 85, 99);
    @media (min-width: 768px) {
      font-size: 0.875rem;
    }
  `}
  ${props => props.$layout === 'explore' && `
    color: rgb(31, 41, 55);
    font-size: 1rem;
    @media (min-width: 768px) {
      font-size: 1.125rem;
    }
    font-weight: 500;
  `}
`;

const SlideCard: React.FC<SlideCardProps> = ({
  title,
  description,
  asset,
  layout = 'default',
  className
}) => {
  return (
    <CardContainer $layout={layout} className={className}>
      <ContentWrapper>
        {layout === 'default' && asset && (
          <ImageContainer>
            <img src={asset} alt={title} />
          </ImageContainer>
        )}

        <TextContent $layout={layout}>
          <Title $layout={layout}>{title}</Title>
          {description && <Description $layout={layout}>{description}</Description>}
        </TextContent>
      </ContentWrapper>
    </CardContainer>
  );
};

export default SlideCard;
