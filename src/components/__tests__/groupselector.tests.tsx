import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import GroupSelectoriOS from '../GroupSelector.ios';
import GroupSelectorAndroid from '../GroupSelector.android';

describe('GroupSelector component', () => {
  describe('GroupSelector Android', () => {
    it('renders the current ticket size', () => {
      const props = {
        currentValue: 0.5,
        values: [0.5, 1.0, 2.5],
        onValueChange: jest.fn(),
      };

      const { getByText } = render(<GroupSelectorAndroid {...props} />);
      expect(getByText('Group 0.5')).toBeTruthy();
    });

    it('renders the picker component', () => {
      const props = {
        currentValue: 0.5,
        values: [0.5, 1.0, 2.5],
        onValueChange: jest.fn(),
      };

      const { getByTestId } = render(<GroupSelectorAndroid {...props} />);
      expect(getByTestId('picker')).toBeTruthy();
    });
  });
  describe('GroupSelector iOS', () => {
    it('renders a button with the current ticket size', () => {
      const props = {
        currentValue: 0.5,
        values: [0.5, 1.0, 2.5],
        onValueChange: jest.fn(),
      };

      const { getByText } = render(<GroupSelectoriOS {...props} />);
      expect(getByText('Group 0.5')).toBeTruthy();
    });

    it('displays a modal to select the ticket size when pressing the button', async () => {
      const props = {
        currentValue: 0.5,
        values: [0.5, 1.0, 2.5],
        onValueChange: jest.fn(),
      };

      const { getByText, queryByText, getByTestId } = render(
        <GroupSelectoriOS {...props} />,
      );
      const button = getByText('Group 0.5');
      fireEvent.press(button);

      await waitFor(() =>
        expect(queryByText('Select ticket size:')).toBeTruthy(),
      );

      expect(getByTestId('picker')).toBeTruthy();
      expect(getByText('OK')).toBeTruthy();
    });
  });
});
