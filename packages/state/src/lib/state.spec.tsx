import { render } from '@testing-library/react';

import State from './state';

describe('State', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<State />);
    expect(baseElement).toBeTruthy();
  });
});
