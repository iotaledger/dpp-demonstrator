export const EXPLORE_FREELY_NAVIGATION = {
  content: {
    backText: '↺ Reset to Intro',
    linkText: 'Switch to Guided Tour',
  },
  navigation: {
    backUrl: '/introduction/1',
    linkUrl: '/explore-guided',
  },
};

export const EXPLORE_GUIDED_NAVIGATION = {
  content: {
    backText: '↺ Reset to Intro',
    linkText: 'Switch to free exploration',
  },
  navigation: {
    backUrl: '/introduction/1',
    linkUrl: '/explore-freely',
  },
};

export const PRODUCT_HEADER = {
  content: {
    productName: 'Product Name:',
    manufacturerName: 'Manufacturer Name:',
  },
};

export const PRODUCT_DETAILS = {
  content: {
    passportDetails: {
      title: 'Product Passport Details',
      dppIdLabel: 'DPP ID',
      serialNumberLabel: 'Serial Number',
      dppCreationDate: 'DPP Creation Date',
    },
    batteryDetails: {
      title: 'Battery Details',
      modelLabel: 'Model',
      manufacturingDateLabel: 'Manufacturing Date',
      capacityLabel: 'Capacity',
      expectedLifespanLabel: 'Expected Lifespan',
      batteryPackLabel: 'Battery Pack',
    },
    billOfMaterials: {
      title: 'Bill of Materials',
      cellsLabel: 'Cells',
      housingLabel: 'Housing',
      versionLabel: 'Version',
    },
  },
};

export const ROLE_DETAILS = {
  content: {
    title: 'Role Details',
    manufacturerLabel: 'Manufacturer',
    serviceNetworkLabel: 'Service Network',
    hierarchyBadgeLabel: 'Hierarchy',
    technicianBadgeLabel: 'Technician',
  },
};

export const REWARD_POOL = {
  content: {
    title: 'Reward Pool Status',
    lifecycleCreditTitle: 'Lifecycle Credit (LCC) Rewards',
    rewardContractLabel: 'Reward contract',
    totalLifecycleFundLabel: 'Total Lifecycle Fund',
    totalLifecycleFundValueFallback: '0 LCC',
    endOfLifeRewardsLabel: 'End-of-life Rewards',
    endOfLifeRewardsValueDefault: '30 LCC',
    maintenanceRewardsRemainingLabel: 'Maintenance Rewards remaining',
    rewardTableTitle: 'Reward Table',
    annualMaintenanceRewardLabel: 'Annual Maintenance Reward',
    annualMaintenanceRewardValueDefault: '1 LCC',
    recyclingRewardLabel: 'Recycling Reward',
    recyclingRewardValueDefault: '10 LCC',
    finalOwnerLabel: 'Final owner',
    finalOwnerValueDefault: '10 LCC',
    manufacturerReturnLabel: 'Manufacturer return',
    manufacturerReturnValueDefault: '10 LCC',
  },
};

export const REWARD_TRANSACTIONS = {
  content: {
    title: 'Rewards transactions',
    subtitle: 'List of all rewards transactions',
    healthSnapshotEventName: 'Health Snapshot',
    serviceIdLabel: 'Service ID',
    transactionIdLabel: 'Transaction ID',
    timestampLabel: 'Timestamp',
    technicianLabel: 'Technician',
    rewardDistributedLabel: 'Reward Distributed',
  },
};

export const SERVICE_HISTORY = {
  content: {
    title: 'Service History',
    subtitle: 'Maintenance and Repairs',
    healthSnapshotEventName: 'Health Snapshot',
    eventIdLabel: 'Event ID',
    entryTypeLabel: 'Entry Type',
    entryTypeValue: 'Annual Maintenance',
    timestampLabel: 'Timestamp',
    healthScoreLabel: 'Health Score',
    findingsLabel: 'Findings',
    verificationLabel: 'Verification',
    verificationValue: 'Notarized at block',
    technicianLabel: 'Technician',
    rewardContractLabel: 'Reward contract',
    rewardDistributedLabel: 'Reward Distributed',
  },
};

