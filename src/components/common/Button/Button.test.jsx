import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders children and responds to clicks', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Add to cart</Button>);

    const button = screen.getByRole('button', { name: 'Add to cart' });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as a different element via the "as" prop', () => {
    render(
      <Button as="a" href="/products">
        View products
      </Button>,
    );

    expect(screen.getByRole('link', { name: 'View products' })).toHaveAttribute(
      'href',
      '/products',
    );
  });
});
