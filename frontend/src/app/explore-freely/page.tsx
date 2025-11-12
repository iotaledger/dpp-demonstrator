/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

// In your page.tsx or component
import ExploreFreely from '@/components/ExploreFreely';
import GridContainer from '@/components/GridContainer';
import Main from '@/components/Main';
import MainContent from '@/components/MainContent';

export default function ExploreFreelyPage() {
  return (
    <Main>
      <GridContainer>
        <MainContent>
          <ExploreFreely />
        </MainContent>
      </GridContainer>
    </Main>
  );
}
