import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ServiceRequestCard from '../components/ServiceRequestCard';

const meta: Meta<typeof ServiceRequestCard> = {
  title: 'Building Blocks/Composite/ServiceRequestCard',
  component: ServiceRequestCard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A service request action card component that prompts users to request access to service networks. Features tutorial state management, customizable content, and integrated action button with ID for tutorial interaction.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    cardState: {
      control: 'select',
      options: ['normal', 'muted', 'highlighted'],
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
    title: 'Request Service Network Access',
    description: 'To add information to this Digital Product Passport, you must be certified by EcoBike through their Service Network. Click below to request access as a trusted technician.',
    buttonText: 'Service Network Request',
    buttonId: 'tutorial-request-button',
    opacity: 100,
    delay: 0,
    cardState: 'normal',
    onButtonClick: () => alert('Service Network Request clicked!')
  },
};

export const TutorialMuted: Story = {
  args: {
    title: 'Request Service Network Access',
    description: 'To add information to this Digital Product Passport, you must be certified by EcoBike through their Service Network. Click below to request access as a trusted technician.',
    buttonText: 'Service Network Request',
    buttonId: 'tutorial-request-button',
    opacity: 100,
    delay: 0,
    cardState: 'muted',
    onButtonClick: () => alert('Service Network Request clicked!')
  },
};

export const TutorialHighlighted: Story = {
  args: {
    title: 'Request Service Network Access',
    description: 'To add information to this Digital Product Passport, you must be certified by EcoBike through their Service Network. Click below to request access as a trusted technician.',
    buttonText: 'Service Network Request',
    buttonId: 'tutorial-request-button',
    opacity: 100,
    delay: 0,
    cardState: 'highlighted',
    onButtonClick: () => alert('Service Network Request clicked!')
  },
};

export const CustomContent: Story = {
  args: {
    title: 'Request Manufacturing Access',
    description: 'To modify manufacturing data for this product, you need special permissions from the manufacturer. Request access to become a certified manufacturing partner.',
    buttonText: 'Request Manufacturing Access',
    buttonId: 'custom-request-button',
    opacity: 100,
    delay: 0,
    cardState: 'normal',
    onButtonClick: () => alert('Manufacturing access requested!')
  },
};

export const WithAnimation: Story = {
  args: {
    title: 'Request Service Network Access',
    description: 'To add information to this Digital Product Passport, you must be certified by EcoBike through their Service Network. Click below to request access as a trusted technician.',
    buttonText: 'Service Network Request',
    buttonId: 'tutorial-request-button',
    opacity: 0,
    delay: 1,
    cardState: 'normal',
    onButtonClick: () => alert('Service Network Request clicked!')
  },
};