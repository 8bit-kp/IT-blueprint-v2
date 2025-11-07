// src/pdfs/currentState.jsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// === Brand / Theme (aligns with BlueprintDocument) ===
const BRAND = {
  primary: "#15587B",
  accent:  "#935010",
  teal:    "#34808A",
  gray700: "#374151",
  lightLine: "#D1D5DB",
};

const COLORS = {
  pageBg: "#FFFFFF",                 // match other pages (white)
  tableBorder: BRAND.lightLine,
  headBg: "#0f5c74",
  headText: "#ffffff",
  bandTop: BRAND.primary,
  leftBand: "#0e6582",
  applicationsBand: "#1e7a91",
  securityBand: "#2c9c82",
  infraBand: "#2b5e85",
  rowEven: "#F9FAFB",
  rowOdd: "#FFFFFF",

  // priority chips
  priorityCriticalBg: "#FEE2E2",
  priorityCriticalText: "#B91C1C",
  priorityHighBg: "#FEF3C7",
  priorityHighText: "#B45309",
  priorityMediumBg: "#DBEAFE",
  priorityMediumText: "#1E40AF",
  priorityLowBg: "#DCFCE7",
  priorityLowText: "#065F46",

  // conditional cell backgrounds
  yellowBg: "#FEF9C3",
  lightRedBg: "#FCA5A5",
  darkRedBg: "#DC2626",
};

// Theme-consistent margins (same as BlueprintDocument base.page)
const PAD_T = 48;
const PAD_B = 48;
const PAD_H = 56;

const styles = StyleSheet.create({
  page: {
    paddingTop: PAD_T,
    paddingBottom: PAD_B,
    paddingHorizontal: PAD_H,
    backgroundColor: COLORS.pageBg,
  },
  scaler: { transformOrigin: "top left" },

  // Title matches other pages
  title: { fontSize: 28, color: BRAND.primary, fontWeight: 700, marginBottom: 6 },
  rule: { height: 1.5, backgroundColor: BRAND.teal, opacity: 0.85, marginBottom: 14 },

  tableWrap: {
    borderWidth: 1,
    borderColor: COLORS.tableBorder,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  headerBand: { backgroundColor: COLORS.bandTop, paddingVertical: 6, paddingHorizontal: 10 },
  headerText: { color: "#ffffff", fontSize: 11, fontWeight: 700 },
  colHeaderRow: { flexDirection: "row", backgroundColor: COLORS.headBg },
  th: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: COLORS.tableBorder,
  },
  thText: { color: COLORS.headText, fontSize: 10.5, fontWeight: 700 },

  fnCol: { width: "36%" },
  providerCol: { width: "26%" },
  priorityCol: { width: "18%" },
  offeringCol: { width: "20%", borderRightWidth: 0 },

  sectionBandRow: { flexDirection: "row" },
  leftBandCell: {
    width: "36%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.leftBand,
    justifyContent: "center",
  },
  leftBandText: { color: "#ffffff", fontSize: 10, fontWeight: 700 },
  sectionBandCell: {
    width: "64%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  sectionBandText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: 700,
    textTransform: "capitalize",
  },

  row: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.tableBorder,
    minHeight: 18,
    alignItems: "center",
  },
  td: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: COLORS.tableBorder,
    fontSize: 9.8,
    color: "#111827",
    justifyContent: "center",
  },
  tdLast: { borderRightWidth: 0 },
  noWrap: { flexShrink: 1 },
  chip: {
    alignSelf: "flex-start",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    fontSize: 9.3,
    fontWeight: 700,
  },
});

// Priority chip colors
const chipStyles = (priority) => {
  const p = (priority || "").toLowerCase();
  if (p === "critical") return { backgroundColor: COLORS.priorityCriticalBg, color: COLORS.priorityCriticalText };
  if (p === "high") return { backgroundColor: COLORS.priorityHighBg, color: COLORS.priorityHighText };
  if (p === "medium") return { backgroundColor: COLORS.priorityMediumBg, color: COLORS.priorityMediumText };
  return { backgroundColor: COLORS.priorityLowBg, color: COLORS.priorityLowText };
};

// Provider/Offering conditional backgrounds
const getProviderBackground = (provider, priority) => {
  const prov = (provider || "").toLowerCase();
  const pri = (priority || "").toLowerCase();
  if (prov === "no data" || prov === "generator") return COLORS.yellowBg;
  if (prov === "no solution") {
    if (pri === "critical") return COLORS.darkRedBg;
    if (pri === "high" || pri === "medium") return COLORS.lightRedBg;
  }
  return "transparent";
};
const getOfferingBackground = (offering) =>
  (offering || "").toLowerCase() === "no data" ? COLORS.yellowBg : "transparent";

