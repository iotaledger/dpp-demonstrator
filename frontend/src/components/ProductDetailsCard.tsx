'use client';

import React from 'react';

import { PRODUCT_DETAILS } from '@/contents/explore';
import { useProductDetails } from '@/hooks/useProductDetails';
import { fromPosixMsToUtcDateFormat, truncateAddress } from '@/utils/common';
import { DPP_ID, EXPLORER_URL, NETWORK } from '@/utils/constants';

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
      <PanelContent
        title={PRODUCT_DETAILS.content.passportDetails.title}
        panelState={getPanelState()}
      >
        <DataGrid>
          <ItemValueRow
            rowState={getRowState('dppId')}
            label={PRODUCT_DETAILS.content.passportDetails.dppIdLabel}
            value={truncateAddress(DPP_ID)}
            isLink={true}
            linkHref={`${EXPLORER_URL}/object/${DPP_ID}?network=${NETWORK}`}
            fontMono={true}
            valueColor='text-blue-600'
          />
          <ItemValueRow
            rowState={getRowState('serialNumber')}
            label={PRODUCT_DETAILS.content.passportDetails.serialNumberLabel}
            value={productDetails?.serialNumber}
            fontMono={true}
          />
          <ItemValueRow
            rowState={getRowState('dppCreationDate')}
            label={PRODUCT_DETAILS.content.passportDetails.dppCreationDate}
            value={fromPosixMsToUtcDateFormat(productDetails?.timestamp)}
            fontMono={true}
          />
        </DataGrid>
      </PanelContent>

      <TwoColumnSection
        leftColumn={
          <CollapsibleInnerSection
            title={PRODUCT_DETAILS.content.batteryDetails.title}
            defaultExpanded={innerDetailsExpanded}
            onExpandToggle={handleExpandToggle}
          >
            <DataGrid>
              <ItemValueRow
                rowState={getRowState('batteryDetailsModel')}
                label={PRODUCT_DETAILS.content.batteryDetails.modelLabel}
                value={productDetails?.billOfMaterials?.model}
                isLink={false}
                fontMono={true}
              />
              <ItemValueRow
                rowState={getRowState('batteryDetailsManufacturingDate')}
                label={PRODUCT_DETAILS.content.batteryDetails.manufacturingDateLabel}
                value={productDetails?.billOfMaterials?.manufacturingDate}
                fontMono={true}
              />
              <ItemValueRow
                rowState={getRowState('batteryDetailsCapacity')}
                label={PRODUCT_DETAILS.content.batteryDetails.capacityLabel}
                value={productDetails?.billOfMaterials?.capacity}
                fontMono={true}
              />
              <ItemValueRow
                rowState={getRowState('batteryDetailsExpectedLifespan')}
                label={PRODUCT_DETAILS.content.batteryDetails.expectedLifespanLabel}
                value={productDetails?.billOfMaterials?.expectedLifespan}
                fontMono={true}
              />
              <ItemValueRow
                rowState={getRowState('batteryDetailsBatteryPack')}
                label={PRODUCT_DETAILS.content.batteryDetails.batteryPackLabel}
                value={productDetails?.billOfMaterials?.batteryPack}
                fontMono={true}
              />
            </DataGrid>
          </CollapsibleInnerSection>
        }
        rightColumn={
          <CollapsibleInnerSection
            title={PRODUCT_DETAILS.content.billOfMaterials.title}
            defaultExpanded={innerDetailsExpanded}
            onExpandToggle={handleExpandToggle}
          >
            <DataGrid>
              <ItemValueRow
                rowState={getRowState('billOfMaterialsCells')}
                label={PRODUCT_DETAILS.content.billOfMaterials.cellsLabel}
                value={productDetails?.billOfMaterials?.cells}
                fontMono={true}
              />
              <ItemValueRow
                rowState={getRowState('billOfMaterialsHousing')}
                label={PRODUCT_DETAILS.content.billOfMaterials.housingLabel}
                value={productDetails?.billOfMaterials?.housing}
                fontMono={true}
              />
              <ItemValueRow
                rowState={getRowState('billOfMaterialsVersion')}
                label={PRODUCT_DETAILS.content.billOfMaterials.versionLabel}
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
