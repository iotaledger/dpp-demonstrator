/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ServiceRequestCard from '../components/ServiceRequestCard';

const meta: Meta<typeof ServiceRequestCard> = {
  title: 'Building Blocks/Composite/ServiceRequestCard',
  component: ServiceRequestCard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A service request action card component that prompts users to request access to service networks. Features tutorial state management, customizable content, and integrated action button with ID for tutorial interaction.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    cardState: {
      control: 'select',
      options: ['normal', 'muted', 'highlighted'],
      description: 'Card state for tutorial integration',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cardState: 'normal',
  },
};

export const TutorialMuted: Story = {
  args: {
    cardState: 'muted',
  },
};

export const TutorialHighlighted: Story = {
  args: {
    cardState: 'highlighted',
  },
};

export const CustomContent: Story = {
  args: {
    cardState: 'normal',
  },
};

export const WithAnimation: Story = {
  args: {
    cardState: 'normal',
  },
};
