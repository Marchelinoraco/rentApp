import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '@/App';
import { useAppStore } from '@/store/useAppStore';

describe('VehiclesPage integration', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/vehicles');
    useAppStore.setState({
      filters: {},
      sortOption: { field: 'name', order: 'asc' },
    });
  });

  it('filters vehicle cards by category', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /filter kategori suv/i }));

    expect(useAppStore.getState().filters).toEqual({ category: ['suv'] });

    await waitFor(() => {
      expect(screen.getByText('Fortuner TRD/GR')).toBeInTheDocument();
      expect(screen.getByText('Pajero Sport')).toBeInTheDocument();
      expect(screen.getByText('Rush G')).toBeInTheDocument();
    });

    expect(screen.queryByText('Alphard')).not.toBeInTheDocument();
    expect(screen.queryByText('New Livina VL')).not.toBeInTheDocument();
  });

  it('filters vehicle cards by search query', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('textbox', { name: /cari kendaraan/i }), 'fortuner');

    await waitFor(() => {
      expect(useAppStore.getState().filters).toEqual({ searchQuery: 'fortuner' });
    });

    await waitFor(() => {
      expect(screen.getByText('Fortuner TRD/GR')).toBeInTheDocument();
    });

    expect(screen.queryByText('Alphard')).not.toBeInTheDocument();
    expect(screen.queryByText('New Agya')).not.toBeInTheDocument();
  });
});
