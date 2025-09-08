import React from 'react';

interface ProductCardProps {
  icon: string;
  title: string;
  background?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  icon,
  title,
  background = "bg-white/10"
}) => {
  return (
    <div className={`${background} rounded-2xl flex w-full items-center justify-start gap-2 py-1 md:py-3 px-1 md:px-4`}>
      <div className="w-6 h-6 mx-auto flex items-center justify-center">
        <img className="w-6 h-6" src={icon} alt={title} />
      </div>
      <p className="text-sm md:text-base font-medium text-left">{title}</p>
    </div>
  );
};

export default ProductCard;