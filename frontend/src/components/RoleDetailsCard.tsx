import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import BadgeWithLink from './BadgeWithLink';
import { FEDERATION_DETAILS, PRODUCT_DETAILS } from '@/utils/constants';
import { useProductDetails } from '@/hooks/useProductDetails';
import { useFederationDetails } from '@/hooks/useFederationDetails';
import { getAllAccreditationsFlat } from '@/helpers/federation';
import { firstLetterUpperCase, truncateAddress } from '@/utils/common';
import { log } from 'node:console';
import { LoggedIn } from '@/stories/Header.stories';
import { useCurrentAccount, useCurrentWallet } from '@iota/dapp-kit';
import { useCheckLinkage } from '@/hooks/useCheckLinkage';

interface RoleDetailsCardProps {
  manufacturerName?: string;
  manufacturerLink?: string;
  serviceNetworkName?: string;
  serviceNetworkLink?: string;
  technicianName?: string;
  technicianLink?: string;
  opacity?: number;
  delay?: number;
}

// TODO: Implement loading state
const RoleDetailsCard: React.FC<RoleDetailsCardProps> = ({
  manufacturerName = "EcoBike",
  manufacturerLink = "https://explorer.iota.org/txblock/3BDwVQffoQ55ke72oevpLjjVCdFzYDVQeSRiAktgZxCp",
  serviceNetworkName = "Hierarchy",
  serviceNetworkLink = "https://explorer.iota.org/txblock/3BDwVQffoQ55ke72oevpLjjVCdFzYDVQeSRiAktgZxCp",
  technicianName = "You",
  technicianLink = "",
  opacity = 100,
  delay = 0.4
}) => {
  // NOTE: I'm using this hook to get the `manufacturer` value, and I aim to use it
  // in the `useCheckLinkage` hook. But, should I present it here in the Role Details?
  // The manufactor address bellow do belongs to the manufacture DiD? I don't get it.
  const { productDetails, isSuccess: isSuccessProductDetails } = useProductDetails(PRODUCT_DETAILS.dppId as string);
  const { federationDetails, isSuccess: isSuccessFederatilDetails } = useFederationDetails(FEDERATION_DETAILS.federationAddr as string);
  const currentAccount = useCurrentAccount();

  const getCurrentAccountBadge = React.useCallback((otherAddress: string): string => {
    return otherAddress === currentAccount?.address ? 'You' : '-----';
  }, [currentAccount]);

  React.useEffect(() => {
    if (isSuccessFederatilDetails) {
      // console.log('--- RoleDetailsCard has some TO-DOs ---');
      // console.log('federation ID:', federationDetails?.federationId);
      // console.log('federation details: ', federationDetails);
    }
  }, [isSuccessFederatilDetails, federationDetails]);

  React.useEffect(() => {
    if (isSuccessProductDetails) {
      console.log('product details: ', productDetails);
    }
  }, [isSuccessProductDetails, productDetails]);

  React.useEffect(() => {
    if (currentAccount) {
      // console.log('current wallet: ', currentAccount);
    }
  }, [currentAccount]);

  return (
    <section className="px-4 sm:px-6 xl:px-12 max-w-7xl mx-auto py-2 sm:py-3">
      <CollapsibleSection
        title="Role Details"
        opacity={opacity}
        delay={delay}
      >
        <div className="panel space-y-4 border-1 rounded-lg p-4 transition-all duration-300 ease-out">
          <DataGrid gap="gap-y-3 gap-x-6">
            {/* First, renders root authorities as "Service Network" */}
            {/* NOTE: What exactly a "Service Network" means?
                - Another way to invoke the federation itself, backed by the Trust Framework
            */}

            {isSuccessFederatilDetails && (
              federationDetails!.rootAuthorities.map((eachHierarchy) => (
                <ItemValueRow
                  key={eachHierarchy.id}
                  label="Service Network"
                  value={
                    <BadgeWithLink
                      badgeText={"Hierarchy"}
                      // NOTE: which one should be used, the `accountId` or the `id`?
                      // - What is the difference between them?
                      //   - A: the `accountid` is just a reference to the address owner of the federation
                      //
                      //   - Is the `accountId` the address to the accredited entity? It seems so
                      //   - Is the `id` the unique identifier for this accreditation? Isn't it an object?
                      //     I couldn't access it as object in the explorer
                      linkText={truncateAddress(federationDetails?.federationId)}
                      linkHref={`https://explorer.iota.org/object/${federationDetails?.federationId}?network=testnet`}
                    />
                  }
                  showBorder={true}
                />
              ))
            )}
            {isSuccessFederatilDetails && isSuccessProductDetails && (
              getAllAccreditationsFlat(federationDetails!).map((accreditation) => (
                <ItemValueRow
                  key={`${accreditation.id}`}
                  label={firstLetterUpperCase(accreditation.role)}
                  value={
                    <BadgeWithLink
                      // NOTE: Do I need to get this information from identity?
                      // badgeText={firstLetterUpperCase(accreditation.role)}
                      // TODO: Implement address verification from the connected wallet and place
                      //   "You" in `badgeText` if match your current address
                      badgeText={getCurrentAccountBadge(accreditation.entityId)}
                      linkText={truncateAddress(accreditation.entityId)}
                      linkHref={`https://explorer.iota.org/address/${accreditation.entityId}?network=testnet`}
                      // TODO: Implement the accreditation validation
                      showVerification={true}
                    />
                  }
                  showBorder={true}
                />
              ))
            )}
          </DataGrid>
        </div>
      </CollapsibleSection>
    </section>
  );
};

export default RoleDetailsCard;
