import React from 'react';
import FeatureCard from './FeatureCard';

interface RecapSlide3Props {
  title?: string;
  description?: string;
  opacity?: number;
  delay?: number;
}

const RecapSlide3: React.FC<RecapSlide3Props> = ({
  title = "IOTA Product Recap",
  description = "The IOTA Trust Framework enables trusted digital collaboration across the product lifecycle:",
  opacity = 100,
  delay = 0.3
}) => {
  const containerStyle = {
    opacity: opacity / 100,
    transform: `scale(${opacity === 100 ? 1 : 0.95})`,
    transitionDelay: `${delay}s`,
    transition: `opacity 0.8s ease-out, transform 0.8s ease-out`
  };

  // IOTA Trust Framework Products (5 products for main grid)
  const trustFrameworkProducts = [
    {
      title: "IOTA Identity",
      description: "Issue digital identities linked to real-world organisations",
      image: "/assets/recap/products/product_identity.webp",
      url: "https://www.iota.org/products/identity"
    },
    {
      title: "IOTA Notarization",
      description: "Anchor data in an immutable audit trail",
      image: "/assets/recap/products/product_notarization.webp",
      url: "https://www.iota.org/products/notarization"
    },
    {
      title: "IOTA Tokenization",
      description: "Automate reward distribution",
      image: "/assets/recap/products/product_tokenization.webp",
      url: "https://www.iota.org/products/tokenization"
    },
    {
      title: "IOTA Gas Station",
      description: "Sponsor transaction fees",
      image: "/assets/recap/products/product_gas_station.webp",
      url: "https://www.iota.org/products/gas-station"
    },
    {
      title: "IOTA Hierarchies",
      description: "Grant attribute-based permissions",
      image: "/assets/recap/products/product_hierarchies.webp",
      url: "https://www.iota.org/products/hierarchies"
    }
  ];

  // Services & dApps (2 services + 1 explore)
  const servicesProducts = [
    {
      title: "IOTA Wallets",
      description: "Securely connect to apps",
      image: "/assets/recap/products/product_wallets.webp",
      url: "https://www.iota.org/products/wallet",
      colSpan: "col-span-2"
    },
    {
      title: "IOTA Explorer",
      description: "Verify everything publicly",
      image: "/assets/recap/products/product_explorer.webp",
      url: "https://explorer.iota.org",
      colSpan: "col-span-2"
    },
    {
      title: "Services & dApps",
      description: "",
      image: "",
      url: "https://www.iota.org/products/tooling",
      variant: "explore" as const,
      layout: "compact" as const,
      colSpan: ""
    }
  ];

  return (
    <div
      className="max-w-7xl mx-auto p-6 md:p-12 h-full"
      style={containerStyle}
    >
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <div className="text-gray-900 text-xl md:text-2xl lg:text-3xl font-medium tracking-[-0.56px] mb-4">
            <p className="leading-[1.2]">{title}</p>
          </div>
          <div className="text-gray-600 text-base md:text-lg mb-4 tracking-[0.1px] max-w-xl mx-auto">
            <p className="leading-[1.6]">{description}</p>
          </div>
        </div>

        <div>
          {/* Desktop: 3 columns on small screens, 5 columns on large */}
          <div className="hidden sm:grid grid-cols-3 lg:grid-cols-5 gap-4">
            {trustFrameworkProducts.map((product, index) => (
              <FeatureCard
                key={product.title}
                title={product.title}
                description={product.description}
                image={product.image}
                alt={product.title}
                url={product.url}
                variant="product"
                opacity={100}
                translateY={0}
                delay={delay + 0.1 + index * 0.1}
              />
            ))}
          </div>

          {/* Mobile: 2 columns */}
          <div className="sm:hidden grid grid-cols-2 gap-4">
            {trustFrameworkProducts.map((product, index) => (
              <FeatureCard
                key={product.title}
                title={product.title}
                description={product.description}
                image={product.image}
                alt={product.title}
                url={product.url}
                variant="product"
                opacity={100}
                translateY={0}
                delay={delay + 0.1 + index * 0.1}
              />
            ))}
          </div>
        </div>

        <div>
          {/* Desktop: 5 columns grid with spanning */}
          <div className="hidden sm:grid grid-cols-5 gap-4">
            {servicesProducts.map((product, index) => (
              <FeatureCard
                key={product.title}
                title={product.title}
                description={product.description}
                image={product.image}
                alt={product.title}
                url={product.url}
                variant={product.variant || "service"}
                layout={product.layout || "horizontal"}
                colSpan={product.colSpan}
                opacity={100}
                translateY={0}
                delay={delay + 0.8 + index * 0.1}
              />
            ))}
          </div>

          {/* Mobile: 2 columns with bottom padding */}
          <div className="sm:hidden grid grid-cols-2 gap-4 pb-8 sm:pb-0">
            {servicesProducts.map((product, index) => (
              <FeatureCard
                key={product.title}
                title={product.title}
                description={product.description}
                image={product.image}
                alt={product.title}
                url={product.url}
                variant={product.variant || "service"}
                layout={product.layout || "horizontal"}
                opacity={100}
                translateY={0}
                delay={delay + 0.8 + index * 0.1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecapSlide3;
