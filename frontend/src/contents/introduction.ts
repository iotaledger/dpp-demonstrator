import { EXPLORER_DATA_ICON } from "@/components/icons/ExplorerDataIcon";
import { GAS_STATION_DATA_ICON } from "@/components/icons/GasStationDataIcon";
import { HIERARCHIES_DATA_ICON } from "@/components/icons/HierarchiesDataIcon";
import { IDENTITY_DATA_ICON } from "@/components/icons/IdentityDataIcon";
import { LIFECYCLE_CREDITS_DATA_ICON } from "@/components/icons/LifecycleCreditsDataIcon";
import { NOTARIZATION_DATA_ICON } from "@/components/icons/NotarizationDataIcon";
import { PERFORM_DIAGNOSTICS_DATA_ICON } from "@/components/icons/PerformDiagnosticsDataIcon";
import { REVIEW_HISTORY_DATA_ICON } from "@/components/icons/ReviewHistoryDataIcon";
import { SCAN_PRODUCT_DATA_ICON } from "@/components/icons/ScanProductDataIcon";
import { TOKENIZATION_DATA_ICON } from "@/components/icons/TokenizationDataIcon";
import { WALLET_DATA_ICON } from "@/components/icons/WalletDataIcon";

export const INTRODUCTION_NAVIGATION = {
  content: {
    title: 'Welcome',
    backUrl: '/introduction/1',
    linkText: 'Skip Intro',
    linkUrl: '/explore-guided',
  },
};

export const INTRO_SLIDE_1 = {
  video: {
    src: '/assets/intro/placeholder-video.mp4',
    poster: '/assets/intro/placeholder-poster.jpg',
  },
  content: {
    welcomeText: 'Welcome to the',
    title: 'IOTA Product Demo',
    description: 'Imagine a product traveling through its entire lifecycle - from manufacturing to repairs, resale, and recycling. How can we ensure <strong>data about the product is trustworthy, complete, and accessible?</strong>',
  },
};

export const INTRO_SLIDE_2 = {
  video: {
    src: '/assets/intro/placeholder-video.mp4',
    poster: '/assets/intro/placeholder-poster.jpg',
  },
  content: {
    description: 'Today, you\'ll see how IOTA makes this possible through <strong>a hands-on Digital Product Passport (DPP) example.</strong>',
  },
};

export const INTRO_SLIDE_3 = {
  image: {
    src: '/assets/intro/disclaimer.webp',
    alt: 'Disclaimer',
  },
  content: {
    title: 'Disclaimer',
    description: 'This demo is for <strong>reference</strong> and is not a fully-functional or regulation-compliant DPP application. It was built to showcase how IOTA components can <strong>power real-world use cases</strong>, using Digital Product Passports as one example.',
  },
};

export const INTRO_SLIDE_4 = {
  image: {
    src: '/assets/intro/map.webp',
    alt: 'Products Move, Data Doesn\'t',
  },
  content: {
    title: 'Products Move, Data Doesn\'t',
    description: 'Lifecycle data often gets <strong>trapped in silos</strong>, lost along the product journey, or duplicated. Without incentives to share data, stakeholders <strong>hold onto information</strong>, creating gaps in trust, compliance, and sustainability.',
  },
};

export const INTRO_SLIDE_5 = {
  image: {
    src: '/assets/intro/passport.webp',
    alt: 'Introducing the Digital Product Passport (DPP)',
  },
  content: {
    title: 'Introducing the Digital Product Passport (DPP)',
    description: 'A DPP is a <strong>digital record</strong> that tracks a product throughout its entire lifecycle – from design to recycling. It is linked to a <strong>unique product ID</strong>, stores specifications, repairs, material data, compliance info, and more, and is soon to be <strong>required by EU regulation</strong> for many products. It transforms scattered data into a <strong>trusted and permanent record.</strong>',
  },
};

export const INTRO_SLIDE_6 = {
  image: {
    src: '/assets/intro/key-players.webp',
    alt: 'Key Players in the DPP ecosystem',
  },
  content: {
    title: 'Key Players in the DPP ecosystem',
    description: 'These are the key players in a minimal product lifecycle, each interacting with the Digital Product Passport at different stages.',
    players: [
      {
        title: 'Manufacturers',
        description: 'Design and produce goods, adding material, sustainability, and compliance data to the DPP.',
      },
      {
        title: 'Distributors',
        description: 'Handle product logistics and market delivery, updating the DPP with tracking, certification, and transport data.',
      },
      {
        title: 'Consumers',
        description: 'Purchase and use products, consulting the DPP for origin, sustainability, and repair options.',
      },
      {
        title: 'Service Providers',
        description: 'Offer repair, maintenance, and upgrades, relying on the DPP for product history and part details.',
      },
      {
        title: 'Recyclers',
        description: 'Process end-of-life products, using the DPP to identify materials and improve recovery.',
      },
      {
        title: 'Extended Producer Responsibility Organizations (EPRO)',
        description: 'Support manufacturers in end-of-life obligations and oversee recycling & compliance.',
      },
    ],
  },
};

