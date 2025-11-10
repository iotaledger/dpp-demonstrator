import i18n from "@/i18n";
const t = i18n.t;

export const EXPLORE_FREELY_NAVIGATION = {
  content: {
    backText: t('↺ Reset to Intro'),
    linkText: t('Switch to Guided Tour'),
  },
  navigation: {
    backUrl: '/introduction/1',
    linkUrl: '/explore-guided',
  },
};

export const EXPLORE_GUIDED_NAVIGATION = {
  content: {
    backText: t('↺ Reset to Intro'),
    linkText: t('Switch to free exploration'),
  },
  navigation: {
    backUrl: '/introduction/1',
    linkUrl: '/explore-freely',
  },
};

export const PRODUCT_HEADER = {
  content: {
    productName: t('Product Name'),
    manufacturerName: t('Manufacturer Name'),
  },
};

export const PRODUCT_DETAILS = {
  content: {
    passportDetails: {
      title: t('Product Passport Details'),
      dppIdLabel: t('DPP ID'),
      serialNumberLabel: t('Serial Number'),
      dppCreationDate: t('DPP Creation Date'),
    },
    batteryDetails: {
      title: t('Battery Details'),
      modelLabel: t('Model'),
      manufacturingDateLabel: t('Manufacturing Date'),
      capacityLabel: t('Capacity'),
      expectedLifespanLabel: t('Expected Lifespan'),
      batteryPackLabel: t('Battery Pack'),
    },
    billOfMaterials: {
      title: t('Bill of Materials'),
      cellsLabel: t('Cells'),
      housingLabel: t('Housing'),
      versionLabel: t('Version'),
    },
  },
};

export const ROLE_DETAILS = {
  content: {
    title: t('Role Details'),
    manufacturerLabel: t('Manufacturer'),
    serviceNetworkLabel: t('Service Network'),
    hierarchyBadgeLabel: t('Hierarchy'),
    technicianBadgeLabel: t('Technician'),
  },
};

export const REWARD_POOL = {
  content: {
    title: t('Reward Pool Status'),
    lifecycleCreditTitle: t('Lifecycle Credit (LCC) Rewards'),
    rewardContractLabel: t('Reward contract'),
    totalLifecycleFundLabel: t('Total Lifecycle Fund'),
    totalLifecycleFundValueFallback: t('0 LCC'),
    endOfLifeRewardsLabel: t('End-of-life Rewards'),
    endOfLifeRewardsValueDefault: t('30 LCC'),
    maintenanceRewardsRemainingLabel: t('Maintenance Rewards remaining'),
    rewardTableTitle: t('Reward Table'),
    annualMaintenanceRewardLabel: t('Annual Maintenance Reward'),
    annualMaintenanceRewardValueDefault: t('1 LCC'),
    recyclingRewardLabel: t('Recycling Reward'),
    recyclingRewardValueDefault: t('10 LCC'),
    finalOwnerLabel: t('Final owner'),
    finalOwnerValueDefault: t('10 LCC'),
    manufacturerReturnLabel: t('Manufacturer return'),
    manufacturerReturnValueDefault: t('10 LCC'),
  },
};

export const REWARD_TRANSACTIONS = {
  content: {
    title: t('Rewards transactions'),
    subtitle: t('List of all rewards transactions'),
    healthSnapshotEventName: t('Health Snapshot'),
    serviceIdLabel: t('Service ID'),
    transactionIdLabel: t('Transaction ID'),
    timestampLabel: t('Timestamp'),
    technicianLabel: t('Technician'),
    rewardDistributedLabel: t('Reward Distributed'),
  },
};

export const SERVICE_HISTORY = {
  content: {
    title: t('Service History'),
    subtitle: t('Maintenance and Repairs'),
    healthSnapshotEventName: t('Health Snapshot'),
    eventIdLabel: t('Event ID'),
    entryTypeLabel: t('Entry Type'),
    entryTypeValue: t('Annual Maintenance'),
    timestampLabel: t('Timestamp'),
    healthScoreLabel: t('Health Score'),
    findingsLabel: t('Findings'),
    verificationLabel: t('Verification'),
    verificationValue: t('Notarized at block'),
    technicianLabel: t('Technician'),
    rewardContractLabel: t('Reward contract'),
    rewardDistributedLabel: t('Reward Distributed'),
  },
};

