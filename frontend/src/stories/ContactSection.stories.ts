import type { Meta, StoryObj } from '@storybook/react';
import ContactSection from '../components/ContactSection';

const meta: Meta<typeof ContactSection> = {
  title: 'Building Blocks/Atomic/ContactSection',
  component: ContactSection,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An email contact component with copy-to-clipboard functionality. Features a copy button with visual feedback and customizable styling.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    opacity: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Component opacity (0-100)'
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
    title: 'Want to get in touch?',
    email: 'contact@iota.org',
    emailLabel: 'contact@iota.org',
    opacity: 100,
    delay: 0
  },
};

export const BusinessContact: Story = {
  args: {
    title: 'Business Inquiries',
    email: 'business@iota.org',
    emailLabel: 'business@iota.org',
    opacity: 100,
    delay: 0
  },
};

export const SupportContact: Story = {
  args: {
    title: 'Need technical support?',
    email: 'support@iota.org',
    emailLabel: 'Get Support',
    opacity: 100,
    delay: 0
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Questions about grants?',
    email: 'grants@iota.org',
    emailLabel: 'grants@iota.org',
    opacity: 100,
    delay: 0
  },
};

export const WithAnimation: Story = {
  args: {
    title: 'Animated Contact Section',
    email: 'hello@iota.org',
    emailLabel: 'hello@iota.org',
    opacity: 0,
    delay: 0.8
  },
};