// Dummy data (unchanged)
const DATA = [
  {
    section: "applications",
    color: COLORS.applicationsBand,
    rows: [
      { function: "Payroll", provider: "Paycom", priority: "Critical", offering: "SaaS" },
      { function: "Finance", provider: "QuickBooks", priority: "Critical", offering: "SaaS" },
      { function: "HRIT", provider: "Rippling", priority: "Critical", offering: "SaaS" },
      { function: "Productivity", provider: "O365", priority: "Critical", offering: "SaaS" },
      { function: "Telephony", provider: "Verizon", priority: "Critical", offering: "On-Premise" },
    ],
  },
  {
    section: "security",
    color: COLORS.securityBand,
    rows: [
      { function: "SOC-SIEM", provider: "RapidFire", priority: "High", offering: "SaaS" },
      { function: "Data Classification", provider: "No Solution", priority: "High", offering: "N/A" },
      { function: "Endpoint Detection and Response", provider: "Microsoft Defender", priority: "Medium", offering: "SaaS" },
      { function: "MDM", provider: "IBM MAAS360", priority: "High", offering: "SaaS" },
      { function: "MFA", provider: "Microsoft Authenticator", priority: "Critical", offering: "SaaS" },
      { function: "NAC", provider: "No Solution", priority: "Critical", offering: "N/A" },
      { function: "IAM", provider: "Multi-vendor", priority: "Critical", offering: "Hybrid" },
      { function: "Vulnerability Management", provider: "Nodeware", priority: "High", offering: "SaaS" },
      { function: "Asset Management", provider: "No Solution", priority: "High", offering: "N/A" },
      { function: "E-mail Security", provider: "Barracuda", priority: "High", offering: "NO DATA" },
      { function: "SSA-VPN", provider: "Cato", priority: "Critical", offering: "SaaS" },
      { function: "Data Loss Prevention", provider: "No Solution", priority: "High", offering: "N/A" },
      { function: "Cloud Access Security Broker", provider: "No Solution", priority: "High", offering: "N/A" },
      { function: "Secure Web Gateway", provider: "Cato", priority: "High", offering: "SaaS" },
      { function: "NGFW", provider: "Cato", priority: "Critical", offering: "SaaS" },
      { function: "SDWAN", provider: "Cato", priority: "Critical", offering: "SaaS" },
    ],
  },
  {
    section: "infrastructure",
    color: COLORS.infraBand,
    rows: [
      { function: "Cloud", provider: "NO DATA", priority: "Medium", offering: "NO DATA" },
      { function: "Virtualization", provider: "VMWare", priority: "Critical", offering: "On-Premise" },
      { function: "Baremetal", provider: "Dell", priority: "Critical", offering: "On-Premise" },
      { function: "Wireless", provider: "Multi-vendor", priority: "Critical", offering: "On-Premise" },
      { function: "Routing", provider: "Cisco", priority: "Critical", offering: "On-Premise" },
      { function: "Switching", provider: "Multi-vendor", priority: "Critical", offering: "On-Premise" },
      { function: "WAN2", provider: "No Solution", priority: "High", offering: "N/A" },
      { function: "WAN1", provider: "ATT", priority: "Critical", offering: "On-Premise" },
      { function: "UPS", provider: "APC", priority: "Critical", offering: "N/A" },
      { function: "Generator", provider: "Generator", priority: "Critical", offering: "N/A" },
    ],
  },
];

const TableHeader = () => (
  <View style={styles.colHeaderRow}>
    <View style={[styles.th, styles.fnCol]}><Text style={styles.thText}>FUNCTION</Text></View>
    <View style={[styles.th, styles.providerCol]}><Text style={styles.thText}>PROVIDER</Text></View>
    <View style={[styles.th, styles.priorityCol]}><Text style={styles.thText}>PRIORITY</Text></View>
    <View style={[styles.th, styles.offeringCol]}><Text style={styles.thText}>OFFERING</Text></View>
  </View>
);

const SectionBand = ({ name, color }) => (
  <View style={styles.sectionBandRow}>
    <View style={styles.leftBandCell}>
      <Text style={styles.leftBandText}>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
    </View>
    <View style={[styles.sectionBandCell, { backgroundColor: color }]}>
      <Text style={styles.sectionBandText}>{name}</Text>
    </View>
  </View>
);

const Row = ({ item, idx }) => {
  const bg = idx % 2 === 0 ? COLORS.rowEven : COLORS.rowOdd;
  const chip = chipStyles(item.priority);
  const providerBg = getProviderBackground(item.provider, item.priority);
  const offeringBg = getOfferingBackground(item.offering);

  return (
    <View style={[styles.row, { backgroundColor: bg }]}>
      <View style={[styles.td, styles.fnCol, styles.noWrap]}><Text wrap={false}>{item.function}</Text></View>
      <View style={[styles.td, styles.providerCol, { backgroundColor: providerBg }]}><Text wrap={false}>{item.provider}</Text></View>
      <View style={[styles.td, styles.priorityCol]}><Text wrap={false} style={[styles.chip, chip]}>{item.priority || "—"}</Text></View>
      <View style={[styles.td, styles.offeringCol, styles.tdLast, { backgroundColor: offeringBg }]}><Text wrap={false}>{item.offering}</Text></View>
    </View>
  );
};

const CurrentState = ({ data = DATA, title = "Current State" }) => {
  // Recompute available height with new themed paddings
  const rowsCount = data.reduce((sum, s) => sum + s.rows.length, 0);
  const sectionBands = data.length;

  // A4 portrait height = 842pt
  const pageInnerHeight = 842 - (PAD_T + PAD_B);
  const H = {
    title: 28,       // title height approx
    rule: 12,        // rule + spacing
    headerBand: 20,
    headerRow: 24,
    sectionBand: 20,
    row: 18,
  };

  const contentHeight =
    H.title + H.rule + H.headerBand + H.headerRow + sectionBands * H.sectionBand + rowsCount * H.row;

  const rawScale = Math.min(1, (pageInnerHeight - 6) / contentHeight) * 0.99;
  const scale = Math.max(0.60, rawScale);  // guardrail

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.scaler, { transform: `scale(${scale})` }]} wrap={false}>
          {/* Theme-matching title + rule */}
          <Text style={styles.title}>{title}</Text>
          <View style={styles.rule} />

          <View style={styles.tableWrap}>
            <View style={styles.headerBand}>
              <Text style={styles.headerText}>Applications • Security • Infrastructure</Text>
            </View>
            <TableHeader />
            {data.map((section, sIdx) => (
              <View key={sIdx}>
                <SectionBand name={section.section} color={section.color} />
                {section.rows.map((r, idx) => <Row key={idx} item={r} idx={idx} />)}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CurrentState;
