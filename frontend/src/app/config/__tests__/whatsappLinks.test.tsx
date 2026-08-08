import { afterAll, beforeAll, describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WHATSAPP_URL } from '../constants';
import { WhatsAppButton } from '../../features/shared/components/feedback/WhatsAppButton';
import { Navbar } from '../../features/shared/components/layout/Navbar';
import { Footer } from '../../features/shared/components/layout/Footer';
import { ContactView } from '../../features/inquiries/components/ContactView';

// ---------------------------------------------------------------------------
// Mock useApp so layout/view components render without the full provider tree.
// ---------------------------------------------------------------------------
const { mockUseApp } = vi.hoisted(() => ({ mockUseApp: vi.fn() }));

vi.mock('../../core/providers/AppProvider', () => ({
  useApp: () => mockUseApp(),
}));

// jsdom lacks the browser observers used by motion's whileInView.
class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

beforeAll(() => {
  vi.stubGlobal('IntersectionObserver', MockObserver);
  vi.stubGlobal('ResizeObserver', MockObserver);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

function makeAppContext() {
  return {
    currentRoute: 'home',
    navigate: vi.fn(),
    packages: [],
    hotels: [],
    festivals: [],
    brochures: [],
    videos: [],
    gallery: [],
    setActiveBrochure: vi.fn(),
    setActivePackage: vi.fn(),
    setActiveHotel: vi.fn(),
    submitInquiry: vi.fn(),
    showToast: vi.fn(),
  };
}

beforeEach(() => {
  mockUseApp.mockReturnValue(makeAppContext());
});

// Shared assertions for every WhatsApp CTA.
function expectWhatsAppLink(link: HTMLAnchorElement) {
  expect(link.href).toBe(WHATSAPP_URL);
  expect(link.href).toMatch(/^https:\/\/api\.whatsapp\.com\/send\/\?phone=97517377777/);
  expect(link.target).toBe('_blank');
  expect(link.rel).toBe('noopener noreferrer');
}

describe('WhatsApp CTAs', () => {
  it('the shared WHATSAPP_URL constant targets the company number', () => {
    expect(WHATSAPP_URL).toMatch(/^https:\/\/api\.whatsapp\.com\/send\/\?phone=97517377777/);
    expect(WHATSAPP_URL).toContain('text=');
  });

  it('floating WhatsAppButton opens the chat link in a new tab', () => {
    render(<WhatsAppButton />);
    expectWhatsAppLink(screen.getByRole('link', { name: /chat with us/i }) as HTMLAnchorElement);
  });

  it('mobile-drawer WhatsApp Us link in the Navbar opens the chat link in a new tab', () => {
    render(<Navbar />);

    // The WhatsApp link lives inside the mobile drawer; open it first.
    fireEvent.click(screen.getByRole('button', { name: /toggle navigation menu/i }));

    expectWhatsAppLink(screen.getByRole('link', { name: /whatsapp us/i }) as HTMLAnchorElement);
  });

  it('Footer WhatsApp Us link opens the chat link in a new tab', () => {
    render(<Footer />);
    expectWhatsAppLink(screen.getByRole('link', { name: /whatsapp us/i }) as HTMLAnchorElement);
  });

  it('ContactView "Contact via WhatsApp" button opens the chat link in a new tab', () => {
    render(<ContactView />);
    expectWhatsAppLink(screen.getByRole('link', { name: /contact via whatsapp/i }) as HTMLAnchorElement);
  });
});
