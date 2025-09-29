'use client';

import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import TwoColumnSection from './TwoColumnSection';
import { useProductDetails } from '@/hooks/useProductDetails';
import CollapsibleInnerSection from './CollapsableInnerSection';
import { fromPosixMsToUtcDateFormat, truncateAddress } from '@/utils/common';
import PanelContent from './PanelContent';
import { DPP_ID } from '@/utils/constants';

interface ProductDetailsCardProps {
  opacity?: number;
  delay?: number;
  sectionState?: 'selected' | 'muted' | 'default';
  tutorialState?: 'selected' | 'muted' | 'open-muted' | 'no';
}

// TODO: Implement loading state
const ProductDetailsCard: React.FC<ProductDetailsCardProps> = ({
  opacity = 100,
  delay = 0.4,
  sectionState = 'default',
  tutorialState = 'no',
}) => {
  const { productDetails } = useProductDetails(DPP_ID as string);
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
  }

  const getPanelState = () => {
    if (tutorialState === 'selected') {
      return tutorialState;
    }
    return 'default';
  }

  const getRowState = (rowTag: string) => {
    if (tutorialState === 'no') {
      return 'default';
    }

    if (tutorialState === 'selected' && rowTag === 'dppId') {
      return 'selected';
    }

    return 'muted';
  }

  const handleExpandToggle = () => {
    setInnerDetailsExpanded((prevIsExpanded) => !prevIsExpanded);
  }

  return (
    <CollapsibleSection
      cardState={getSectionState()}
      title="Product Details" opacity={opacity}
      delay={delay}
      defaultExpanded={getSectionExpanded()}
    >
      <PanelContent title={"Product Passport Details"} panelState={getPanelState()}>
        <DataGrid>
          <ItemValueRow
            rowState={getRowState('dppId')}
            label="DPP ID"
            value={truncateAddress(DPP_ID as string)}
            isLink={true}
            // TODO: mount the link to the object ID, probably getting it from explorer in a template like: "https://explorer.iota.org/txblock/3BDwVQffoQ55ke72oevpLjjVCdFzYDVQeSRiAktgZxCp"
            // This is how it is soved in the demonstrator: `${NEXT_PUBLIC_EXPLORER_URL}/object/${objectId}?network=${NEXT_PUBLIC_NETWORK}`
            // Being the network constants hardcoded as following:
            // - process.env.NEXT_PUBLIC_EXPLORER_URL
            // - process.env.NEXT_PUBLIC_NETWORK
            linkHref={`https://explorer.iota.org/object/${DPP_ID as string}?network=testnet`}
            fontMono={true}
            valueColor="text-blue-600"
            showBorder={true}
          />
          <ItemValueRow
            rowState={getRowState('serialNumber')}
            label="Serial Number"
            value={productDetails?.serialNumber}
            fontMono={true}
            showBorder={true}
          />
          <ItemValueRow
            rowState={getRowState('dppCreationDate')}
            label="DPP Creation Date"
            // TODO: transform timestamp to a value template like: "2025-03-31 14:24:08"
            value={fromPosixMsToUtcDateFormat(productDetails?.timestamp)}
            fontMono={true}
            showBorder={true}
          />
        </DataGrid>
      </PanelContent>

      <TwoColumnSection
        leftColumn={(
          <CollapsibleInnerSection
            title="Battery Details"
            defaultExpanded={innerDetailsExpanded}
            onExpandToggle={handleExpandToggle}
          >
            <DataGrid>
              <ItemValueRow
                rowState={getRowState('batteryDetailsModel')}
                label="Model"
                value={productDetails?.billOfMaterial?.get("Model")}
                isLink={false}
                fontMono={true}
                showBorder={true}
              />
              <ItemValueRow
                rowState={getRowState('batteryDetailsManufacturingDate')}
                label="Manufacturing Date"
                value={productDetails?.billOfMaterial?.get("Manufacturing Date")}
                fontMono={true}
                showBorder={true}
              />
              <ItemValueRow
                rowState={getRowState('batteryDetailsCapacity')}
                label="Capacity"
                value={productDetails?.billOfMaterial?.get("Capacity")}
                fontMono={true}
                showBorder={true}
              />
              <ItemValueRow
                rowState={getRowState('batteryDetailsExpectedLifespan')}
                label="Expected Lifespan"
                value={productDetails?.billOfMaterial?.get("Expected Lifespan")}
                fontMono={true}
                showBorder={true}
              />
              <ItemValueRow
                rowState={getRowState('batteryDetailsBatteryPack')}
                label="Battery Pack"
                value={productDetails?.billOfMaterial?.get("Battery Pack")}
                fontMono={true}
                showBorder={true}
              />
            </DataGrid>
          </CollapsibleInnerSection>
        )}
        rightColumn={(
          <CollapsibleInnerSection
            title="Bill of Materials"
            defaultExpanded={innerDetailsExpanded}
            onExpandToggle={handleExpandToggle}
          >
            <DataGrid>
              <ItemValueRow
                rowState={getRowState('billOfMaterialsCells')}
                label="Cells"
                value={productDetails?.billOfMaterial?.get("Cells")}
                fontMono={true}
                showBorder={true}
              />
              <ItemValueRow
                rowState={getRowState('billOfMaterialsHousing')}
                label="Housing"
                value={productDetails?.billOfMaterial?.get("Housing")}
                fontMono={true}
                showBorder={true}
              />
              <ItemValueRow
                rowState={getRowState('billOfMaterialsVersion')}
                label="Version"
                value={productDetails?.billOfMaterial?.get("Version")}
                fontMono={true}
                showBorder={true}
              />
            </DataGrid>
          </CollapsibleInnerSection>
        )} >
      </TwoColumnSection>
    </CollapsibleSection>
  );
};

export default ProductDetailsCard;
