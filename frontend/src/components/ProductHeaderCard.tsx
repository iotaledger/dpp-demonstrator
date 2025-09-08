import { PRODUCT_DETAILS } from '@/utils/constants';
import { useProductDetails } from '@/hooks/useProductDetails';
import React from 'react';

interface ProductHeaderCardProps {
  productImage?: string;
  productImageAlt?: string;
  productName?: string;
  manufacturerName?: string;
  opacity?: number;
  delay?: number;
  cardState?: 'default' | 'muted';
}

// TODO: Implement loading state
const ProductHeaderCard: React.FC<ProductHeaderCardProps> = ({
  productImage = "/assets/product.webp",
  productImageAlt = "Pro 48V Battery",
  productName = "Pro 48V Battery",
  manufacturerName = "EcoBike",
  opacity = 100,
  delay = 0.4,
  cardState = 'default'
}) => {
  const { productDetails, isSuccess } = useProductDetails(PRODUCT_DETAILS.dppId as string);

  // Card state styling for tutorial muted state
  const cardStateClasses = cardState === 'muted'
    ? 'border border-gray-200 !opacity-40'
    : 'border border-gray-200';

  return (
    <section className="px-4 sm:px-6 xl:px-12 max-w-7xl mx-auto py-2 sm:py-3">
      <div
        className={`bg-white rounded-lg shadow-xs transition-all duration-400 ease-out overflow-hidden p-3 sm:p-4 ${cardStateClasses}`}
        data-card-state={cardState}
        data-section="product-overview"
        id="product-overview"
        style={{
          opacity: opacity / 100,
          transition: `opacity ${delay}s ease-out`
        }}
      >
        <div className="transition-all duration-500 ease-out opacity-100 scale-100">
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
              {/* Product Name Row */}
              <div className="space-y-0.5">
                <div className="text-sm text-gray-500 font-medium">Product Name:</div>
                <h1 className="text-2xl font-semibold text-gray-900">{productDetails?.name}</h1>
              </div>

              {/* Manufacturer Name Row */}
              {/* TODO: Where do I get the manufacturer name? */}
              <div className="space-y-0.5">
                <div className="text-sm text-gray-500 font-medium">Manufacture Name:</div>
                <div className="text-md text-gray-700">{manufacturerName}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHeaderCard;
