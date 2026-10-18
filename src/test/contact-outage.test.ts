import { beforeEach, describe, expect, it, vi } from "vitest";

const { from, single, eq, select, update } = vi.hoisted(() => ({
  from: vi.fn(), single: vi.fn(), eq: vi.fn(), select: vi.fn(), update: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from } }));
import { readContactOutage, saveContactOutage } from "@/lib/contact-outage";

beforeEach(() => {
  vi.clearAllMocks();
  const chain = { single, eq, select, update };
  from.mockReturnValue(chain);
  eq.mockReturnValue(chain);
  select.mockReturnValue(chain);
  update.mockReturnValue(chain);
});

describe("Shared outage state", () => {
  it("reads the public singleton's enabled state", async () => {
    single.mockResolvedValue({ data: { visible: true }, error: null });
    expect(await readContactOutage()).toBe(true);
    expect(from).toHaveBeenCalledWith("contact_outage");
    expect(eq).toHaveBeenCalledWith("id", true);
  });
  it("saves hidden state without affecting other settings", async () => {
    single.mockResolvedValue({ data: { visible: false }, error: null });
    expect(await saveContactOutage(false)).toBe(false);
    expect(update).toHaveBeenCalledWith({ visible: false });
    expect(eq).toHaveBeenCalledWith("id", true);
  });
  it("saves shown state", async () => {
    single.mockResolvedValue({ data: { visible: true }, error: null });
    expect(await saveContactOutage(true)).toBe(true);
    expect(update).toHaveBeenCalledWith({ visible: true });
  });
  it("does not report a denied write as successful", async () => {
    const denied = { message: "permission denied" };
    single.mockResolvedValue({ data: null, error: denied });
    await expect(saveContactOutage(false)).rejects.toEqual(denied);
  });
});