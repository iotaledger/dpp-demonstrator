'use client'

import Main from '@/components/Main';
import GridContainer from '@/components/GridContainer';
import MainContent from '@/components/MainContent';
import TutorialCard from '@/components/TutorialCard';
import CardHeader from '@/components/CardHeader';
import TutorialScrollContainer from '@/components/TutorialScrollContainer';
import IntroSlide from '@/components/IntroSlide';
import Slide1 from "@/components/Slide1";
import Slide2 from '@/components/Slide2';
import Slide3 from '@/components/Slide3';
import Slide4 from '@/components/Slide4';
import Slide5 from '@/components/Slide5';
import Slide6 from '@/components/Slide6';
import Slide7 from '@/components/Slide7';
import Slide8 from '@/components/Slide8';
import Slide9 from '@/components/Slide9';
import Slide10 from '@/components/Slide10';

export default function Home() {
  return (
    <Main>
      <GridContainer>
        <MainContent>
          <TutorialCard>
            <CardHeader title="Welcome" />
            <TutorialScrollContainer>
              <IntroSlide opacity={100} scale={100}>
                <Slide1 />
              </IntroSlide>
            </TutorialScrollContainer>
          </TutorialCard>
        </MainContent>
      </GridContainer>
    </Main>
  );
}
