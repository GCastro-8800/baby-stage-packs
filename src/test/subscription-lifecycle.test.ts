import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";

// vi.hoisted runs before vi.mock hoisting — safe to reference in factory
const { mockInvoke } = vi.hoisted(() => ({ mockInvoke: vi.fn() }));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: mockInvoke },
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1", email: "test@test.com" } } }),
      getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: "tok" } } }),
      onAuthStateChange: vi.fn((cb: Function) => {
        cb("SIGNED_IN", { access_token: "tok", user: { id: "user-1" } });
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
    },
  },
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-1", email: "test@test.com" },
    session: { access_token: "tok" },
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import { useStripeSubscription } from "@/hooks/useStripeSubscription";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("Subscription Lifecycle", () => {
  beforeEach(() => {
    mockInvoke.mockReset();
  });

  it("should return not subscribed when check-subscription returns false", async () => {
    mockInvoke.mockResolvedValueOnce({
      data: { subscribed: false, subscription_end: null, items: [] },
      error: null,
    });

    const { result } = renderHook(() => useStripeSubscription(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.subscribed).toBe(false);
    expect(result.current.subscriptionEnd).toBeNull();
    expect(result.current.stripeItems).toEqual([]);
  });

  it("should return active subscription with items", async () => {
    const endDate = "2026-07-01T00:00:00Z";
    mockInvoke.mockResolvedValueOnce({
      data: {
        subscribed: true,
        subscription_end: endDate,
        items: [
          { name: "Bugaboo Fox 3", amount: 6000, interval: "month" },
          { name: "Stokke Sleepi Mini", amount: 5100, interval: "month" },
        ],
      },
      error: null,
    });

    const { result } = renderHook(() => useStripeSubscription(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.subscribed).toBe(true);
    expect(result.current.subscriptionEnd).toBe(endDate);
    expect(result.current.stripeItems).toHaveLength(2);
    expect(result.current.stripeItems[0].name).toBe("Bugaboo Fox 3");
  });

  it("should handle check-subscription errors", async () => {
    mockInvoke.mockResolvedValueOnce({
      data: null,
      error: { message: "Network error" },
    });

    const { result } = renderHook(() => useStripeSubscription(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // On error, defaults to not subscribed
    expect(result.current.subscribed).toBe(false);
  });

  it("should call check-subscription edge function", async () => {
    mockInvoke.mockResolvedValueOnce({
      data: { subscribed: false, subscription_end: null, items: [] },
      error: null,
    });

    renderHook(() => useStripeSubscription(), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(mockInvoke).toHaveBeenCalledWith("check-subscription")
    );
  });

  it("should support refetch after subscription change", async () => {
    // First call: not subscribed
    mockInvoke.mockResolvedValueOnce({
      data: { subscribed: false, subscription_end: null, items: [] },
      error: null,
    });

    const { result } = renderHook(() => useStripeSubscription(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.subscribed).toBe(false);

    // Second call after refetch: now subscribed
    mockInvoke.mockResolvedValueOnce({
      data: {
        subscribed: true,
        subscription_end: "2026-12-01T00:00:00Z",
        items: [{ name: "Bugaboo Fox 3", amount: 6000, interval: "month" }],
      },
      error: null,
    });

    await result.current.refetch();

    await waitFor(() => expect(result.current.subscribed).toBe(true));
    expect(result.current.stripeItems).toHaveLength(1);
  });
});
