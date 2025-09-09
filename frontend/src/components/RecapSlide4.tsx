import React from 'react';
import FeatureCard from './FeatureCard';
import ContactSection from './ContactSection';

interface RecapSlide4Props {
  title?: string;
  opacity?: number;
  delay?: number;
}

const RecapSlide4: React.FC<RecapSlide4Props> = ({
  title = "Get Started with IOTA",
  opacity = 100,
  delay = 0.3
}) => {
  const containerStyle = {
    opacity: opacity / 100,
    transform: `translateX(${opacity === 100 ? 0 : 4}px)`,
    transitionDelay: `${delay}s`,
    transition: `opacity 0.8s ease-out, transform 0.8s ease-out`
  };

  const resourceCards = [
    {
      title: "Developer Documentation",
      description: "Get started building on IOTA today",
      image: "/assets/recap/docs.webp",
      url: "https://docs.iota.org"
    },
    {
      title: "IOTA Grants",
      description: "Apply for a grant from iotalabs and turn your wildest dApp dreams into reality",
      image: "/assets/recap/grants.webp",
      url: "https://www.iotalabs.io/grants"
    }
  ];

  const businessCard = {
    title: "IOTA Business Innovation Program",
    description: "We invite innovators to showcase real-world impact with IOTA",
    image: "/assets/recap/bip.webp",
    url: "https://www.iota.org/build/business-innovation-program"
  };

  // TODO: implement email content copy to clipboard, maybe it coulbe be a hook
  const handleEmailCopy = () => { };

  return (
    <div
      className="max-w-6xl mx-auto p-6 md:p-12"
      style={containerStyle}
    >
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <div className="text-gray-900 text-xl md:text-2xl lg:text-3xl font-medium tracking-[-0.56px] mb-8">
            <p className="leading-[1.2]">{title}</p>
          </div>
        </div>

        {/* Top 2 resource cards in grid */}
        <div className="grid grid-cols-2 gap-4">
          {resourceCards.map((card, index) => (
            <FeatureCard
              key={card.title}
              title={card.title}
              description={card.description}
              image={card.image}
              alt={card.title}
              url={card.url}
              variant="resource"
              layout="horizontal"
              titleWeight="semibold"
              opacity={100}
              translateY={0}
              delay={delay + 0.1 + index * 0.1}
            />
          ))}
        </div>

        {/* Full-width business innovation program card */}
        <div>
          <FeatureCard
            title={businessCard.title}
            description={businessCard.description}
            image={businessCard.image}
            alt={businessCard.title}
            url={businessCard.url}
            variant="resource"
            layout="horizontal"
            titleWeight="semibold"
            opacity={100}
            translateY={0}
            delay={delay + 0.3}
          />
        </div>

        {/* Contact Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <ContactSection
            title="Contact us"
            email="partnerships@iota.org"
            emailLabel="Email Address"
            onCopy={handleEmailCopy}
            opacity={100}
            delay={delay + 0.4}
          />
        </div>
      </div>
    </div>
  );
};

export default RecapSlide4;
