import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { calculateTotal } from "@/lib/calc";
import { formatDate, formatRupiah } from "@/lib/format";
import { PDF_FONT_FAMILY, registerPdfFonts } from "@/components/pdf/fonts";
import type { ReceiptTemplateProps } from "@/components/pdf/types";

registerPdfFonts();

const COLOR_BRAND = "#2563EB";
const COLOR_TEXT = "#111827";
const COLOR_MUTED = "#6B7280";
const COLOR_BORDER = "#E5E7EB";
const COLOR_FILL = "#F3F4F6";

const styles = StyleSheet.create({
  page: {
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 10,
    color: COLOR_TEXT,
    padding: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  sellerBlock: {
    flexDirection: "row",
    gap: 10,
    maxWidth: 300,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 4,
  },
  businessName: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 2,
  },
  mutedLine: {
    fontSize: 9,
    color: COLOR_MUTED,
    lineHeight: 1.4,
  },
  titleBlock: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: COLOR_BRAND,
    marginBottom: 6,
  },
  metaLine: {
    fontSize: 9,
    color: COLOR_MUTED,
  },
  metaValue: {
    fontWeight: 500,
    color: COLOR_TEXT,
  },
  buyerBlock: {
    marginBottom: 16,
  },
  buyerLabel: {
    fontSize: 8,
    color: COLOR_MUTED,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  buyerName: {
    fontSize: 11,
    fontWeight: 500,
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: COLOR_BORDER,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_BORDER,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: COLOR_FILL,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: COLOR_BORDER,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 700,
    color: COLOR_MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  colItem: { flexGrow: 1, flexBasis: 0 },
  colQty: { width: 40, textAlign: "right" },
  colPrice: { width: 90, textAlign: "right" },
  colTotal: { width: 90, textAlign: "right" },
  summaryBlock: {
    alignSelf: "flex-end",
    width: 220,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  summaryLabel: {
    color: COLOR_MUTED,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLOR_BORDER,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 700,
  },
  totalValue: {
    fontSize: 13,
    fontWeight: 700,
    color: COLOR_BRAND,
  },
  notes: {
    marginTop: 28,
    fontSize: 9,
    color: COLOR_MUTED,
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 36,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signatureBlock: {
    width: 160,
    alignItems: "center",
  },
  signatureSpace: {
    height: 48,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: COLOR_TEXT,
    width: "100%",
    paddingTop: 4,
    textAlign: "center",
    fontSize: 9,
  },
});

export function ModernTemplate({ profile, receipt }: ReceiptTemplateProps) {
  const totals = calculateTotal({
    items: receipt.items,
    discount: receipt.discount,
    taxPercent: receipt.taxPercent,
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.sellerBlock}>
            {profile.logoBase64 ? (
              // eslint-disable-next-line jsx-a11y/alt-text -- ini komponen Image react-pdf (PDF), bukan <img> HTML; tidak punya prop alt.
              <Image src={profile.logoBase64} style={styles.logo} />
            ) : null}
            <View>
              <Text style={styles.businessName}>{profile.businessName}</Text>
              {profile.ownerName ? (
                <Text style={styles.mutedLine}>{profile.ownerName}</Text>
              ) : null}
              {profile.address ? (
                <Text style={styles.mutedLine}>{profile.address}</Text>
              ) : null}
              {profile.phone ? (
                <Text style={styles.mutedLine}>{profile.phone}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.title}>KWITANSI</Text>
            <Text style={styles.metaLine}>
              No: <Text style={styles.metaValue}>{receipt.number}</Text>
            </Text>
            <Text style={styles.metaLine}>
              Tanggal:{" "}
              <Text style={styles.metaValue}>{formatDate(receipt.date)}</Text>
            </Text>
          </View>
        </View>

        {receipt.buyerName ? (
          <View style={styles.buyerBlock}>
            <Text style={styles.buyerLabel}>Diterima dari</Text>
            <Text style={styles.buyerName}>{receipt.buyerName}</Text>
          </View>
        ) : null}

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.colItem]}>Item</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>
              Harga Satuan
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>
              Jumlah
            </Text>
          </View>
          {receipt.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colItem}>{item.name}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colPrice}>
                {formatRupiah(item.unitPrice)}
              </Text>
              <Text style={styles.colTotal}>
                {formatRupiah(item.qty * item.unitPrice)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryBlock}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text>{formatRupiah(totals.subtotal)}</Text>
          </View>
          {totals.discountAmount > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Diskon</Text>
              <Text>-{formatRupiah(totals.discountAmount)}</Text>
            </View>
          ) : null}
          {totals.taxAmount > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                PPN ({receipt.taxPercent}%)
              </Text>
              <Text>{formatRupiah(totals.taxAmount)}</Text>
            </View>
          ) : null}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatRupiah(totals.total)}</Text>
          </View>
        </View>

        {receipt.notes ? (
          <Text style={styles.notes}>{receipt.notes}</Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.signatureBlock}>
            <Text style={styles.mutedLine}>Diterima oleh,</Text>
            <View style={styles.signatureSpace} />
            <Text style={styles.signatureLine}>
              {profile.ownerName || profile.businessName}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
