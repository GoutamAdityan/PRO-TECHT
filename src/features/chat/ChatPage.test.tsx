
// src/features/chat/ChatPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChatPage from './ChatPage';
import * as realtime from './realtime';

// Mock the realtime module
vi.mock('./realtime', () => ({
  fetchConversations: vi.fn(() =>
    Promise.resolve([
      {
        id: 'cust1',
        name: 'Alice Smith',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Hi',
        timestamp: '2025-10-10T10:00:00Z',
        unreadCount: 0,
        isOnline: true,
      },
      {
        id: 'cust2',
        name: 'Bob Johnson',
        avatar: 'https://i.pravatar.cc/150?img=2',
        lastMessage: 'Hello',
        timestamp: '2025-10-09T15:30:00Z',
        unreadCount: 0,
        isOnline: false,
      },
    ])
  ),
  fetchMessages: vi.fn((customerId) =>
    Promise.resolve(
      customerId === 'cust1'
        ? [
            { id: 'msg1', sender: 'customer', content: 'Hi', timestamp: '2025-10-10T09:50:00Z', read: true },
            { id: 'msg2', sender: 'agent', content: 'Hello', timestamp: '2025-10-10T09:52:00Z', read: true },
          ]
        : []
    )
  ),
  sendMessage: vi.fn(() => Promise.resolve({ id: 'newMsg', sender: 'agent', content: 'Test', timestamp: new Date().toISOString(), read: false })),
  subscribeToConversation: vi.fn(() => () => {}), // Mock unsubscribe
  markMessagesAsRead: vi.fn(() => Promise.resolve()),
}));

describe('ChatPage', () => {
  it('renders customer list and allows selecting a customer', async () => {
    render(<ChatPage />);

    // Check if customers are loaded and displayed
    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    // Select Alice Smith
    fireEvent.click(screen.getByText('Alice Smith'));

    // Check if Alice Smith's conversation is loaded
    await waitFor(() => {
      expect(screen.getByText('Hi')).toBeInTheDocument();
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
      expect(screen.getByText('Alice Smith')).toBeInTheDocument(); // In header
    });

    // Check if message input is focused
    const messageInput = screen.getByPlaceholderText('Type your message...');
    expect(messageInput).toHaveFocus();
  });

  it('sends a message and displays it optimistically', async () => {
    render(<ChatPage />);

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Alice Smith'));

    await waitFor(() => {
      expect(screen.getByText('Hi')).toBeInTheDocument();
    });

    const messageInput = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    // Optimistic UI: message should appear immediately
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Sending...')).toBeInTheDocument();

    // After mock API call resolves, sending indicator should disappear
    await waitFor(() => {
      expect(screen.queryByText('Sending...')).not.toBeInTheDocument();
    });

    // Check if sendMessage was called
    expect(realtime.sendMessage).toHaveBeenCalledWith('cust1', 'Test message');
  });
});
