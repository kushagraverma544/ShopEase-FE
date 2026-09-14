import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { store } from '../../../app/store';
import * as productService from '../../../services/productService';
import { Sidebar } from './Sidebar';

vi.mock('../../../services/productService');

function renderSidebar() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </Provider>,
  );
}

describe('Sidebar categories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a retry action when the categories request fails, and recovers on retry', async () => {
    productService.getCategories
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce([{ slug: 'beauty', name: 'Beauty' }]);

    renderSidebar();

    const retryButton = await screen.findByRole('button', { name: /retry/i });

    await userEvent.click(retryButton);

    expect(await screen.findByText('Beauty')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
    expect(productService.getCategories).toHaveBeenCalledTimes(2);
  });
});
