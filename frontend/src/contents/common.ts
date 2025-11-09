export const APP_METADATA = {
  content: {
    title: 'DPP with IOTA Trust Framework',
    description: 'Explore the Digital Product Passport with IOTA Trust Framework',
  },
  asset: {
    iconUrl: '/assets/favicon-32x32.webp',
  },
};

export const END_OF_PASSPORT_MESSAGE = {
  content: {
    messageDefault: 'End of Digital Product Passport',
  },
};

export const NAVIGATION_HINT = {
  content: {
    text: 'Use arrow keys or click to navigate',
  },
};

export const NOT_TESTNET_WARNING_CARD = {
  content: {
    title: 'Wrong network detected. ',
    subtitle: 'Please switch your wallet to the IOTA Testnet.',
    imageAlt: 'Wrong network detected.',
  },
  asset: {
    imageUrl: '/assets/testnet-network.png',
  },
};

export const VIEW_MORE_BUTTON = {
  content: {
    text: 'View more',
  },
};

export const ITEMS_LOADED_FEEDBACK_MESSAGE = {
  content: {
    allTransactionsShown: 'All {COMPONENT} transactions shown',
    latestTransactionsShown: 'All {COMPONENT} latest transactions shown',
  },
};

export const SERVICE_REQUEST_MODAL = {
  content: {
    title: 'Request Service Network Access',
    labels: {
      federationAddress: 'Service Network Address',
      role: 'Role',
    },
    buttons: {
      submit: 'Submit',
      submitting: 'Submitting...',
      closeAriaLabel: 'Close modal',
      federationAddressCopied: 'Copied!',
      federationAddressCopiedAriaLabel: 'Address copied',
      federationAddressCopy: 'Copy address',
      federationAddressCopyAriaLabel: 'Copy address',
    },
    messages: {
      addressCopied: 'Address copied to clipboard!',
    },
  },
};

export const SAVE_DIAGNOSTIC_MODAL = {
  content: {
    title: 'Health Snapshot',
    buttons: {
      save: 'Save Snapshot',
      saving: 'Saving...',
      loading: 'Loading...',
      closeAriaLabel: 'Close modal',
    },
    diagnosticInfo: {
      technicianName: 'You',
      eventName: 'Health Checkup',
      healthScore: '76%',
      findings: 'Routine maintenance completed successfully',
      issuerRole: 'repairer',
    },
    labels: {
      dppId: 'DPP ID',
      manufacturer: 'Manufacturer',
      technician: 'Technician',
      event: 'Event',
      date: 'Date',
      healthScore: 'Health Score',
      findings: 'Findings',
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
    titleDefault: 'Welcome',
    linkTextDefault: 'Button',
    backTextDefault: 'Back to the Start',
  },
};

export const SLIDE_MANAGERS = {
  content: {
    noSlides: 'No slides',
  },
};

export const ITEM_VALUE_ROW = {
  content: {
    addressPlaceholder: '0x04c...99fa',
  },
};

export const SLIDE_COUNTER = {
  content: {
    template: '{current} of {total}',
  },
};

export const STEP_NAVIGATION = {
  content: {
    previousLabelDefault: 'Back',
    nextLabelDefault: 'Continue',
  },
};

export const NAVIGATION_BUTTONS = {
  content: {
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
  },
};

export const DIAGNOSTIC_CARD = {
  content: {
    title: 'EcoBike Pro Battery diagnostic tool',
    subtitle: 'Annual Health Snapshot',
    imageAlt: 'Diagnostic tool',
    buttonTextStartDiagnostic: 'Start diagnostic now',
    buttonTextRunningDiagnostic: 'Running diagnostic...',
    loadingText: 'Analyzing battery health...',
  },
  asset: {
    imageUrl: 'https://dpp-demo-three.vercel.app/_app/immutable/assets/step_11.DFR7MaqW.webp',
  },
};

export const SERVICE_REQUEST_CARD = {
  content: {
    title: 'Request Service Network Access',
    description: 'To add information to this Digital Product Passport, you must be certified by EcoBike through their Service Network. Click below to request access as a trusted technician.',
    buttonText: 'Service Network Request',
  },
};

export const GUIDED_SIDEBAR = {
  content: {
    back: 'Back',
    connect: 'Connect',
    request: 'Request',
    diagnostic: 'Diagnostic',
    finish: 'Finish',
    next: 'Next',
    behindTheScene: 'Behind the Scene',
  },
  navigation: {
    recapUrl: '/recap/1',
  },
};

export const CONTACT = {
  content: {
    title: 'Contact us',
    emailLabel: 'Email Address',
    copyTitle: 'Copy email address',
  },
};
