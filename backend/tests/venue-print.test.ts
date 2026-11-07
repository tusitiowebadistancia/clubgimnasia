import { describe, expect, it, vi } from "vitest";
import { appendQrPrintDocument } from "../../src/admin/venuePrint.js";

function element() {
  return { style: {}, textContent: "", src: "", alt: "", children: [] as unknown[], append(...children: unknown[]) { this.children.push(...children); }, addEventListener: vi.fn() };
}

describe("QR print document", () => {
  it("writes venue values as text instead of HTML", () => {
    const appended: ReturnType<typeof element>[] = [];
    const popup = { print: vi.fn(), document: { title: "", createElement: vi.fn(element), body: { append: vi.fn((node) => appended.push(node)) } } } as any;
    appendQrPrintDocument(popup, { label: '<img src=x onerror="alert(1)">', code: "<unsafe>" }, { png: "data:image/png;base64,qr" });

    expect(appended[0].children[0]).toMatchObject({ textContent: '<img src=x onerror="alert(1)">' });
    expect(appended[0].children[1]).toMatchObject({ textContent: "Código: <unsafe>" });
    expect(popup.document.createElement).toHaveBeenCalledWith("h1");
  });
});
