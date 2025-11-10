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
import i18n from "@/i18n";
const t = i18n.t;

export const INTRODUCTION_NAVIGATION = {
  content: {
    title: t('Welcome'),
    linkText: t('Skip Intro'),
  },
  navigation: {
    backUrl: '/introduction/1',
    linkUrl: '/explore-guided',
  },
};

export const INTRO_SLIDE_1 = {
  video: {
    src: '/assets/intro/placeholder-video.mp4',
    poster: '/assets/intro/placeholder-poster.jpg',
  },
  content: {
    welcomeText: t('Welcome to the'),
    title: t('IOTA Product Demo'),
    description: t('introSlide1.description', 'Imagine a product traveling through its entire lifecycle - from manufacturing to repairs, resale, and recycling. How can we ensure <strong>data about the product is trustworthy, complete, and accessible?</strong>'),
  },
};

export const INTRO_SLIDE_2 = {
  video: {
    src: '/assets/intro/placeholder-video.mp4',
    poster: '/assets/intro/placeholder-poster.jpg',
  },
  content: {
    description: t('introSlide2.description', 'Today, you\'ll see how IOTA makes this possible through <strong>a hands-on Digital Product Passport (DPP) example.</strong>'),
  },
};

export const INTRO_SLIDE_3 = {
  image: {
    src: '/assets/intro/disclaimer.webp',
    alt: t('Disclaimer'),
  },
  content: {
    title: t('Disclaimer'),
    description: t('introSlide3.description', 'This demo is for <strong>reference</strong> and is not a fully-functional or regulation-compliant DPP application. It was built to showcase how IOTA components can <strong>power real-world use cases</strong>, using Digital Product Passports as one example.'),
  },
};

export const INTRO_SLIDE_4 = {
  image: {
    src: '/assets/intro/map.webp',
    alt: t('Products Move, Data Doesn\'t'),
  },
  content: {
    title: t('Products Move, Data Doesn\'t'),
    description: t('introSlide4.description', 'Lifecycle data often gets <strong>trapped in silos</strong>, lost along the product journey, or duplicated. Without incentives to share data, stakeholders <strong>hold onto information</strong>, creating gaps in trust, compliance, and sustainability.'),
  },
};

export const INTRO_SLIDE_5 = {
  image: {
    src: '/assets/intro/passport.webp',
    alt: t('Introducing the Digital Product Passport (DPP)'),
  },
  content: {
    title: t('Introducing the Digital Product Passport (DPP)'),
    description: t('introSlide5.description', 'A DPP is a <strong>digital record</strong> that tracks a product throughout its entire lifecycle – from design to recycling. It is linked to a <strong>unique product ID</strong>, stores specifications, repairs, material data, compliance info, and more, and is soon to be <strong>required by EU regulation</strong> for many products. It transforms scattered data into a <strong>trusted and permanent record.</strong>'),
  },
};

export const INTRO_SLIDE_6 = {
  image: {
    src: '/assets/intro/key-players.webp',
    alt: t('Key Players in the DPP ecosystem'),
  },
  content: {
    title: t('Key Players in the DPP ecosystem'),
    description: t('introSlide6.description', 'These are the key players in a minimal product lifecycle, each interacting with the Digital Product Passport at different stages.'),
    players: [
      {
        title: t('Manufacturers'),
        description: t('Design and produce goods, adding material, sustainability, and compliance data to the DPP.'),
      },
      {
        title: t('Distributors'),
        description: t('Handle product logistics and market delivery, updating the DPP with tracking, certification, and transport data.'),
      },
      {
        title: t('Consumers'),
        description: t('Purchase and use products, consulting the DPP for origin, sustainability, and repair options.'),
      },
      {
        title: t('Service Providers'),
        description: t('Offer repair, maintenance, and upgrades, relying on the DPP for product history and part details.'),
      },
      {
        title: t('Recyclers'),
        description: t('Process end-of-life products, using the DPP to identify materials and improve recovery.'),
      },
      {
        title: t('Extended Producer Responsibility Organizations (EPRO)'),
        description: t('Support manufacturers in end-of-life obligations and oversee recycling & compliance.'),
      },
    ],
  },
};

export const INTRO_SLIDE_7 = {
  image: {
    src: '/assets/intro/pool-players.webp',
    alt: t('Solving the Data-Sharing Problem'),
  },
  content: {
    title: t('Solving the Data-Sharing Problem'),
    description: t('introSlide7.description', 'Lifecycle data is fragmented and rarely shared, making it hard to track. To solve this, each DPP can be pre-funded with Lifecycle Credits (LCCs), tokens that reward verified data contributions and are redeemable for real-world value.'),
    steps: [
      t('Manufacturers provide fiat funds to the EPRO, ensuring reward pools are backed with real-world value'),
      t('Manufacturers build the product, create its DPP, and pre-fund it with Lifecycle Credits (LCCs)'),
      t('EPROs define the LCC allocation for each DPP, and service providers earn these credits automatically when documenting repairs or maintenance'),
      t('Service providers send their earned LCC tokens back to the EPRO for redemption'),
      t('The EPRO processes redemption, converting LCCs back into fiat and closing the economic loop'),
    ],
  },
};

