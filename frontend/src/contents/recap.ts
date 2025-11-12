/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

import { EXPLORER_DATA_ICON } from '@/components/icons/ExplorerDataIcon';
import { GAS_STATION_DATA_ICON } from '@/components/icons/GasStationDataIcon';
import { HIERARCHIES_DATA_ICON } from '@/components/icons/HierarchiesDataIcon';
import { IDENTITY_DATA_ICON } from '@/components/icons/IdentityDataIcon';
import { LINK_OUT_DATA_ICON } from '@/components/icons/LinkOutDataIcon';
import { NETWORK_DATA_ICON } from '@/components/icons/NetworkDataIcon';
import { NOTARIZATION_DATA_ICON } from '@/components/icons/NotarizationDataIcon';
import { TOKENIZATION_DATA_ICON } from '@/components/icons/TokenizationDataIcon';
import { WALLET_DATA_ICON } from '@/components/icons/WalletDataIcon';
import i18n from '@/i18n';

const t = i18n.t;

export const RECAP_NAVIGATION = {
  content: {
    title: t('Welcome'),
    backText: t('← Back to DPP'),
    linkText: t('↺ Reset to Intro'),
  },
  navigation: {
    backUrl: '/explore-freely',
    linkUrl: '/introduction/1',
  },
};

export const RECAP_SLIDE_1 = {
  title: t('What You Just Experienced'),
  description: t(
    'recapSlide1.description',
    'You stepped into the role of a certified service technician and experienced how IOTA infrastructure enables verifiable and incentivized lifecycle actions:',
  ),
  checkmarkItems: [
    t('Verified manufacturer identity via domain linkage'),
    t('Became certified through IOTA Hierarchies'),
    t('Added a signed health snapshot using IOTA Notarization'),
    t('Received a token payout via IOTA Tokenization'),
    t('Paid no fees thanks to IOTA Gas Station'),
    t('Connected securely via a browser or mobile wallet'),
  ],
};

export const RECAP_SLIDE_2 = {
  image: {
    src: '/assets/recap/recap_1.webp',
    alt: 'Beyond Digital Product Passports',
  },
  title: t('Beyond Digital Product Passports'),
  description: t(
    'recapSlide2.description',
    'While this demo used a DPPs as its example, the principles and components you just explored are not tied to one sector or regulation. All showcased IOTA components are designed to be modular, open, and industry-agnostic.',
  ),
};

export const RECAP_SLIDE_3 = {
  title: t('IOTA Product Recap'),
  description: t(
    'recapSlide3.description',
    'The IOTA Trust Framework enables trusted digital collaboration across the product lifecycle:',
  ),
  trustFramework: {
    title: t('IOTA Trust Framework'),
    description: t('Enables trusted digital collaboration across the product lifecycle '),
  },
  trustFrameworkProducts: [
    {
      title: t('IOTA Identity'),
      description: t('Issue digital identities linked to real-world organisations'),
      icon: IDENTITY_DATA_ICON,
      link: 'https://www.iota.org/products/identity',
    },
    {
      title: t('IOTA Hierarchies'),
      description: t('Grant attribute-based permissions'),
      icon: HIERARCHIES_DATA_ICON,
      link: 'https://www.iota.org/products/hierarchies',
    },
    {
      title: t('IOTA Notarization'),
      description: t('Anchor data in an immutable audit trail'),
      icon: NOTARIZATION_DATA_ICON,
      link: 'https://www.iota.org/products/notarization',
    },
    {
      title: t('IOTA Tokenization'),
      description: t('Automate reward distribution'),
      icon: TOKENIZATION_DATA_ICON,
      link: 'https://www.iota.org/products/tokenization',
    },
    {
      title: t('IOTA Gas Station'),
      description: t('Sponsor transaction fees'),
      icon: GAS_STATION_DATA_ICON,
      link: 'https://www.iota.org/products/gas-station',
    },
  ],
  servicesProducts: [
    {
      title: t('IOTA Public Infrastructure'),
      description: '',
      icon: LINK_OUT_DATA_ICON,
      link: 'https://www.iota.org/products/tooling',
    },
    {
      title: t('IOTA Wallets'),
      description: t('Securely connect to apps'),
      icon: WALLET_DATA_ICON,
      link: 'https://www.iota.org/products/wallet',
    },
    {
      title: t('IOTA Explorer'),
      description: t('Verify everything publicly'),
      icon: EXPLORER_DATA_ICON,
      link: 'https://explorer.iota.org',
    },
    {
      title: t('IOTA Mainnet'),
      description: t('High performance Ledger'),
      icon: NETWORK_DATA_ICON,
      link: 'https://www.iota.org/products/mainnet',
    },
  ],
};

export const RECAP_SLIDE_4 = {
  title: t('Get Started with IOTA'),
  resources: [
    {
      title: t('Developer Documentation'),
      description: t('Get started building on IOTA today'),
      image: '/assets/recap/docs.webp',
      url: 'https://docs.iota.org',
    },
    {
      title: t('IOTA Grants'),
      description: t(
        'Apply for a grant from iotalabs and turn your wildest dApp dreams into reality',
      ),
      image: '/assets/recap/grants.webp',
      url: 'https://www.iotalabs.io/grants',
    },
  ],
  businessProgram: {
    title: t('IOTA Business Innovation Program'),
    description: t('We invite innovators to showcase real-world impact with IOTA'),
    image: '/assets/recap/bip.webp',
    url: 'https://www.iota.org/build/business-innovation-program',
  },
  contact: {
    email: 'partnerships@iota.org',
  },
};