export const TUTORIAL_STEP_1 = {
  content: {
    title: 'Meet the Product',
    description: '<p>This e-bike battery is the product we will track throughout the demo. Its Digital Product Passport was created by EcoBike, and every service event or reward you add later will link back to this single on-chain identity.</p>',
    imageAlt: 'Meet the Product',
  },
  asset: {
    imageSrc: '/assets/steps/step_1.webp',
  },
}

export const TUTORIAL_STEP_2 = {
  content: {
    title: 'Product Details',
    description: '<p>Here you can review the product details that the manufacturer initially attached to the passport, including production facts, key attributes, and the bill of materials. The DPP ID is this battery\'s unique identifier on the IOTA network. Follow the link to open the <strong>IOTA Explorer</strong> and view the on-chain record and metadata in full. Thanks to IOTA\'s core characteristics and <strong>IOTA Notarization</strong>, this information is immutably stored and accessible to everyone.</p>',
    imageAlt: 'Product Details',
  },
  asset: {
    imageSrc: '/assets/steps/step_2.webp',
  }
}

export const TUTORIAL_STEP_3 = {
  content: {
    title: 'Manufacturer Identity',
    description: '<p>EcoBike is the legal entity that produced this battery and is responsible for its Digital Product Passport. EcoBike represents itself via an <strong>IOTA Identity</strong> called a Decentralized Identifier (DID) on the IOTA network.</p></br><p>The green checkmark indicates that EcoBike\'s DID is <strong>domain-linked</strong>, meaning its digital identity has been cryptographically verified to match its official website domain — proving that this identity truly belongs to the <strong>legitimate manufacturer</strong>.</p>',
    imageAlt: 'Manufacturer Identity',
  },
  asset: {
    imageSrc: '/assets/steps/step_3.webp',
  },
}

export const TUTORIAL_STEP_4 = {
  content: {
    title: 'Service Network',
    description: '<p>For products that can move freely across this planet, a manufacturer needs a reliable way to let trusted repairers and recyclers add information to the passport. EcoBike solves this by keeping an on-chain Service Network via <strong>IOTA Hierarchies</strong>. Only trusted actors on that list are eligible to write to the passport. Your address - the Technician - isn\'t on that list yet, but you\'ll request access throughout this demo.</p>',
    imageAlt: 'Service Network',
  },
  asset: {
    imageSrc: '/assets/steps/step_4.webp',
  },
}

export const TUTORIAL_STEP_5 = {
  content: {
    title: 'Reward Pool',
    description: '<p>A major challenge in building useful DPPs is motivating actors to participate in this circular economy. Why should a service technician document their actions? Why should an owner bring the product to a certified recycler?<br><br>EcoBike solves this with a pre-funded reward pool using <strong>IOTA Tokenization</strong>. Each verified service or recycling event automatically triggers a token reward through transparent smart contract logic. This creates direct economic incentives for proper product care throughout the entire lifecycle.</p>',
    imageAlt: 'Reward Pool',
  },
  asset: {
    imageSrc: '/assets/steps/step_5.webp',
  },
}

export const TUTORIAL_STEP_6 = {
  content: {
    title: 'Reward Transactions',
    description: '<p>Each time a certified technician performs a verified action like an annual health check, the DPP triggers an automated reward token payout. Each payout is recorded immutably on the IOTA ledger and can be verified publicly via the <strong>IOTA Explorer</strong>. This ensures transparency, traceability, and accountability for every reward that gets distributed.</p>',
    imageAlt: 'Reward Transactions',
  },
  asset: {
    imageSrc: '/assets/steps/step_6.webp',
  },
}

export const TUTORIAL_STEP_7 = {
  content: {
    title: 'Service History',
    description: '<p>Every entry in this timeline reflects a real action, such as a maintenance check or component replacement, performed by a certified actor. The data is digitally signed, timestamped, and immutably anchored on the IOTA network using <strong>IOTA Notarization</strong>.<br><br>This creates a tamper-proof audit trail that regulators, manufacturers, and future owners can rely on to verify that the product was properly maintained throughout its lifecycle.</p>',
    imageAlt: 'Service History',
  },
  asset: {
    imageSrc: '/assets/steps/step_7.webp',
  },
}

