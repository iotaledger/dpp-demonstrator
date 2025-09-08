import type { Meta, StoryObj } from '@storybook/react';
import FeatureCard from '../components/FeatureCard';

const meta: Meta<typeof FeatureCard> = {
  title: 'Building Blocks/Enhanced/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile card component with 6 variants (default, product, notice, service, resource, explore) and multiple layout options. Features clickable URLs, animations, and responsive design.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'product', 'notice', 'service', 'resource', 'explore'],
      description: 'Card variant style'
    },
    layout: {
      control: 'select',
      options: ['default', 'horizontal', 'compact'],
      description: 'Card layout style'
    },
    titleWeight: {
      control: 'select',
      options: ['normal', 'semibold', 'bold'],
      description: 'Title font weight'
    },
    opacity: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Card opacity (0-100)'
    },
    delay: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
      description: 'Animation delay in seconds'
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default variant stories
export const Default: Story = {
  args: {
    variant: 'default',
    image: '/assets/intro/slide_1_service.webp',
    alt: 'Default feature card example',
    title: 'Step into the role of a Service Technician',
    description: 'Follow an e-bike battery along a part of its life cycle and learn about digital product passports.',
    opacity: 100,
    delay: 0
  },
};

export const Product: Story = {
  args: {
    variant: 'product',
    image: '/assets/products/identity.png',
    alt: 'IOTA Identity product',
    title: 'IOTA Identity',
    description: 'Decentralized identity framework for secure digital interactions',
    opacity: 100,
    delay: 0
  },
};

export const Notice: Story = {
  args: {
    variant: 'notice',
    title: 'Important Notice',
    description: 'This is a notice card variant for highlighting important information or alerts.',
    opacity: 100,
    delay: 0
  },
};

// New variant stories
export const Service: Story = {
  args: {
    variant: 'service',
    image: '/assets/icons/bridge.svg',
    alt: 'Service icon',
    title: 'Bridge Service',
    description: 'Cross-chain bridging service for seamless asset transfers',
    opacity: 100,
    delay: 0
  },
};

export const Resource: Story = {
  args: {
    variant: 'resource',
    image: '/assets/recap/docs.webp',
    alt: 'Documentation resource',
    title: 'Developer Documentation',
    description: 'Comprehensive guides and API documentation for IOTA development',
    url: 'https://docs.iota.org',
    opacity: 100,
    delay: 0
  },
};

export const Explore: Story = {
  args: {
    variant: 'explore',
    image: '/assets/icons/explorer.svg',
    alt: 'IOTA Explorer',
    title: 'IOTA Explorer',
    description: 'Explore transactions, addresses, and network statistics',
    url: 'https://explorer.iota.org',
    opacity: 100,
    delay: 0
  },
};

// Layout variant stories
export const HorizontalLayout: Story = {
  args: {
    variant: 'default',
    layout: 'horizontal',
    image: '/assets/intro/lifecycle.webp',
    alt: 'Horizontal layout example',
    title: 'Horizontal Card Layout',
    description: 'This card uses the horizontal layout option for side-by-side content arrangement.',
    opacity: 100,
    delay: 0
  },
};

export const CompactLayout: Story = {
  args: {
    variant: 'product',
    layout: 'compact',
    image: '/assets/icons/wallet.svg',
    alt: 'Compact layout example',
    title: 'Compact Card',
    description: 'Compact layout for space-efficient display',
    opacity: 100,
    delay: 0
  },
};

// Animation showcase
export const WithAnimation: Story = {
  args: {
    variant: 'service',
    image: '/assets/icons/gas_station.svg',
    alt: 'Animated card',
    title: 'Animated Entry',
    description: 'This card demonstrates the animation capabilities with custom delay and opacity.',
    opacity: 0,
    delay: 1,
    translateY: 20
  },
};

// Interactive clickable card
export const ClickableCard: Story = {
  args: {
    variant: 'resource',
    image: '/assets/recap/grants.webp',
    alt: 'Clickable card example',
    title: 'IOTA Grants Program',
    description: 'Apply for funding to build on the IOTA ecosystem. Click to learn more.',
    url: 'https://github.com/iotaledger/grants',
    opacity: 100,
    delay: 0
  },
};
