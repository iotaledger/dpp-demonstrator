/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

import i18n from '@/i18n';

const t = i18n.t;

export const APP_METADATA = {
  content: {
    title: t('DPP with IOTA Trust Framework'),
    description: t('Explore the Digital Product Passport with IOTA Trust Framework'),
  },
  asset: {
    iconUrl: '/assets/favicon-32x32.webp',
  },
};

export const END_OF_PASSPORT_MESSAGE = {
  content: {
    messageDefault: t('End of Digital Product Passport'),
  },
};

export const NAVIGATION_HINT = {
  content: {
    text: t('Use arrow keys or click to navigate'),
  },
};

export const NOT_TESTNET_WARNING_CARD = {
  content: {
    title: t('Wrong Network Detected.'),
    subtitle: t('Please switch your wallet to the IOTA Testnet.'),
    imageAlt: t('Wrong network detected.'),
  },
  asset: {
    imageUrl: '/assets/testnet-network.png',
  },
};

export const VIEW_MORE_BUTTON = {
  content: {
    text: t('View more'),
  },
};

export const ITEMS_LOADED_FEEDBACK_MESSAGE = {
  content: {
    allTransactionsShown: t('All {COMPONENT} transactions shown'),
    latestTransactionsShown: t('All {COMPONENT} latest transactions shown'),
  },
};

export const SERVICE_REQUEST_MODAL = {
  content: {
    title: t('Request Service Network Access'),
    labels: {
      federationAddress: t('Service Network Address'),
      role: t('Role'),
    },
    buttons: {
      submit: t('Submit'),
      submitting: t('serviceRequestModal.buttons.submitting', 'Submitting...'),
      closeAriaLabel: t('Close modal'),
      federationAddressCopied: t('Copied!'),
      federationAddressCopiedAriaLabel: t('Address copied'),
      federationAddressCopy: t('Copy address'),
      federationAddressCopyAriaLabel: t('Copy address'),
    },
    messages: {
      addressCopied: t('Address copied to clipboard!'),
    },
  },
};

export const SAVE_DIAGNOSTIC_MODAL = {
  content: {
    title: t('Health Snapshot'),
    buttons: {
      save: t('Save Snapshot'),
      saving: t('saveDiagnosticModal.buttons.saving', 'Saving...'),
      loading: t('saveDiagnosticModal.buttons.loading', 'Loading...'),
      closeAriaLabel: t('Close modal'),
    },
    diagnosticInfo: {
      technicianName: t('You'),
      eventName: t('Health Checkup'),
      healthScore: '76%',
      findings: t('Routine maintenance completed successfully'),
      issuerRole: t('repairer'),
    },
    labels: {
      dppId: t('DPP ID'),
      manufacturer: t('Manufacturer'),
      technician: t('Technician'),
      event: t('Event'),
      date: t('Date'),
      healthScore: t('Health Score'),
      findings: t('Findings'),
    },
  },
};

export const TOAST = {
  icon: {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
  },
};

export const BACKGROUND_VIDEO = {
  asset: {
    defaultPoster: '/src/lib/assets/intro/placeholder-poster.jpg',
  },
};

export const CARD_HEADER = {
  content: {
    titleDefault: t('Welcome'),
    linkTextDefault: t('Button'),
    backTextDefault: t('Back to the Start'),
    repositoryLink: t('Repository'),
  },
};

export const SLIDE_MANAGERS = {
  content: {
    noSlides: t('No slides'),
  },
};

export const ITEM_VALUE_ROW = {
  content: {
    addressPlaceholder: '0x04c...99fa',
  },
};

export const SLIDE_COUNTER = {
  content: {
    template: t('{current} of {total}'),
  },
};

export const STEP_NAVIGATION = {
  content: {
    previousLabelDefault: t('Back'),
    nextLabelDefault: t('Continue'),
  },
};

export const NAVIGATION_BUTTONS = {
  content: {
    previousSlide: t('Previous slide'),
    nextSlide: t('Next slide'),
  },
};

export const DIAGNOSTIC_CARD = {
  content: {
    title: t('EcoBike Pro Battery Diagnostic Tool'),
    subtitle: t('Annual Health Snapshot'),
    imageAlt: t('Diagnostic tool'),
    buttonTextStartDiagnostic: t('Start Diagnostic Now'),
    buttonTextRunningDiagnostic: t(
      'diagnosticCard.button.runningDiagnostic',
      'Running diagnostic...',
    ),
    loadingText: t('diagnosticCard.loading', 'Analyzing battery health...'),
  },
  asset: {
    imageUrl: 'https://dpp-demo-three.vercel.app/_app/immutable/assets/step_11.DFR7MaqW.webp',
  },
};

export const SERVICE_REQUEST_CARD = {
  content: {
    title: t('Request Service Network Access'),
    description: t(
      'To add information to this Digital Product Passport, you must be certified by EcoBike through their Service Network. Click below to request access as a trusted technician.',
    ),
    buttonText: t('Service Network Request'),
  },
};

export const GUIDED_SIDEBAR = {
  content: {
    back: t('Back'),
    connect: t('Connect'),
    request: t('Request'),
    diagnostic: t('Diagnostic'),
    finish: t('Finish'),
    next: t('Next'),
    behindTheScene: t('Behind the Scene'),
  },
  navigation: {
    recapUrl: '/recap/1',
  },
};

export const CONTACT = {
  content: {
    title: t('Contact Us'),
    emailLabel: t('Email Address'),
    copyTitle: t('Copy Email Address'),
  },
};

export const REPOSITORY = {
  content: {
    title: t('Our Repository'),
  },
};
