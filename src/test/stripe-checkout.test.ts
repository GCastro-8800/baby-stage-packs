import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock supabase client
const mockInvoke = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: mockInvoke },
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
      getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: "tok" } } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
  },
}));

describe("Stripe Checkout Flow", () => {
  beforeEach(() => {
    mockInvoke.mockReset();
  });

  it("should invoke stripe-checkout with correct cart items and return a URL", async () => {
    const checkoutUrl = "https://checkout.stripe.com/c/pay_test123";
    mockInvoke.mockResolvedValueOnce({ data: { url: checkoutUrl }, error: null });

    const { data, error } = await mockInvoke("stripe-checkout", {
      body: {
        selectedItems: [
          { productId: "bugaboo-fox-3", months: 6 },
          { productId: "stokke-sleepi-mini", months: 6 },
        ],
        durationMonths: 6,
      },
    });

    expect(error).toBeNull();
    expect(data.url).toBe(checkoutUrl);
    expect(mockInvoke).toHaveBeenCalledWith("stripe-checkout", {
      body: {
        selectedItems: [
          { productId: "bugaboo-fox-3", months: 6 },
          { productId: "stokke-sleepi-mini", months: 6 },
        ],
        durationMonths: 6,
      },
    });
  });

  it("should handle checkout errors gracefully", async () => {
    mockInvoke.mockResolvedValueOnce({
      data: null,
      error: { message: "Stripe not configured" },
    });

    const { data, error } = await mockInvoke("stripe-checkout", {
      body: { selectedItems: [{ productId: "bugaboo-fox-3", months: 6 }], durationMonths: 6 },
    });

    expect(data).toBeNull();
    expect(error.message).toBe("Stripe not configured");
  });

  it("should reject invalid product IDs", async () => {
    mockInvoke.mockResolvedValueOnce({
      data: null,
      error: { message: "Unknown product: fake-product" },
    });

    const { error } = await mockInvoke("stripe-checkout", {
      body: { selectedItems: [{ productId: "fake-product", months: 6 }], durationMonths: 6 },
    });

    expect(error).toBeTruthy();
    expect(error.message).toContain("Unknown product");
  });

  it("should reject invalid duration months", async () => {
    mockInvoke.mockResolvedValueOnce({
      data: null,
      error: { message: "Invalid duration" },
    });

    const { error } = await mockInvoke("stripe-checkout", {
      body: { selectedItems: [{ productId: "bugaboo-fox-3", months: 7 }], durationMonths: 7 },
    });

    expect(error).toBeTruthy();
  });
});