export const TUTORIAL_STEP_1 = {
  content: {
    title: t('Meet the Product'),
    description: t('tutorialStep1.description', '<p>This e-bike battery is the product we will track throughout the demo. Its Digital Product Passport was created by EcoBike, and every service event or reward you add later will link back to this single on-chain identity.</p>'),
    imageAlt: t('Meet the Product'),
  },
  asset: {
    imageSrc: '/assets/steps/step_1.webp',
  },
}

export const TUTORIAL_STEP_2 = {
  content: {
    title: t('Product Details'),
    description: t('tutorialStep2.description', '<p>Here you can review the product details that the manufacturer initially attached to the passport, including production facts, key attributes, and the bill of materials. The DPP ID is this battery\'s unique identifier on the IOTA network. Follow the link to open the <strong>IOTA Explorer</strong> and view the on-chain record and metadata in full. Thanks to IOTA\'s core characteristics and <strong>IOTA Notarization</strong>, this information is immutably stored and accessible to everyone.</p>'),
    imageAlt: t('Product Details'),
  },
  asset: {
    imageSrc: '/assets/steps/step_2.webp',
  }
}

export const TUTORIAL_STEP_3 = {
  content: {
    title: t('Manufacturer Identity'),
    description: t('tutorialStep3.description', '<p>EcoBike is the legal entity that produced this battery and is responsible for its Digital Product Passport. EcoBike represents itself via an <strong>IOTA Identity</strong> called a Decentralized Identifier (DID) on the IOTA network.</p></br><p>The green checkmark indicates that EcoBike\'s DID is <strong>domain-linked</strong>, meaning its digital identity has been cryptographically verified to match its official website domain — proving that this identity truly belongs to the <strong>legitimate manufacturer</strong>.</p>'),
    imageAlt: t('Manufacturer Identity'),
  },
  asset: {
    imageSrc: '/assets/steps/step_3.webp',
  },
}

export const TUTORIAL_STEP_4 = {
  content: {
    title: t('Service Network'),
    description: t('tutorialStep4.description', '<p>For products that can move freely across this planet, a manufacturer needs a reliable way to let trusted repairers and recyclers add information to the passport. EcoBike solves this by keeping an on-chain Service Network via <strong>IOTA Hierarchies</strong>. Only trusted actors on that list are eligible to write to the passport. Your address - the Technician - isn\'t on that list yet, but you\'ll request access throughout this demo.</p>'),
    imageAlt: t('Service Network'),
  },
  asset: {
    imageSrc: '/assets/steps/step_4.webp',
  },
}

export const TUTORIAL_STEP_5 = {
  content: {
    title: t('Reward Pool'),
    description: t('tutorialStep5.description', '<p>A major challenge in building useful DPPs is motivating actors to participate in this circular economy. Why should a service technician document their actions? Why should an owner bring the product to a certified recycler?<br><br>EcoBike solves this with a pre-funded reward pool using <strong>IOTA Tokenization</strong>. Each verified service or recycling event automatically triggers a token reward through transparent smart contract logic. This creates direct economic incentives for proper product care throughout the entire lifecycle.</p>'),
    imageAlt: t('Reward Pool'),
  },
  asset: {
    imageSrc: '/assets/steps/step_5.webp',
  },
}

export const TUTORIAL_STEP_6 = {
  content: {
    title: t('Reward Transactions'),
    description: t('tutorialStep6.description', '<p>Each time a certified technician performs a verified action like an annual health check, the DPP triggers an automated reward token payout. Each payout is recorded immutably on the IOTA ledger and can be verified publicly via the <strong>IOTA Explorer</strong>. This ensures transparency, traceability, and accountability for every reward that gets distributed.</p>'),
    imageAlt: t('Reward Transactions'),
  },
  asset: {
    imageSrc: '/assets/steps/step_6.webp',
  },
}

export const TUTORIAL_STEP_7 = {
  content: {
    title: t('Service History'),
    description: t('tutorialStep7.description', '<p>Every entry in this timeline reflects a real action, such as a maintenance check or component replacement, performed by a certified actor. The data is digitally signed, timestamped, and immutably anchored on the IOTA network using <strong>IOTA Notarization</strong>.<br><br>This creates a tamper-proof audit trail that regulators, manufacturers, and future owners can rely on to verify that the product was properly maintained throughout its lifecycle.</p>'),
    imageAlt: t('Service History'),
  },
  asset: {
    imageSrc: '/assets/steps/step_7.webp',
  },
}

