import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ProductHeaderCard from '../components/ProductHeaderCard';

const meta: Meta<typeof ProductHeaderCard> = {
  title: 'Building Blocks/Composite/ProductHeaderCard',
  component: ProductHeaderCard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A product header card component that displays product image, name, and manufacturer. Designed for use in the GuidedExploration dpp-content-container. Supports tutorial state management and animations.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    cardState: {
      control: 'select',
      options: ['default', 'muted'],
      description: 'Card state for tutorial integration'
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

export const Default: Story = {
  args: {
    productImage: '/assets/product.webp',
    productImageAlt: 'Pro 48V Battery',
    productName: 'Pro 48V Battery',
    manufacturerName: 'EcoBike',
    opacity: 100,
    delay: 0,
    cardState: 'default'
  },
};

export const TutorialMuted: Story = {
  args: {
    productImage: '/assets/product.webp',
    productImageAlt: 'Pro 48V Battery',
    productName: 'Pro 48V Battery',
    manufacturerName: 'EcoBike',
    opacity: 100,
    delay: 0,
    cardState: 'muted'
  },
};

export const CustomProduct: Story = {
  args: {
    productImage: '/assets/product.webp',
    productImageAlt: 'Electric Vehicle Battery',
    productName: 'EV Pro Max 72V',
    manufacturerName: 'GreenTech Industries',
    opacity: 100,
    delay: 0,
    cardState: 'default'
  },
};

export const WithAnimation: Story = {
  args: {
    productImage: '/assets/product.webp',
    productImageAlt: 'Pro 48V Battery',
    productName: 'Pro 48V Battery',
    manufacturerName: 'EcoBike',
    opacity: 0,
    delay: 1,
    cardState: 'default'
  },
};