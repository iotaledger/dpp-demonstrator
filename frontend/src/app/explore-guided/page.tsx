'use client';

import ExploreGuided from '@/components/ExploreGuided';
import GridContainer from '@/components/GridContainer';
import Main from '@/components/Main';
import MainContent from '@/components/MainContent';

export default function ExploreGuidedPage() {
  return (
    <Main>
      <GridContainer hasDrawer={true}>
        <MainContent>
          <ExploreGuided />
        </MainContent>
      </GridContainer>
    </Main>
  );
}
