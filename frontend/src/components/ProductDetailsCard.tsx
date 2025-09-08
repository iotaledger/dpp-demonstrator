import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import TwoColumnSection from './TwoColumnSection';
import { useIotaClientQuery } from '@iota/dapp-kit';
import { useProductDetails } from '@/hooks/useProductDetails';
import CollapsibleInnerSection from './CollapsableInnerSection';
import { PRODUCT_DETAILS } from '@/utils/constants';
import { fromPosixMsToUtcDateFormat, truncateAddress } from '@/utils/common';

interface ProductDetailsCardProps {
  dppId?: string;
  dppIdHref?: string;
  serialNumber?: string;
  creationDate?: string;
  opacity?: number;
  delay?: number;
}

// TODO: Implement loading state
const ProductDetailsCard: React.FC<ProductDetailsCardProps> = ({
  dppId = PRODUCT_DETAILS.dppId as string,
  dppIdHref = "https://explorer.iota.org/txblock/3BDwVQffoQ55ke72oevpLjjVCdFzYDVQeSRiAktgZxCp",
  serialNumber = "EB-48V-2024-001337",
  creationDate = "2025-03-31 14:24:08",
  opacity = 100,
  delay = 0.4
}) => {
  const { productDetails, isSuccess } = useProductDetails(dppId);

  return (
    <section className="px-4 sm:px-6 xl:px-12 max-w-7xl mx-auto py-2 sm:py-3">
      <CollapsibleSection
        title="Product Details" opacity={opacity}
        delay={delay}
      >
        <div className="panel space-y-4 border-1 rounded-lg p-4 transition-all duration-300 ease-out">
          <h3 className="font-medium text-gray-900">Product Passport Details</h3>
          <DataGrid>
            <ItemValueRow
              label="DPP ID"
              value={truncateAddress(dppId)}
              isLink={true}
              // TODO: mount the link to the object ID, probably getting it from explorer in a template like: "https://explorer.iota.org/txblock/3BDwVQffoQ55ke72oevpLjjVCdFzYDVQeSRiAktgZxCp"
              // This is how it is soved in the demonstrator: `${NEXT_PUBLIC_EXPLORER_URL}/object/${objectId}?network=${NEXT_PUBLIC_NETWORK}`
              // Being the network constants hardcoded as following:
              // - process.env.NEXT_PUBLIC_EXPLORER_URL
              // - process.env.NEXT_PUBLIC_NETWORK
              linkHref={`https://explorer.iota.org/object/${dppId}?network=testnet`}
              fontMono={true}
              valueColor="text-blue-600"
              showBorder={true}
            />
            <ItemValueRow
              label="Serial Number"
              value={productDetails?.serialNumber}
              fontMono={true}
              showBorder={true}
            />
            <ItemValueRow
              label="DPP Creation Date"
              // TODO: transform timestamp to a value template like: "2025-03-31 14:24:08"
              value={fromPosixMsToUtcDateFormat(productDetails?.timestamp)}
              fontMono={true}
              showBorder={true}
            />
          </DataGrid>
        </div>

        <TwoColumnSection
          gap="gap-4"
          leftColumn={(
            <CollapsibleInnerSection
              title="Battery Details"
            >
              <DataGrid>
                <ItemValueRow
                  label="Model"
                  value={productDetails?.billOfMaterial?.get("Model")}
                  isLink={false}
                  fontMono={true}
                  showBorder={true}
                />
                <ItemValueRow
                  label="Manufacturing Date"
                  value={productDetails?.billOfMaterial?.get("Manufacturing Date")}
                  fontMono={true}
                  showBorder={true}
                />
                <ItemValueRow
                  label="Capacity"
                  value={productDetails?.billOfMaterial?.get("Capacity")}
                  fontMono={true}
                  showBorder={true}
                />
                <ItemValueRow
                  label="Expected Lifespan"
                  value={productDetails?.billOfMaterial?.get("Expected Lifespan")}
                  fontMono={true}
                  showBorder={true}
                />
                <ItemValueRow
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
            >
              <DataGrid>
                <ItemValueRow
                  label="Cells"
                  value={productDetails?.billOfMaterial?.get("Cells")}
                  fontMono={true}
                  showBorder={true}
                />
                <ItemValueRow
                  label="Housing"
                  value={productDetails?.billOfMaterial?.get("Housing")}
                  fontMono={true}
                  showBorder={true}
                />
                <ItemValueRow
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
    </section>
  );
};

export default ProductDetailsCard;
