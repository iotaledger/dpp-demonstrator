import type { Meta, StoryObj } from '@storybook/react';
import CheckmarkList from '../components/CheckmarkList';

const meta: Meta<typeof CheckmarkList> = {
  title: 'Building Blocks/Atomic/CheckmarkList',
  component: CheckmarkList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A list component that displays achievement items with animated blue checkmarks. Perfect for showcasing completed tasks or user accomplishments.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    opacity: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'List opacity (0-100)'
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
    items: [
      'Explored the concept of Digital Product Passports',
      'Learned about IOTA\'s Trust Framework',
      'Understood the role of Service Technicians',
      'Discovered reward mechanisms for circularity',
      'Saw how different stakeholders benefit from transparency'
    ],
    opacity: 100,
    delay: 0
  },
};

export const ShortList: Story = {
  args: {
    items: [
      'Completed the tutorial',
      'Connected your wallet',
      'Earned your first reward'
    ],
    opacity: 100,
    delay: 0
  },
};

export const TechnicalAchievements: Story = {
  args: {
    items: [
      'Integrated IOTA Identity for authentication',
      'Implemented reward distribution mechanism',
      'Connected to IOTA Mainnet',
      'Set up transaction monitoring',
      'Configured service validation rules'
    ],
    opacity: 100,
    delay: 0.2
  },
};

export const WithAnimation: Story = {
  args: {
    items: [
      'Item appears with delay',
      'Animation timing can be customized',
      'Opacity transitions smoothly'
    ],
    opacity: 0,
    delay: 1
  },
};