export const TUTORIAL_STEP_8 = {
  content: {
    title: t('Explore Mode'),
    description: t('tutorialStep8.description', '<p>You\'ve now been guided through each section of the Digital Product Passport and seen how different IOTA components contribute to it.<br><br>Take a moment to explore freely: scroll through the full DPP, review product details, inspect service records, and follow any links to the <strong>IOTA Explorer</strong> for a deeper look at on-chain data.<br><br>When you\'re ready, continue to the next step to connect your wallet and begin interacting with the system as a certified technician.</p>'),
    imageAlt: t('Explore Mode'),
  },
  asset: {
    imageSrc: '/assets/steps/step_8.webp',
  },
}

export const TUTORIAL_STEP_9 = {
  content: {
    title: t('Connect Wallet'),
    description: t('tutorialStep9.description', '<p>In order to let the DPP application know who you are, you now need to connect your wallet. This lets the system recognize your identity and determine which actions you\'re allowed to perform.<br><br>On the desktop, use the <strong>IOTA Browser Wallet</strong> extension. On mobile, use the Nightly app.<br><br>Don\'t worry, you don\'t need to hold IOTA or any other tokens. The wallet simply proves who you are and lets you sign messages and transactions when needed.<br><br>Once connected, you\'ll be able to request access and start interacting with the product\'s Digital Product Passport.</p>'),
    imageAlt: t('Connect Wallet'),
  },
  asset: {
    imageSrc: '/assets/steps/step_9.webp',
  },
}

export const TUTORIAL_STEP_10 = {
  content: {
    title: t('Request Access'),
    description: t('tutorialStep10.description', '<p>Earlier, you learned that EcoBike maintains a trusted Service Network through <strong>IOTA Hierarchies</strong>. Only certified technicians in that list are allowed to add information to the Digital Product Passport.<br><br>Now that your wallet is connected, you can request to join. Clicking the button simulates how a technician contacts the manufacturer through one of the channels defined in EcoBike\'s <strong>IOTA Identity</strong>.<br><br>If approved, you will be able to add verified service records to the passport.</p>'),
    imageAlt: t('Request Access'),
  },
  asset: {
    imageSrc: '/assets/steps/step_10.webp',
  },
}

export const TUTORIAL_STEP_11 = {
  content: {
    title: t('Start Diagnostic'),
    description: t('tutorialStep11.description', '<p>You\'ve been approved as a trusted technician! EcoBike has added your wallet address to their Service Network through <strong>IOTA Hierarchies</strong>.<br><br>Now you can simulate running a diagnostic and writing a health snapshot to the passport. Your service record will become part of the product\'s permanent, verifiable history.</p>'),
    imageAlt: t('Start Diagnostic'),
  },
  asset: {
    imageSrc: '/assets/steps/step_11.webp',
  },
}

export const TUTORIAL_STEP_12 = {
  content: {
    title: t('View New History Entry'),
    description: t('tutorialStep12.description', '<p>Your health snapshot has been written to the IOTA network — immutably and verifiably. You didn\'t need to pay fees or hold tokens. The <strong>IOTA Gas Station</strong> sponsored your transaction in the background, ensuring a smooth experience.<br><br>Your entry is now part of the product\'s permanent service history, visible to all future owners and stakeholders.</p>'),
    imageAlt: t('View New History Entry'),
  },
  asset: {
    imageSrc: '/assets/steps/step_12.webp',
  },
}

export const TUTORIAL_STEP_13 = {
  content: {
    title: t('View Reward Information'),
    description: t('tutorialStep13.description', '<p>Congratulations! Your verified service action has triggered an automated reward payout from EcoBike\'s reward pool.<br><br>The smart contract logic recognized your certified maintenance work and released tokens accordingly. Look at the reward contract and reward distributed entries in the service history below - these show the on-chain reward transaction details.<br><br>This reward can later be redeemed through an Extended Producer Responsibility Organization (EPRO) for real-world value. This incentive system encourages proper product care throughout the entire lifecycle.</p>'),
    imageAlt: t('View Reward Information'),
  },
  asset: {
    imageSrc: '/assets/steps/step_13.webp',
  },
}

