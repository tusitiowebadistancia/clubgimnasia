import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage } from "../../src/data/menuData.js";

describe("menu location messages", () => {
  it("identifies a table without adding an incorrect prefix", () => {
    const message = buildWhatsAppMessage({ label: "Mesa 01", area: "TABLE" }, [{ name: "Agua", quantity: 2, price: 1000 }]);
    expect(message).toContain("*Mesa 01*");
    expect(message).toMatch(/1\. Agua x2 - \$\s?2\.000/);
    expect(message).toMatch(/\*Total:\* \$\s?2\.000/);
  });

  it("identifies a bar without calling it a table", () => {
    const message = buildWhatsAppMessage({ label: "Barra principal", area: "BAR" }, [{ name: "Agua", quantity: 2, price: 1000 }]);
    expect(message).toContain("*Barra principal*");
    expect(message).not.toContain("MESA Barra");
  });
});
