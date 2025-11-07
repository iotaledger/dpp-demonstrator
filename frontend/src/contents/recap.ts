import { EXPLORER_DATA_ICON } from "@/components/icons/ExplorerDataIcon";
import { GAS_STATION_DATA_ICON } from "@/components/icons/GasStationDataIcon";
import { HIERARCHIES_DATA_ICON } from "@/components/icons/HierarchiesDataIcon";
import { IDENTITY_DATA_ICON } from "@/components/icons/IdentityDataIcon";
import { LINK_OUT_DATA_ICON } from "@/components/icons/LinkOutDataIcon";
import { NETWORK_DATA_ICON } from "@/components/icons/NetworkDataIcon";
import { NOTARIZATION_DATA_ICON } from "@/components/icons/NotarizationDataIcon";
import { TOKENIZATION_DATA_ICON } from "@/components/icons/TokenizationDataIcon";
import { WALLET_DATA_ICON } from "@/components/icons/WalletDataIcon";


export const RECAP_SLIDE_1 = {
  title: 'What You Just Experienced',
  description: 'You stepped into the role of a certified service technician and experienced how IOTA infrastructure enables verifiable and incentivized lifecycle actions:',
  checkmarkItems: [
    'Verified manufacturer identity via domain linkage',
    'Became certified through IOTA Hierarchies',
    'Added a signed health snapshot using IOTA Notarization',
    'Received a token payout via IOTA Tokenization',
    'Paid no fees thanks to IOTA Gas Station',
    'Connected securely via a browser or mobile wallet',
  ],
};

export const RECAP_SLIDE_2 = {
  image: {
    src: '/assets/recap/recap_1.webp',
    alt: 'Beyond Digital Product Passports',
  },
  title: 'Beyond Digital Product Passports',
  description: 'While this demo used a DPPs as its example, the principles and components you just explored are not tied to one sector or regulation. All showcased IOTA components are designed to be modular, open, and industry-agnostic.',
};

export const RECAP_SLIDE_3 = {
  title: 'IOTA Product Recap',
  description: 'The IOTA Trust Framework enables trusted digital collaboration across the product lifecycle:',
  trustFramework: {
    title: 'IOTA Trust Framework',
    description: 'Enables trusted digital collaboration across the product lifecycle ',
  },
  trustFrameworkProducts: [
    {
      title: 'IOTA Identity',
      description: 'Issue digital identities linked to real-world organisations',
      icon: IDENTITY_DATA_ICON,
      link: 'https://www.iota.org/products/identity',
    },
    {
      title: 'IOTA Hierarchies',
      description: 'Grant attribute-based permissions',
      icon: HIERARCHIES_DATA_ICON,
      link: 'https://www.iota.org/products/hierarchies',
    },
    {
      title: 'IOTA Notarization',
      description: 'Anchor data in an immutable audit trail',
      icon: NOTARIZATION_DATA_ICON,
      link: 'https://www.iota.org/products/notarization',
    },
    {
      title: 'IOTA Tokenization',
      description: 'Automate reward distribution',
      icon: TOKENIZATION_DATA_ICON,
      link: 'https://www.iota.org/products/tokenization',
    },
    {
      title: 'IOTA Gas Station',
      description: 'Sponsor transaction fees',
      icon: GAS_STATION_DATA_ICON,
      link: 'https://www.iota.org/products/gas-station',
    },
  ],
  servicesProducts: [
    {
      title: 'IOTA Public Infrastructure',
      description: '',
      icon: LINK_OUT_DATA_ICON,
      link: 'https://www.iota.org/products/tooling',
    },
    {
      title: 'IOTA Wallets',
      description: 'Securely connect to apps',
      icon: WALLET_DATA_ICON,
      link: 'https://www.iota.org/products/wallet',
    },
    {
      title: 'IOTA Explorer',
      description: 'Verify everything publicly',
      icon: EXPLORER_DATA_ICON,
      link: 'https://explorer.iota.org',
    },
    {
      title: 'IOTA Mainnet',
      description: 'High performance Ledger',
      icon: NETWORK_DATA_ICON,
      link: 'https://www.iota.org/products/mainnet',
    },
  ],
};

export const RECAP_SLIDE_4 = {
  title: 'Get Started with IOTA',
  resources: [
    {
      title: 'Developer Documentation',
      description: 'Get started building on IOTA today',
      image: '/assets/recap/docs.webp',
      url: 'https://docs.iota.org',
    },
    {
      title: 'IOTA Grants',
      description: 'Apply for a grant from iotalabs and turn your wildest dApp dreams into reality',
      image: '/assets/recap/grants.webp',
      url: 'https://www.iotalabs.io/grants',
    },
  ],
  businessProgram: {
    title: 'IOTA Business Innovation Program',
    description: 'We invite innovators to showcase real-world impact with IOTA',
    image: '/assets/recap/bip.webp',
    url: 'https://www.iota.org/build/business-innovation-program',
  },
  contact: {
    email: 'partnerships@iota.org',
  }
};
