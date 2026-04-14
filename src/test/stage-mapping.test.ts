import { describe, it, expect } from "vitest";
import { toDbStage, fromDbStage } from "@/types/baby";
import type { AppStage, DbStage } from "@/types/baby";

describe("Stage Enum Mapping", () => {
  describe("toDbStage", () => {
    it("should map direct-match stages unchanged", () => {
      expect(toDbStage("prenatal")).toBe("prenatal");
      expect(toDbStage("0-3m")).toBe("0-3m");
      expect(toDbStage("3-6m")).toBe("3-6m");
    });

    it("should map 6-9m to 6-12m", () => {
      expect(toDbStage("6-9m")).toBe("6-12m");
    });

    it("should map 9-12m to 6-12m", () => {
      expect(toDbStage("9-12m")).toBe("6-12m");
    });

    it("should map 12m+ to 12-18m", () => {
      expect(toDbStage("12m+")).toBe("12-18m");
    });
  });

  describe("fromDbStage", () => {
    it("should map direct-match stages unchanged", () => {
      expect(fromDbStage("prenatal")).toBe("prenatal");
      expect(fromDbStage("0-3m")).toBe("0-3m");
      expect(fromDbStage("3-6m")).toBe("3-6m");
    });

    it("should map 6-12m to 6-9m", () => {
      expect(fromDbStage("6-12m")).toBe("6-9m");
    });

    it("should map 12-18m to 12m+", () => {
      expect(fromDbStage("12-18m")).toBe("12m+");
    });

    it("should map 18-24m to 12m+", () => {
      expect(fromDbStage("18-24m")).toBe("12m+");
    });
  });

  describe("round-trip consistency", () => {
    it("should round-trip all app stages through DB and back", () => {
      const appStages: AppStage[] = ["prenatal", "0-3m", "3-6m", "6-9m", "9-12m", "12m+"];
      for (const stage of appStages) {
        const dbStage = toDbStage(stage);
        const backToApp = fromDbStage(dbStage);
        // 9-12m maps to 6-12m which maps back to 6-9m (lossy but deterministic)
        if (stage === "9-12m") {
          expect(backToApp).toBe("6-9m");
        } else {
          expect(backToApp).toBe(stage);
        }
      }
    });

    it("should map all DB stages to valid app stages", () => {
      const dbStages: DbStage[] = ["prenatal", "0-3m", "3-6m", "6-12m", "12-18m", "18-24m"];
      const validAppStages: AppStage[] = ["prenatal", "0-3m", "3-6m", "6-9m", "9-12m", "12m+"];
      for (const dbStage of dbStages) {
        const appStage = fromDbStage(dbStage);
        expect(validAppStages).toContain(appStage);
      }
    });
  });
});
