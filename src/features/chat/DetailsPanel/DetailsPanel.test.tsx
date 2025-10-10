
// src/features/chat/DetailsPanel/DetailsPanel.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DetailsPanel } from './DetailsPanel';
import * as mockDetailsAdapter from './mockDetailsAdapter';

// Mock the useMediaQuery hook
vi.mock('@/hooks/use-mobile', () => ({
  useMediaQuery: vi.fn(() => false), // Default to desktop
}));

// Mock the mockDetailsAdapter module
vi.mock('./mockDetailsAdapter', () => ({
  fetchDetails: vi.fn(() =>
    Promise.resolve({
      product: {
        id: 'prod1',
        name: 'Test Product',
        sku: 'TP-001',
        model: 'TM-1',
        imageUrl: 'https://example.com/product.jpg',
        purchaseDate: '2023-01-01',
        warrantyStatus: 'Active',
        warrantyEndDate: '2025-01-01',
        attachments: [],
      },
      customer: {
        id: 'cust1',
        fullName: 'Test Customer',
        avatarUrl: 'https://example.com/avatar.jpg',
        email: 'test.customer@example.com',
        phone: '+1234567890',
        address: '123 Test St',
        accountCreated: '2022-01-01',
        subscriptionPlan: 'Premium',
        loyaltyPoints: 100,
        lastOrderDate: '2024-01-01',
        verificationStatus: 'Verified',
      },
      queryHistory: [
        {
          id: 'q1',
          timestamp: '2024-01-01T10:00:00Z',
          agentName: 'Agent A',
          tags: ['issue'],
          notes: 'Initial query',
        },
      ],
    })
  ),
  addPrivateNote: vi.fn((conversationId, note, agentName) =>
    Promise.resolve({
      id: `new-note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName,
      tags: ['private note'],
      notes: note,
    })
  ),
}));

describe('DetailsPanel', () => {
  it('renders product name and customer email', async () => {
    render(
      <DetailsPanel open={true} onClose={() => {}} conversationId="cust1" isMobile={false} />
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('test.customer@example.com')).toBeInTheDocument();
    });
  });

  it('adds a private note optimistically and updates UI', async () => {
    render(
      <DetailsPanel open={true} onClose={() => {}} conversationId="cust1" isMobile={false} />
    );

    await waitFor(() => {
      expect(screen.getByText('Initial query')).toBeInTheDocument();
    });

    const noteInput = screen.getByPlaceholderText('Type your private note here...');
    const addButton = screen.getByRole('button', { name: /Add Note/i });

    fireEvent.change(noteInput, { target: { value: 'New private note' } });
    fireEvent.click(addButton);

    // Optimistic update: new note should appear immediately
    await waitFor(() => {
      expect(screen.getByText('New private note')).toBeInTheDocument();
      expect(screen.getByText('private note')).toBeInTheDocument();
    });

    // Verify addPrivateNote was called
    expect(mockDetailsAdapter.addPrivateNote).toHaveBeenCalledWith(
      'cust1',
      'New private note',
      'Current Agent'
    );
  });
});
