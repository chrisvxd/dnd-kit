import type {Meta, StoryObj} from '@storybook/react';

import {IframeLists} from './IframeExample.tsx';

const meta: Meta<typeof IframeLists> = {
  title: 'React/Sortable/Iframe',
  component: IframeLists,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IframeLists>;

export const Iframe: Story = {
  name: 'Iframe',
  args: {
    debug: false,
    itemCount: 6,
  },
};

export const IframeTransformed: Story = {
  name: 'IframeTransformed',
  args: {
    debug: false,
    itemCount: 6,
    transform: true,
  },
};
