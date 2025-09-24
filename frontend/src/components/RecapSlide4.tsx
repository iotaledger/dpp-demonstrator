import React from 'react';
import FeatureCard from './FeatureCard';

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
            titleSize='large'
            contentPosition='center'
            variant="resource"
            layout="horizontal"
            opacity={100}
            translateY={0}
            delay={delay + 0.3}
          />
        </div>

        {/* Contact Section */}
        <Contact />
      </div>
    </div>
  );
};

function Contact() {
  const email = "partnerships@iota.org";
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 600);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full bg-gradient-to-br from-white/80 to-white/70 backdrop-blur-sm rounded-3xl p-4 md:p-6 border border-gray-200">
        <div className="text-center md:text-left">
          <h4 className="text-xl md:text-2xl font-semibold text-gray-900">Contact us</h4>
        </div>
        <div className="flex items-center gap-3 md:gap-4 bg-white rounded-2xl px-4 md:px-6 py-3 md:py-4 border border-gray-200 self-center md:self-auto">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-gray-500 mb-1">Email Address</span>
            <a className="text-sm md:text-base text-gray-900 font-medium hover:text-blue-600 transition-colors truncate" href="mailto://partnerships@iota.org">
              {email}
            </a>
          </div>
          <button
            className="w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 bg-gray-100 hover:bg-gray-200"
            title="Copy email address"
            onClick={handleCopy}
          >
            {copied ? <CopiedIcon /> : <CopyIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}

function CopiedIcon() {
  return (
    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  );
}
function CopyIcon() {
  return (

    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
    </svg>
  );
}

export default RecapSlide4;
