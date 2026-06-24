import { describe, expect, it } from "vitest";
import {
  sampleLogoBase64,
  sampleReceipt,
  sampleSellerProfile,
} from "@/lib/sample-data";

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

describe("sampleLogoBase64", () => {
  it("adalah data URI PNG yang lengkap & valid (bukan ter-truncate)", () => {
    const match = /^data:image\/png;base64,(.+)$/.exec(sampleLogoBase64);
    expect(match).not.toBeNull();

    const buffer = Buffer.from(match![1], "base64");
    expect(buffer.subarray(0, 8)).toEqual(PNG_SIGNATURE);

    // Susuri chunk PNG (length+type+data+CRC) sampai IEND; jika base64 ter-truncate
    // (mis. salah transkripsi manual), pos akan melebihi panjang buffer.
    let pos = 8;
    let lastType = "";
    while (pos < buffer.length) {
      const chunkSize = buffer.readUInt32BE(pos);
      pos += 4;
      lastType = buffer.subarray(pos, pos + 4).toString("ascii");
      pos += 4 + chunkSize + 4;
      expect(pos).toBeLessThanOrEqual(buffer.length);
    }
    expect(lastType).toBe("IEND");
    expect(pos).toBe(buffer.length);
  });
});

describe("sample-data fixtures", () => {
  it("sampleSellerProfile memakai sampleLogoBase64", () => {
    expect(sampleSellerProfile.logoBase64).toBe(sampleLogoBase64);
  });

  it("sampleReceipt punya minimal 1 item dengan qty & harga > 0", () => {
    expect(sampleReceipt.items.length).toBeGreaterThan(0);
    for (const item of sampleReceipt.items) {
      expect(item.qty).toBeGreaterThan(0);
      expect(item.unitPrice).toBeGreaterThan(0);
    }
  });
});
