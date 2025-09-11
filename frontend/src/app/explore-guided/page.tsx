'use client';

import Main from '@/components/Main';
import GridContainer from '@/components/GridContainer';
import MainContent from '@/components/MainContent';
import GuidedExploration from "@/components/GuidedExploration";

export default function ExploreGuidedPage() {
  return (
    <Main>
      <GridContainer>
        <MainContent>
          <GuidedExploration />
        </MainContent>
      </GridContainer>
    </Main>
  );
}
