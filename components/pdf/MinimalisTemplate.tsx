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
import {
  PDF_FONT_FAMILY,
  PDF_MONO_FONT_FAMILY,
  registerPdfFonts,
} from "@/components/pdf/fonts";
import type { ReceiptTemplateProps } from "@/components/pdf/types";

registerPdfFonts();

const COLOR_TEXT = "#18181B";
const COLOR_MUTED = "#71717A";
const COLOR_LINE = "#E4E4E7";

const styles = StyleSheet.create({
  page: {
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 10,
    color: COLOR_TEXT,
    padding: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  logo: {
    width: 32,
    height: 32,
  },
  businessName: {
    fontSize: 12,
    fontWeight: 400,
  },
  title: {
    fontSize: 9,
    color: COLOR_MUTED,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 9,
    color: COLOR_MUTED,
  },
  metaValue: {
    fontSize: 9,
    fontFamily: PDF_MONO_FONT_FAMILY,
  },
  thinLine: {
    borderTopWidth: 0.5,
    borderTopColor: COLOR_LINE,
    marginTop: 16,
    marginBottom: 16,
  },
  tableHeaderRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontSize: 8,
    color: COLOR_MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderTopWidth: 0.5,
    borderTopColor: COLOR_LINE,
  },
  colItem: { flexGrow: 1, flexBasis: 0 },
  colQty: { width: 32, textAlign: "right", fontFamily: PDF_MONO_FONT_FAMILY },
  colPrice: { width: 80, textAlign: "right", fontFamily: PDF_MONO_FONT_FAMILY },
  colTotal: { width: 80, textAlign: "right", fontFamily: PDF_MONO_FONT_FAMILY },
  summaryBlock: {
    alignSelf: "flex-end",
    width: 200,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  summaryLabel: {
    color: COLOR_MUTED,
  },
  summaryValue: {
    fontFamily: PDF_MONO_FONT_FAMILY,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: COLOR_TEXT,
  },
  totalLabel: {
    fontWeight: 700,
  },
  totalValue: {
    fontFamily: PDF_MONO_FONT_FAMILY,
    fontWeight: 700,
  },
  footer: {
    marginTop: 48,
    alignItems: "flex-end",
  },
  signatureLine: {
    width: 140,
    borderTopWidth: 0.5,
    borderTopColor: COLOR_LINE,
    paddingTop: 4,
    textAlign: "center",
    fontSize: 9,
    color: COLOR_MUTED,
  },
});

export function MinimalisTemplate({ profile, receipt }: ReceiptTemplateProps) {
  const totals = calculateTotal({
    items: receipt.items,
    discount: receipt.discount,
    taxPercent: receipt.taxPercent,
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {profile.logoBase64 ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- komponen Image react-pdf (PDF), tidak punya prop alt.
            <Image src={profile.logoBase64} style={styles.logo} />
          ) : null}
          <Text style={styles.businessName}>{profile.businessName}</Text>
        </View>

        <Text style={styles.title}>Kwitansi</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>No.</Text>
          <Text style={styles.metaValue}>{receipt.number}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Tanggal</Text>
          <Text style={styles.metaValue}>{formatDate(receipt.date)}</Text>
        </View>
        {receipt.buyerName ? (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Pembeli</Text>
            <Text style={{ fontSize: 9 }}>{receipt.buyerName}</Text>
          </View>
        ) : null}

        <View style={styles.thinLine} />

        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeaderCell, styles.colItem]}>Item</Text>
          <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
          <Text style={[styles.tableHeaderCell, styles.colPrice]}>Harga</Text>
          <Text style={[styles.tableHeaderCell, styles.colTotal]}>Jumlah</Text>
        </View>
        {receipt.items.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.colItem}>{item.name}</Text>
            <Text style={styles.colQty}>{item.qty}</Text>
            <Text style={styles.colPrice}>{formatRupiah(item.unitPrice)}</Text>
            <Text style={styles.colTotal}>
              {formatRupiah(item.qty * item.unitPrice)}
            </Text>
          </View>
        ))}

        <View style={styles.summaryBlock}>
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
            <Text style={styles.totalValue}>{formatRupiah(totals.total)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.signatureLine}>
            {profile.ownerName || profile.businessName}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