export const INTRO_SLIDE_7 = {
  image: {
    src: '/assets/intro/pool-players.webp',
    alt: 'Solving the Data-Sharing Problem',
  },
  content: {
    title: 'Solving the Data-Sharing Problem',
    description: 'Lifecycle data is fragmented and rarely shared, making it hard to track. To solve this, each DPP can be pre-funded with Lifecycle Credits (LCCs), tokens that reward verified data contributions and are redeemable for real-world value.',
    steps: [
      'Manufacturers provide fiat funds to the EPRO, ensuring reward pools are backed with real-world value',
      'Manufacturers build the product, create its DPP, and pre-fund it with Lifecycle Credits (LCCs)',
      'EPROs define the LCC allocation for each DPP, and service providers earn these credits automatically when documenting repairs or maintenance',
      'Service providers send their earned LCC tokens back to the EPRO for redemption',
      'The EPRO processes redemption, converting LCCs back into fiat and closing the economic loop',
    ],
  },
};

export const INTRO_SLIDE_8 = {
  image: {
    src: '/assets/intro/help.webp',
    alt: 'A Trusted Digital Backbone',
  },
  content: {
    title: 'A Trusted Digital Backbone',
    description: 'IOTA provides the trusted digital backbone for use cases like Digital Product Passports. At its core is a global, public network where data is permanent, verifiable, and not controlled by any single company.',
  },
};

export const INTRO_SLIDE_9 = {
  content: {
    title: 'Powered by IOTA',
    description: 'This journey is powered by IOTA\'s open-source infrastructure and the IOTA Trust Framework.',
    sections: {
      trustFramework: {
        title: 'Trust Framework',
        products: [
          {
            title: 'IOTA Identity',
            icon: IDENTITY_DATA_ICON,
          },
          {
            title: 'IOTA Notarization',
            icon: NOTARIZATION_DATA_ICON,
          },
          {
            title: 'IOTA Tokenization',
            icon: TOKENIZATION_DATA_ICON,
          },
          {
            title: 'IOTA Hierarchies',
            icon: HIERARCHIES_DATA_ICON,
          },
          {
            title: 'IOTA Gas Station',
            icon: GAS_STATION_DATA_ICON,
          },
        ],
      },
      servicesAndDapps: {
        title: 'Services & dApps',
        products: [
          {
            title: 'IOTA Explorer',
            icon: EXPLORER_DATA_ICON,
          },
          {
            title: 'IOTA Wallets',
            icon: WALLET_DATA_ICON,
          },
        ],
      },
    },
  },
};

export const INTRO_SLIDE_10 = {
  content: {
    title: 'Your Mission in this Demo',
    description: 'Step into the role of a <strong>Service Provider</strong> in the ecosystem. Your job is to perform and document a maintenance event. In this demo, you\'ll:',
    processes: [
      {
        title: 'Scan a product',
        description: 'to access its DPP',
        icon: SCAN_PRODUCT_DATA_ICON,
      },
      {
        title: 'Review history',
        description: 'and request write access',
        icon: REVIEW_HISTORY_DATA_ICON,
      },
      {
        title: 'Perform diagnostics',
        description: 'and record health status',
        icon: PERFORM_DIAGNOSTICS_DATA_ICON,
      },
      {
        title: 'Receive Lifecycle Credits',
        description: 'automatically in your wallet',
        icon: LIFECYCLE_CREDITS_DATA_ICON,
      },
    ],
  },
};

export const INTRO_SLIDE_11 = {
  content: {
    title: 'Prepare your Wallet',
    description: 'Choose your setup:',
    walletOptions: [
      {
        type: 'Desktop',
        image: '/assets/intro/desktop.webp',
        alt: 'Desktop',
        title: 'Desktop',
        installText: '{COMPONENT} and connect when prompted.',
        desktopText: 'Install IOTA Browser Wallet',
        desktopUrl: 'https://chromewebstore.google.com/detail/iota-wallet/iidjkmdceolghepehaaddojmnjnkkija',
        testnetNotice: 'Please make sure you are connected to the IOTA testnet.',
      },
      {
        type: 'Mobile',
        image: '/assets/intro/mobile.webp',
        alt: 'Mobile',
        title: 'Mobile',
        installText: 'Install Nightly Wallet ({COMPONENT} | {COMPONENT}) and connect when prompted.',
        iosText: 'iOS',
        iosUrl: 'https://apps.apple.com/es/app/nightly-multichain-wallet/id6444768157',
        androidText: 'Android',
        androidUrl: 'https://play.google.com/store/apps/details?id=com.nightlymobile&pcampaignid=web_share',
        testnetNotice: 'Please make sure you are connected to the IOTA testnet.',
      },
    ],
    notice: {
      text: 'Both wallets enable secure interaction with this demo without requiring any token balance.',
    },
  },
};

export const INTRO_SLIDE_12 = {
  image: {
    src: '/assets/intro/dapp.webp',
    alt: 'DPP - Launch Now',
  },
  content: {
    title: 'Ready to Begin?',
    description: 'Click to start the guided demo as a Service Technician!',
    buttons: {
      desktop: {
        text: 'Start Tour',
        href: '/explore-guided',
        target: '_self',
      },
      mobile: {
        text: 'Start Tour',
        href: 'nightly://v1?network=iota&url=https://dpp.demo.iota.org/explore-guided',
      },
    },
  },
};
