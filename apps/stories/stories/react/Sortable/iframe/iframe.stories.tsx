import type {Meta, StoryObj} from '@storybook/react';

import {MultipleLists} from './IframeExample.tsx';
import docs from './docs/MultipleLists.mdx';

const meta: Meta<typeof MultipleLists> = {
  title: 'React/Sortable/Iframe',
  component: MultipleLists,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MultipleLists>;

export const IframeExample: Story = {
  name: 'Iframe Example',
  args: {
    debug: false,
    itemCount: 6,
  },
};
