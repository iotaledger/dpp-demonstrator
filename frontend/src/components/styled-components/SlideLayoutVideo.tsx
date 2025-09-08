'use client';

import styled from 'styled-components';
import SlideLayoutBase from './SlideLayoutBase';

const VideoContainer = styled.div`
  width: 100%;
  max-width: 960px;
  margin: ${({ theme }) => theme.spacing.xl} auto;
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const VideoFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

interface SlideLayoutVideoProps {
  title?: string;
  description?: string;
  videoUrl: string;
  videoTitle: string;
  posterImage?: string;
}

export default function SlideLayoutVideo({
  title,
  description,
  videoUrl,
  videoTitle,
  posterImage
}: SlideLayoutVideoProps) {
  return (
    <SlideLayoutBase title={title} description={description}>
      <VideoContainer>
        <VideoFrame
          src={videoUrl}
          title={videoTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {posterImage && (
          <VideoOverlay>
            <img src={posterImage} alt={`${videoTitle} poster`} />
          </VideoOverlay>
        )}
      </VideoContainer>
    </SlideLayoutBase>
  );
}