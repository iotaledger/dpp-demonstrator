'use client';

import Main from '@/components/Main';
import GridContainer from '@/components/GridContainer';
import MainContent from '@/components/MainContent';
import TutorialCard from '@/components/TutorialCard';
import CardHeader from '@/components/CardHeader';
import TutorialScrollContainer from '@/components/TutorialScrollContainer';

export default function GuidedExploreLayout({ children }: React.PropsWithChildren) {
  return (
    <Main>
      <GridContainer>
        <MainContent>
          {children}
        </MainContent>
      </GridContainer>
    </Main>
  );
}
