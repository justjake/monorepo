import { render } from '@testing-library/react';

import PinchZoom from './pinch-zoom';

describe('PinchZoom', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PinchZoom />);
    expect(baseElement).toBeTruthy();
  });
});
