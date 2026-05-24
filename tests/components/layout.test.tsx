import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../../src/components/layout/Header';
import { Footer } from '../../src/components/layout/Footer';
import { Layout } from '../../src/components/layout/Layout';

// Helper to wrap components with Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header Component', () => {
  it('should render logo and brand name', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Rental Mobil')).toBeInTheDocument();
    expect(screen.getByLabelText('Rental Mobil - Beranda')).toBeInTheDocument();
  });

  it('should render all navigation links on desktop', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Kendaraan')).toBeInTheDocument();
    expect(screen.getByText('Booking')).toBeInTheDocument();
    expect(screen.getByText('Testimoni')).toBeInTheDocument();
    expect(screen.getByText('Tentang')).toBeInTheDocument();
    expect(screen.getByText('Kontak')).toBeInTheDocument();
  });

  it('should render mobile menu button', () => {
    renderWithRouter(<Header />);
    const menuButton = screen.getByLabelText('Buka menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('should toggle mobile menu when button is clicked', () => {
    renderWithRouter(<Header />);
    const menuButton = screen.getByLabelText('Buka menu');
    
    // Initially mobile menu should not be visible
    expect(screen.queryByLabelText('Navigasi mobile')).not.toBeInTheDocument();
    
    // Click to open
    fireEvent.click(menuButton);
    expect(screen.getByLabelText('Navigasi mobile')).toBeInTheDocument();
    expect(screen.getByLabelText('Tutup menu')).toBeInTheDocument();
    
    // Click to close
    fireEvent.click(screen.getByLabelText('Tutup menu'));
    expect(screen.queryByLabelText('Navigasi mobile')).not.toBeInTheDocument();
  });

  it('should have proper ARIA labels for accessibility', () => {
    renderWithRouter(<Header />);
    expect(screen.getByLabelText('Navigasi utama')).toBeInTheDocument();
    expect(screen.getByLabelText('Rental Mobil - Beranda')).toBeInTheDocument();
  });

  it('should have minimum 44px touch target for mobile menu button', () => {
    renderWithRouter(<Header />);
    const menuButton = screen.getByLabelText('Buka menu');
    expect(menuButton).toHaveClass('min-h-[44px]');
    expect(menuButton).toHaveClass('min-w-[44px]');
  });
});

describe('Footer Component', () => {
  it('should render brand section', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText('Rental Mobil')).toBeInTheDocument();
    expect(screen.getByText(/Layanan rental mobil terpercaya/)).toBeInTheDocument();
  });

  it('should render contact information', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText('Kontak Kami')).toBeInTheDocument();
    expect(screen.getByText('+62 812-3456-789')).toBeInTheDocument();
    expect(screen.getByText('info@rentalmobil.com')).toBeInTheDocument();
    expect(screen.getByText(/Jl. Contoh No. 123/)).toBeInTheDocument();
  });

  it('should render social media links', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
  });

  it('should render business hours', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText('Jam Operasional')).toBeInTheDocument();
    expect(screen.getByText(/Senin - Jumat: 08:00 - 20:00/)).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText('Navigasi')).toBeInTheDocument();
    const footerLinks = screen.getAllByText('Beranda');
    expect(footerLinks.length).toBeGreaterThan(0);
  });

  it('should render copyright with current year', () => {
    renderWithRouter(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${currentYear} Rental Mobil`))).toBeInTheDocument();
  });

  it('should have minimum 44px touch targets for social media links', () => {
    renderWithRouter(<Footer />);
    const facebookLink = screen.getByLabelText('Facebook');
    expect(facebookLink).toHaveClass('min-h-[44px]');
    expect(facebookLink).toHaveClass('min-w-[44px]');
  });

  it('should have proper external link attributes', () => {
    renderWithRouter(<Footer />);
    const facebookLink = screen.getByLabelText('Facebook');
    expect(facebookLink).toHaveAttribute('target', '_blank');
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

describe('Layout Component', () => {
  it('should render Header, children, and Footer', () => {
    renderWithRouter(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );
    
    // Header should be present (check for navigation)
    expect(screen.getByLabelText('Navigasi utama')).toBeInTheDocument();
    
    // Content should be present
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    
    // Footer should be present
    expect(screen.getByText('Kontak Kami')).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    const { container } = renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    // Should have header, main, and footer elements
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('should apply flex layout for sticky footer', () => {
    const { container } = renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('flex-col');
    expect(wrapper).toHaveClass('min-h-screen');
  });
});
