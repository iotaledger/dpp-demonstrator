import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ProductHeaderCard from '../components/ProductHeaderCard';

const meta: Meta<typeof ProductHeaderCard> = {
  title: 'Building Blocks/Composite/ProductHeaderCard',
  component: ProductHeaderCard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A product header card component that displays product image, name, and manufacturer. Designed for use in the GuidedExploration dpp-content-container. Supports tutorial state management and animations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tutorialState: {
      control: 'select',
      options: ['no', 'muted', 'selected'],
      description: 'Card state for tutorial',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tutorialState: 'no',
  },
};
