import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import BadgeWithLink from './BadgeWithLink';
import { useServiceHistory } from '@/hooks/useServiceHistory';
import { FEDERATION_DETAILS, PRODUCT_DETAILS } from '@/utils/constants';
import { firstLetterUpperCase, fromPosixMsToUtcDateFormat, truncateAddress } from '@/utils/common';
import { useFederationDetails } from '@/hooks/useFederationDetails';
import { getAllEntitiesByRole, getRolesByEntity, Role } from '@/helpers/federation';

interface ServiceHistoryCardProps {
  dppId?: string;
  entryType?: string;
  timestamp?: string;
  healthScore?: string;
  findings?: string;
  verification?: string;
  manufacturerName?: string;
  manufacturerId?: string;
  technicianName?: string;
  technicianId?: string;
  rewardContract?: string;
  rewardDistributed?: string;
  opacity?: number;
  delay?: number;
}

// TODO: Implement loading state
const ServiceHistoryCard: React.FC<ServiceHistoryCardProps> = ({
  dppId = PRODUCT_DETAILS.dppId as string,
  entryType = "Annual Maintenance",
  timestamp = "2023-03-31 14:24:08",
  healthScore = "99.98%",
  findings = "All systems nominal",
  verification = "Notarized at (Epoch 512) block 0x9ef...429e",
  manufacturerName = "EcoBike",
  manufacturerId = "0x9ef...429e",
  technicianName = "Prev. Technician",
  technicianId = "0x9ef....429e",
  rewardContract = "0x9ef...429e",
  rewardDistributed = "1 RWR",
  opacity = 100,
  delay = 0.4
}) => {
  const { serviceHistory, isSuccess } = useServiceHistory(dppId);
  const { federationDetails, isSuccess: isFederationDetailsSuccess } = useFederationDetails(FEDERATION_DETAILS.federationAddr as string);
  /**
   * NOTE: I'm extracting the latestService because the UI seems to be only interested in it.
   */
  const latestService = React.useMemo(() => {
    const lastService = serviceHistory?.chronologicalEntries.slice(-1).pop();
    return lastService ?? null;
  }, [serviceHistory]);

  const manufacturerEntities = React.useMemo(() => {
    if (isFederationDetailsSuccess && federationDetails) {
      return getAllEntitiesByRole(federationDetails, Role.manufacturer);
    }
    return null;
  }, [federationDetails, isFederationDetailsSuccess]);

  const latestServiceRole = React.useMemo(() => {
    if (isFederationDetailsSuccess && federationDetails && latestService) {
      const assignedRoles = getRolesByEntity(federationDetails, latestService.issuerAddress);
      const firstRole = assignedRoles.at(0);
      return firstRole;
    }
  }, [latestService, federationDetails, isFederationDetailsSuccess])

  React.useEffect(() => {
    if (isSuccess) {
      console.log('service history extracted: ', serviceHistory);
    }
  }, [serviceHistory, isSuccess])

  // TODO: Bind the service history entries to the cards
  return (
    <section className="px-4 sm:px-6 xl:px-12 max-w-7xl mx-auto py-2 sm:py-3">
      <CollapsibleSection
        title="Service History"
        subtitle='Maintenance and Repairs'
        opacity={opacity}
        delay={delay}
      >
        <div className="panel space-y-4 border-1 rounded-lg p-4 border-gray-200 transition-all duration-300 ease-out">
          <div className='flex items-center gap-2 mb-3'>
            <h3 className="font-medium text-gray-900">Health Snapshot</h3>
            <BadgeWithLink
              badgeText="#1"
              spacing="gap-0"
            />
          </div>
          <DataGrid gap="gap-y-2 gap-x-6">
            <ItemValueRow
              label="DPP ID"
              value={truncateAddress(latestService?.entryId)}
              columnMaxWidth={250}
              fontMono={true}
              valueColor="text-blue-600"
              isLink={true}
              linkHref={`https://explorer.iota.org/object/${dppId}?network=testnet`}
              showBorder={true}
            />
            <ItemValueRow
              label="Entry Type"
              value={latestService?.serviceType}
              columnMaxWidth={250}
              showBorder={true}
            />
            <ItemValueRow
              label="Timestamp"
              value={fromPosixMsToUtcDateFormat(latestService?.timestamp)}
              columnMaxWidth={250}
              showBorder={true}
            />

            <hr className="my-1 border-gray-200" />

            {/* TODO: How do I calculate it? */}
            <ItemValueRow
              label="Health Score"
              value={healthScore}
              columnMaxWidth={250}
              valueColor="text-gray-900 font-semibold"
              showBorder={true}
            />
            <ItemValueRow
              label="Findings"
              value={latestService?.serviceDescription}
              columnMaxWidth={250}
              showBorder={true}
            />
            {/* NOTE: It shows the info: "Notarized at (Epoch 512) block 0x9ef...429e" */}
            {/* TODO: How do I get this? */}
            <ItemValueRow
              label="Verification"
              value={verification}
              columnMaxWidth={250}
              showBorder={true}
            />

            <hr className="my-1 border-gray-200" />

            {manufacturerEntities && manufacturerEntities.map((entityAddress) => (
              <ItemValueRow
                key={entityAddress}
                label="Manufacturer"
                value={
                  <div className="flex items-center gap-2">
                    {/* TODO: Get manufacturer name from product details */}
                    <BadgeWithLink
                      badgeText={manufacturerName}
                      spacing="gap-0"
                    />
                    <a
                      target='_blank'
                      href={`https://explorer.iota.org/address/${entityAddress}?network=testnet`}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {truncateAddress(entityAddress)}
                    </a>
                  </div>
                }
                columnMaxWidth={250}
                showBorder={true}
              />
            ))}
            {latestServiceRole && (
              <ItemValueRow
                label={firstLetterUpperCase(latestServiceRole)}
                value={
                  <div className="flex items-center gap-2">
                    {/* TODO: How do I get the technician name? */}
                    <BadgeWithLink
                      badgeText={technicianName}
                      spacing="gap-0"
                    />
                    <a
                      target='_blank'
                      href={`https://explorer.iota.org/address/${latestService?.issuerAddress}?network=testnet`}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {truncateAddress(latestService?.issuerAddress)}
                    </a>
                  </div>
                }
                columnMaxWidth={250}
                showBorder={true}
              />
            )}

            <hr className="my-1 border-gray-200" />

            <ItemValueRow
              label="Reward contract"
              value={truncateAddress(latestService?.packageId)}
              columnMaxWidth={250}
              fontMono={true}
              valueColor="text-blue-600"
              linkHref={`https://explorer.iota.org/object/${latestService?.packageId}?network=testnet`}
              isLink={true}
              showBorder={true}
            />
            {/* NOTE: Sum of all rewards given */}
            {/* TODO: Discover a way to get this information from the reward contract. Maybe analysing calls to  */}
            <ItemValueRow
              label="Reward Distributed"
              value={rewardDistributed}
              columnMaxWidth={250}
              showBorder={true}
            />
          </DataGrid>
        </div>

        <div className="w-full grid justify-center mt-6">
          {/* Placeholder for additional content */}
        </div>
      </CollapsibleSection>
    </section>
  );
};

export default ServiceHistoryCard;
