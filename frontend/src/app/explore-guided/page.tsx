'use client';

import Main from '@/components/Main';
import GridContainer from '@/components/GridContainer';
import MainContent from '@/components/MainContent';
import ExploreGuided from "@/components/ExploreGuided";

export default function ExploreGuidedPage() {
  return (
    <Main>
      <GridContainer>
        <MainContent>
          <ExploreGuided />
        </MainContent>
      </GridContainer>
    </Main>
  );
}
