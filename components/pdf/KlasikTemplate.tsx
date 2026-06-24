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
import { terbilangRupiah } from "@/lib/terbilang";
import { PDF_FONT_FAMILY, registerPdfFonts } from "@/components/pdf/fonts";
import type { ReceiptTemplateProps } from "@/components/pdf/types";

registerPdfFonts();

const COLOR_TEXT = "#111827";
const COLOR_MUTED = "#4B5563";
const COLOR_BORDER = "#1F2937";
const COLOR_FILL = "#F3F4F6";

const styles = StyleSheet.create({
  page: {
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 10,
    color: COLOR_TEXT,
    padding: 32,
  },
  outerBorder: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLOR_BORDER,
    padding: 24,
  },
  logo: {
    width: 40,
    height: 40,
    alignSelf: "center",
    marginBottom: 8,
    borderRadius: 4,
  },
  businessName: {
    fontSize: 13,
    fontWeight: 700,
    textAlign: "center",
  },
  businessMeta: {
    fontSize: 9,
    color: COLOR_MUTED,
    textAlign: "center",
    lineHeight: 1.4,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
    letterSpacing: 4,
    marginTop: 12,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
    fontSize: 9,
    color: COLOR_MUTED,
  },
  metaValue: {
    fontWeight: 700,
    color: COLOR_TEXT,
  },
  buyerRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 16,
    fontSize: 10,
  },
  buyerLabel: {
    color: COLOR_MUTED,
  },
  table: {
    borderWidth: 1,
    borderColor: COLOR_BORDER,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: COLOR_FILL,
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLOR_BORDER,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  cellLast: {
    borderBottomWidth: 1,
    borderColor: COLOR_BORDER,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  headerCellText: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  colItem: { flexGrow: 1, flexBasis: 0 },
  colQty: { width: 36, textAlign: "right" },
  colPrice: { width: 85, textAlign: "right" },
  colTotal: { width: 85, textAlign: "right" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  summaryLabel: {
    width: 90,
    color: COLOR_MUTED,
  },
  summaryValue: {
    width: 85,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderColor: COLOR_BORDER,
  },
  totalLabel: {
    width: 90,
    fontWeight: 700,
  },
  totalValue: {
    width: 85,
    textAlign: "right",
    fontWeight: 700,
  },
  terbilangBlock: {
    marginTop: 16,
  },
  terbilangText: {
    fontSize: 10,
    fontWeight: 700,
    textAlign: "center",
  },
  footer: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signatureBlock: {
    width: 160,
    alignItems: "center",
  },
  signatureDate: {
    fontSize: 9,
    color: COLOR_MUTED,
    marginBottom: 4,
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

export function KlasikTemplate({ profile, receipt }: ReceiptTemplateProps) {
  const totals = calculateTotal({
    items: receipt.items,
    discount: receipt.discount,
    taxPercent: receipt.taxPercent,
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder}>
          {profile.logoBase64 ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- komponen Image react-pdf (PDF), tidak punya prop alt.
            <Image src={profile.logoBase64} style={styles.logo} />
          ) : null}
          <Text style={styles.businessName}>{profile.businessName}</Text>
          {profile.address ? (
            <Text style={styles.businessMeta}>{profile.address}</Text>
          ) : null}
          {profile.phone ? (
            <Text style={styles.businessMeta}>{profile.phone}</Text>
          ) : null}

          <Text style={styles.title}>KWITANSI</Text>

          <View style={styles.metaRow}>
            <Text>
              No: <Text style={styles.metaValue}>{receipt.number}</Text>
            </Text>
            <Text>
              Tanggal:{" "}
              <Text style={styles.metaValue}>{formatDate(receipt.date)}</Text>
            </Text>
          </View>

          <View style={styles.buyerRow}>
            <Text style={styles.buyerLabel}>Sudah terima dari:</Text>
            <Text style={{ fontWeight: 700 }}>{receipt.buyerName || "—"}</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text
                style={[styles.cell, styles.headerCellText, styles.colItem]}
              >
                Item
              </Text>
              <Text style={[styles.cell, styles.headerCellText, styles.colQty]}>
                Qty
              </Text>
              <Text
                style={[styles.cell, styles.headerCellText, styles.colPrice]}
              >
                Harga Satuan
              </Text>
              <Text
                style={[
                  styles.cellLast,
                  styles.headerCellText,
                  styles.colTotal,
                ]}
              >
                Jumlah
              </Text>
            </View>
            {receipt.items.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.cell, styles.colItem]}>{item.name}</Text>
                <Text style={[styles.cell, styles.colQty]}>{item.qty}</Text>
                <Text style={[styles.cell, styles.colPrice]}>
                  {formatRupiah(item.unitPrice)}
                </Text>
                <Text style={[styles.cellLast, styles.colTotal]}>
                  {formatRupiah(item.qty * item.unitPrice)}
                </Text>
              </View>
            ))}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatRupiah(totals.subtotal)}
              </Text>
            </View>
            {totals.discountAmount > 0 ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Diskon</Text>
                <Text style={styles.summaryValue}>
                  -{formatRupiah(totals.discountAmount)}
                </Text>
              </View>
            ) : null}
            {totals.taxAmount > 0 ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  PPN ({receipt.taxPercent}%)
                </Text>
                <Text style={styles.summaryValue}>
                  {formatRupiah(totals.taxAmount)}
                </Text>
              </View>
            ) : null}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatRupiah(totals.total)}
              </Text>
            </View>
          </View>

          <View style={styles.terbilangBlock}>
            <Text style={styles.terbilangText}>
              * {terbilangRupiah(totals.total)} *
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureDate}>
                {formatDate(receipt.date)}
              </Text>
              <Text style={{ fontSize: 9, color: COLOR_MUTED }}>
                Yang menerima,
              </Text>
              <View style={styles.signatureSpace} />
              <Text style={styles.signatureLine}>
                {profile.ownerName || profile.businessName}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
