import { useProductDetails } from '@/hooks/useProductDetails';
import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import { DPP_ID } from '@/utils/constants';

interface ProductHeaderCardProps {
  tutorialState?: 'selected' | 'muted' | 'no';
}

// TODO: Implement loading state
const ProductHeaderCard: React.FC<ProductHeaderCardProps> = ({
  tutorialState = 'no',
}) => {
  const { productDetails, isSuccess } = useProductDetails(DPP_ID);

  const getSectionState = () => {
    if (tutorialState === 'muted' || tutorialState === 'selected') {
      return tutorialState;
    }

    return 'default';
  };

  return (
    <CollapsibleSection
      cardState={getSectionState()}
      showTitle={false}
      showButton={false}
    >
      <div className="flex flex-col sm:flex-row sm:gap-8">
        {/* Image Container */}
        <div className="flex justify-center sm:max-w-xs sm:justify-start">
          <div className="w-full bg-blue-50 relative overflow-hidden rounded-lg">
            <img
              className="w-full h-auto object-contain"
              src={productDetails?.imageUrl}
              alt={productDetails?.name}
            />
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col justify-center space-y-4 pt-3">
          <div className="space-y-0.5">
            <div className="text-sm text-gray-500 font-medium">Product Name:</div>
            <h1 className="text-2xl font-semibold text-gray-900">{productDetails?.name}</h1>
          </div>
          <div className="space-y-0.5">
            <div className="text-sm text-gray-500 font-medium">Manufacture Name:</div>
            <div className="text-xl font-medium text-gray-900">EcoBike</div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default ProductHeaderCard;
