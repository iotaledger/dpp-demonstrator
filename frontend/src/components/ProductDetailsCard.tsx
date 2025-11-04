'use client';

import React from 'react';

import { useProductDetails } from '@/hooks/useProductDetails';
import { fromPosixMsToUtcDateFormat, truncateAddress } from '@/utils/common';
import { DPP_ID } from '@/utils/constants';

import CollapsibleInnerSection from './CollapsableInnerSection';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import PanelContent from './PanelContent';
import TwoColumnSection from './TwoColumnSection';

interface ProductDetailsCardProps {
  opacity?: number;
  delay?: number;
  sectionState?: 'selected' | 'muted' | 'default';
  tutorialState?: 'selected' | 'muted' | 'open-muted' | 'no';
  scrollIntoView?: boolean;
}

const ProductDetailsCard: React.FC<ProductDetailsCardProps> = ({
  opacity = 100,
  delay = 0.4,
  sectionState = 'default',
  tutorialState = 'no',
  scrollIntoView = false,
}) => {
  const { productDetails } = useProductDetails();
  const [innerDetailsExpanded, setInnerDetailsExpanded] = React.useState(false);

  const getSectionState = () => {
    if (tutorialState === 'muted' || tutorialState === 'open-muted') {
      return 'muted';
    }
    return sectionState;
  };

  const getSectionExpanded = () => {
    const open = true;
    const close = false;
    if (tutorialState === 'muted') {
      return close;
    }
    return open;
  };

  const getPanelState = () => {
    if (tutorialState === 'selected') {
      return tutorialState;
    }
    return 'default';
  };

  const getRowState = (rowTag: string) => {
    if (tutorialState === 'no') {
      return 'default';
    }

    if (tutorialState === 'selected' && rowTag === 'dppId') {
      return 'selected';
    }

    return 'muted';
  };

  const handleExpandToggle = () => {
    setInnerDetailsExpanded((prevIsExpanded) => !prevIsExpanded);
  };

  return (
    <CollapsibleSection
      defaultExpanded={getSectionExpanded()}
      cardState={getSectionState()}
      scrollIntoView={scrollIntoView}
      title='Product Details'
      opacity={opacity}
      delay={delay}
    >
      <PanelContent title={'Product Passport Details'} panelState={getPanelState()}>
        <DataGrid>
          <ItemValueRow
            rowState={getRowState('dppId')}
            label='DPP ID'
            value={truncateAddress(DPP_ID as string)}
            isLink={true}
            // TODO: mount the link to the object ID, probably getting it from explorer in a template like: "https://explorer.iota.org/txblock/3BDwVQffoQ55ke72oevpLjjVCdFzYDVQeSRiAktgZxCp"
            // This is how it is soved in the demonstrator: `${NEXT_PUBLIC_EXPLORER_URL}/object/${objectId}?network=${NEXT_PUBLIC_NETWORK}`
            // Being the network constants hardcoded as following:
            // - process.env.NEXT_PUBLIC_EXPLORER_URL
            // - process.env.NEXT_PUBLIC_NETWORK
            linkHref={`https://explorer.iota.org/object/${DPP_ID as string}?network=testnet`}
            fontMono={true}
            valueColor='text-blue-600'
          />
          <ItemValueRow
            rowState={getRowState('serialNumber')}
            label='Serial Number'
            value={productDetails?.serialNumber}
            fontMono={true}
          />
          <ItemValueRow
            rowState={getRowState('dppCreationDate')}
            label='DPP Creation Date'
            value={fromPosixMsToUtcDateFormat(productDetails?.timestamp)}
            fontMono={true}
          />
        </DataGrid>
      </PanelContent>

      <TwoColumnSection
        leftColumn={
          <CollapsibleInnerSection
            title='Battery Details'
            defaultExpanded={innerDetailsExpanded}
            onExpandToggle={handleExpandToggle}
          >
            <DataGrid>
              <ItemValueRow
                rowState={getRowState('batteryDetailsModel')}
                label='Model'
                value={productDetails?.billOfMaterials?.model}
                isLink={false}
                fontMono={true}
              />
              <ItemValueRow
                rowState={getRowState('batteryDetailsManufacturingDate')}
                label='Manufacturing Date'
                value={productDetails?.billOfMaterials?.manufacturingDate}
                fontMono={true}
              />
              <ItemValueRow
                rowState={getRowState('batteryDetailsCapacity')}
                label='Capacity'
                value={productDetails?.billOfMaterials?.capacity}
                fontMono={true}
              />
              <ItemValueRow
                rowState={getRowState('batteryDetailsExpectedLifespan')}
                label='Expected Lifespan'
                value={productDetails?.billOfMaterials?.expectedLifespan}
                fontMono={true}
              />
              <ItemValueRow
                rowState={getRowState('batteryDetailsBatteryPack')}
                label='Battery Pack'
                value={productDetails?.billOfMaterials?.batteryPack}
                fontMono={true}
              />
            </DataGrid>
          </CollapsibleInnerSection>
        }
        rightColumn={
          <CollapsibleInnerSection
            title='Bill of Materials'
            defaultExpanded={innerDetailsExpanded}
            onExpandToggle={handleExpandToggle}
          >
            <DataGrid>
              <ItemValueRow
                rowState={getRowState('billOfMaterialsCells')}
                label='Cells'
                value={productDetails?.billOfMaterials?.cells}
                fontMono={true}
              />
              <ItemValueRow
                rowState={getRowState('billOfMaterialsHousing')}
                label='Housing'
                value={productDetails?.billOfMaterials?.housing}
                fontMono={true}
              />
              <ItemValueRow
                rowState={getRowState('billOfMaterialsVersion')}
                label='Version'
                value={productDetails?.billOfMaterials?.version}
                fontMono={true}
              />
            </DataGrid>
          </CollapsibleInnerSection>
        }
      ></TwoColumnSection>
    </CollapsibleSection>
  );
};

export default ProductDetailsCard;
