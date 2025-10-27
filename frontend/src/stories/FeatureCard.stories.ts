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
    title: 'Step into the role of a Service Technician',
    description: 'Follow an e-bike battery along a part of its life cycle and learn about digital product passports.',
    opacity: 100,
    delay: 0
  },
};