export const TUTORIAL_STEP_8 = {
  content: {
    title: 'Explore Mode',
    description: '<p>You\'ve now been guided through each section of the Digital Product Passport and seen how different IOTA components contribute to it.<br><br>Take a moment to explore freely: scroll through the full DPP, review product details, inspect service records, and follow any links to the <strong>IOTA Explorer</strong> for a deeper look at on-chain data.<br><br>When you\'re ready, continue to the next step to connect your wallet and begin interacting with the system as a certified technician.</p>',
    imageAlt: 'Explore Mode',
  },
  asset: {
    imageSrc: '/assets/steps/step_8.webp',
  },
}

export const TUTORIAL_STEP_9 = {
  content: {
    title: 'Connect Wallet',
    description: '<p>In order to let the DPP application know who you are, you now need to connect your wallet. This lets the system recognize your identity and determine which actions you\'re allowed to perform.<br><br>On the desktop, use the <strong>IOTA Browser Wallet</strong> extension. On mobile, use the Nightly app.<br><br>Don\'t worry, you don\'t need to hold IOTA or any other tokens. The wallet simply proves who you are and lets you sign messages and transactions when needed.<br><br>Once connected, you\'ll be able to request access and start interacting with the product\'s Digital Product Passport.</p>',
    imageAlt: 'Connect Wallet',
  },
  asset: {
    imageSrc: '/assets/steps/step_9.webp',
  },
}

export const TUTORIAL_STEP_10 = {
  content: {
    title: 'Request Access',
    description: '<p>Earlier, you learned that EcoBike maintains a trusted Service Network through <strong>IOTA Hierarchies</strong>. Only certified technicians in that list are allowed to add information to the Digital Product Passport.<br><br>Now that your wallet is connected, you can request to join. Clicking the button simulates how a technician contacts the manufacturer through one of the channels defined in EcoBike\'s <strong>IOTA Identity</strong>.<br><br>If approved, you will be able to add verified service records to the passport.</p>',
    imageAlt: 'Request Access',
  },
  asset: {
    imageSrc: '/assets/steps/step_10.webp',
  },
}

export const TUTORIAL_STEP_11 = {
  content: {
    title: 'Start Diagnostic',
    description: '<p>You\'ve been approved as a trusted technician! EcoBike has added your wallet address to their Service Network through <strong>IOTA Hierarchies</strong>.<br><br>Now you can simulate running a diagnostic and writing a health snapshot to the passport. Your service record will become part of the product\'s permanent, verifiable history.</p>',
    imageAlt: 'Start Diagnostic',
  },
  asset: {
    imageSrc: '/assets/steps/step_11.webp',
  },
}

export const TUTORIAL_STEP_12 = {
  content: {
    title: 'View New History Entry',
    description: '<p>Your health snapshot has been written to the IOTA network — immutably and verifiably. You didn\'t need to pay fees or hold tokens. The <strong>IOTA Gas Station</strong> sponsored your transaction in the background, ensuring a smooth experience.<br><br>Your entry is now part of the product\'s permanent service history, visible to all future owners and stakeholders.</p>',
    imageAlt: 'View New History Entry',
  },
  asset: {
    imageSrc: '/assets/steps/step_12.webp',
  },
}

export const TUTORIAL_STEP_13 = {
  content: {
    title: 'View Reward Information',
    description: '<p>Congratulations! Your verified service action has triggered an automated reward payout from EcoBike\'s reward pool.<br><br>The smart contract logic recognized your certified maintenance work and released tokens accordingly. Look at the reward contract and reward distributed entries in the service history below - these show the on-chain reward transaction details.<br><br>This reward can later be redeemed through an Extended Producer Responsibility Organization (EPRO) for real-world value. This incentive system encourages proper product care throughout the entire lifecycle.</p>',
    imageAlt: 'View Reward Information',
  },
  asset: {
    imageSrc: '/assets/steps/step_13.webp',
  },
}