export const INTRO_SLIDE_8 = {
  image: {
    src: '/assets/intro/help.webp',
    alt: t('A Trusted Digital Backbone'),
  },
  content: {
    title: t('A Trusted Digital Backbone'),
    description: t('introSlide8.description', 'IOTA provides the trusted digital backbone for use cases like Digital Product Passports. At its core is a global, public network where data is permanent, verifiable, and not controlled by any single company.'),
  },
};

export const INTRO_SLIDE_9 = {
  content: {
    title: t('Powered by IOTA'),
    description: t('introSlide9.description', 'This journey is powered by IOTA\'s open-source infrastructure and the IOTA Trust Framework.'),
    sections: {
      trustFramework: {
        title: t('Trust Framework'),
        products: [
          {
            title: t('IOTA Identity'),
            icon: IDENTITY_DATA_ICON,
          },
          {
            title: t('IOTA Notarization'),
            icon: NOTARIZATION_DATA_ICON,
          },
          {
            title: t('IOTA Tokenization'),
            icon: TOKENIZATION_DATA_ICON,
          },
          {
            title: t('IOTA Hierarchies'),
            icon: HIERARCHIES_DATA_ICON,
          },
          {
            title: t('IOTA Gas Station'),
            icon: GAS_STATION_DATA_ICON,
          },
        ],
      },
      servicesAndDapps: {
        title: t('Services & dApps'),
        products: [
          {
            title: t('IOTA Explorer'),
            icon: EXPLORER_DATA_ICON,
          },
          {
            title: t('IOTA Wallets'),
            icon: WALLET_DATA_ICON,
          },
        ],
      },
    },
  },
};

export const INTRO_SLIDE_10 = {
  content: {
    title: t('Your Mission in this Demo'),
    description: t('introSlide10.description', 'Step into the role of a <strong>Service Provider</strong> in the ecosystem. Your job is to perform and document a maintenance event. In this demo, you\'ll:'),
    processes: [
      {
        title: t('Scan a product'),
        description: t('to access its DPP'),
        icon: SCAN_PRODUCT_DATA_ICON,
      },
      {
        title: t('Review history'),
        description: t('and request write access'),
        icon: REVIEW_HISTORY_DATA_ICON,
      },
      {
        title: t('Perform diagnostics'),
        description: t('and record health status'),
        icon: PERFORM_DIAGNOSTICS_DATA_ICON,
      },
      {
        title: t('Receive Lifecycle Credits'),
        description: t('automatically in your wallet'),
        icon: LIFECYCLE_CREDITS_DATA_ICON,
      },
    ],
  },
};

export const INTRO_SLIDE_11 = {
  content: {
    title: t('Prepare your Wallet'),
    description: t('introSlide11.description', 'Choose your setup:'),
    walletOptions: [
      {
        type: 'Desktop',
        image: '/assets/intro/desktop.webp',
        alt: t('Desktop'),
        title: t('Desktop'),
        installText: t('{COMPONENT} and connect when prompted'),
        desktopText: t('Install IOTA Browser Wallet'),
        desktopUrl: 'https://chromewebstore.google.com/detail/iota-wallet/iidjkmdceolghepehaaddojmnjnkkija',
        testnetNotice: t('Please make sure you are connected to the IOTA testnet.'),
      },
      {
        type: 'Mobile',
        image: '/assets/intro/mobile.webp',
        alt: t('Mobile'),
        title: t('Mobile'),
        installText: t('Install Nightly Wallet ({COMPONENT} | {COMPONENT}) and connect when prompted.'),
        iosText: 'iOS',
        iosUrl: 'https://apps.apple.com/es/app/nightly-multichain-wallet/id6444768157',
        androidText: 'Android',
        androidUrl: 'https://play.google.com/store/apps/details?id=com.nightlymobile&pcampaignid=web_share',
        testnetNotice: t('Please make sure you are connected to the IOTA testnet.'),
      },
    ],
    notice: {
      text: t('Both wallets enable secure interaction with this demo without requiring any token balance.'),
    },
  },
};

export const INTRO_SLIDE_12 = {
  image: {
    src: '/assets/intro/dapp.webp',
    alt: t('DPP - Launch Now'),
  },
  content: {
    title: t('Ready to Begin?'),
    description: t('introSlide12.description', 'Click to start the guided demo as a Service Technician!'),
    buttons: {
      desktop: {
        text: t('Start Tour'),
        href: '/explore-guided',
        target: '_self',
      },
      mobile: {
        text: t('Start Tour'),
        href: 'nightly://v1?network=iota&url=https://dpp.demo.iota.org/explore-guided',
      },
    },
  },
};
