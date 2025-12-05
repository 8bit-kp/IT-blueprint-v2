import React, { useMemo } from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// === Brand / Theme ===
const BRAND = {
  primary: "#15587B",
  accent: "#935010",
  teal: "#34808A",
  gray700: "#374151",
  lightLine: "#D1D5DB",
};

const COLORS = {
  pageBg: "#FFFFFF",
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

// Margins
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

// Helper for chip colors
const chipStyles = (priority) => {
  const p = (priority || "").toLowerCase().trim();
  if (p === "critical") return { backgroundColor: COLORS.priorityCriticalBg, color: COLORS.priorityCriticalText };
  if (p === "high") return { backgroundColor: COLORS.priorityHighBg, color: COLORS.priorityHighText };
  if (p === "medium") return { backgroundColor: COLORS.priorityMediumBg, color: COLORS.priorityMediumText };
  // Default Low or others
  return { backgroundColor: COLORS.priorityLowBg, color: COLORS.priorityLowText };
};

// Helper for cell backgrounds
const getProviderBackground = (provider, priority) => {
  const prov = (provider || "").toLowerCase().trim();
  const pri = (priority || "").toLowerCase().trim();
  
  // 1. ALWAYS YELLOW: "No Data", "Generator", or empty/null
  if (!prov || prov === "no data" || prov === "generator" || prov === "") {
    return COLORS.yellowBg;
  }

  // 2. RISK COLORS: Check for explicit "No Solution" / "No" / "None"
  if (prov === "no solution" || prov === "no" || prov === "none") {
    if (pri === "critical") return COLORS.darkRedBg; // Critical + No Solution -> Dark Red
    if (pri === "high") return COLORS.lightRedBg;    // High + No Solution -> Light Red
    return COLORS.yellowBg;                          // Medium/Low + No Solution -> Yellow
  }
  
  return "transparent";
};

const getOfferingBackground = (offering) => {
  const off = (offering || "").toLowerCase().trim();
  return (off === "no data" || off === "" || off === "n/a") ? COLORS.yellowBg : "transparent";
};

// ==========================================
// 1. DATA TRANSFORMATION LOGIC
// ==========================================
const transformFormData = (inputData) => {
  // Fallback if data is null/undefined
  if (!inputData) return [];

  // Helper to correctly parse values whether they are Strings or Objects
  const parseVal = (val, defaultText = "No Solution") => {
    if (!val) return defaultText;
    
    // Handle new Object structure { choice, vendor, ... }
    if (typeof val === 'object') {
        const choice = val.choice;
        if (choice === "Vendor") return val.vendor || "Unspecified Vendor";
        if (choice === "Yes") return "In Place";
        if (choice === "No") return "No Solution"; 
        return choice || defaultText;
    }

    // Handle Legacy String structure
    if (typeof val === 'string') {
        if (val.startsWith("Vendor:")) return val.split("Vendor:")[1];
        if (val === "Yes") return "In Place";
        if (val === "No") return "No Solution";
        return val;
    }
    return defaultText;
  };

  // Helper to extract meta fields (Priority/Offering) from Object or default to N/A
  const getMeta = (val) => {
      if (typeof val === 'object' && val !== null) {
          return {
              pri: val.businessPriority || "N/A",
              off: val.offering || "N/A"
          };
      }
      return { pri: "N/A", off: "N/A" };
  };

  // --- SECTION 1: APPLICATIONS ---
  const appRows = [];
  const appCategories = inputData.applications || {};
  const targetCategories = ['productivity', 'finance', 'hrit', 'payroll', 'additional'];

  targetCategories.forEach(cat => {
    const apps = appCategories[cat] || [];
    if(Array.isArray(apps)) {
        apps.forEach(app => {
            if(app.name) {
                appRows.push({
                    function: cat.charAt(0).toUpperCase() + cat.slice(1),
                    provider: app.name,
                    priority: app.businessPriority ? app.businessPriority : "Low",
                    offering: app.offering ? app.offering : "No Data"
                });
            }
        });
    }
  });

  // --- SECTION 2: SECURITY (Dynamic from DB) ---
  const tc = inputData.technicalControls || {};
  const securityMap = [
    { key: "socSiem", label: "SOC-SIEM" },
    { key: "dataClassification", label: "Data Classification" },
    { key: "edr", label: "Endpoint Detection & Response" },
    { key: "mdm", label: "MDM" },
    { key: "mfa", label: "MFA" },
    { key: "nac", label: "NAC" },
    { key: "iam", label: "IAM" },
    { key: "vulnerabilityMgmt", label: "Vulnerability Mgmt" },
    { key: "emailSecurity", label: "E-mail Security" },
    { key: "ssaVpn", label: "SSA-VPN" },
    { key: "dlp", label: "Data Loss Prevention" },
    { key: "casb", label: "CASB" },
    { key: "secureWebGateway", label: "Secure Web Gateway" },
    { key: "nextGenFirewall", label: "NGFW" },
    { key: "assetManagement", label: "Asset Management" },
    { key: "sdWan", label: "SD-WAN" },
  ];

  const securityRows = securityMap.map(item => {
    const dataEntry = tc[item.key];
    const { pri, off } = getMeta(dataEntry); 

    return {
        function: item.label,
        provider: parseVal(dataEntry),
        priority: pri,
        offering: off
    };
  });

  // --- SECTION 3: INFRASTRUCTURE (UPDATED DYNAMIC LOGIC) ---
  
  // 1. List of keys from Step 3 that use the new Object structure
  const infraKeys = [
    { key: "WAN1", label: "WAN 1" },
    { key: "WAN2", label: "WAN 2" },
    { key: "WAN3", label: "WAN 3" },
    { key: "switchingVendor", label: "Switching" },
    { key: "routingVendor", label: "Routing" },
    { key: "wirelessVendor", label: "Wireless" },
    { key: "baremetalVendor", label: "Baremetal" },
    { key: "virtualizationVendor", label: "Virtualization" },
    { key: "cloudVendor", label: "Cloud" },
  ];

  // 2. Map dynamic rows
  const dynamicInfraRows = infraKeys.map(item => {
    const dataEntry = inputData[item.key];
    const { pri, off } = getMeta(dataEntry);
    
    return {
        function: item.label,
        provider: parseVal(dataEntry),
        priority: pri,
        offering: off
    };
  });

  // 3. Manually add Facilities (UPS/Generator) which are likely still simple fields from Step 2
  const upsVal = inputData.hasUPS === "Yes" ? "In Place" : "No Solution";
  const genVal = inputData.hasGenerator === "Yes" ? "In Place" : "No Solution";

  const staticInfraRows = [
    { function: "UPS", provider: upsVal, priority: "Critical", offering: "On-premise" },
    { function: "Generator", provider: genVal, priority: "Critical", offering: "On-premise" }
  ];

  const infraRows = [...dynamicInfraRows, ...staticInfraRows];

  // Combine
  return [
    { section: "applications", color: COLORS.applicationsBand, rows: appRows.length ? appRows : [{function: "None", provider: "No Apps", priority: "Low", offering: "-"}] },
    { section: "security", color: COLORS.securityBand, rows: securityRows },
    { section: "infrastructure", color: COLORS.infraBand, rows: infraRows },
  ];
};


// ==========================================
// 2. SUB-COMPONENTS
// ==========================================
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

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
const CurrentState = ({ data, title = "Current State" }) => {
  
  const tableData = useMemo(() => transformFormData(data), [data]);

  // Recompute available height with new themed paddings
  const rowsCount = tableData.reduce((sum, s) => sum + s.rows.length, 0);
  const sectionBands = tableData.length;

  // A4 portrait height = 842pt
  const pageInnerHeight = 842 - (PAD_T + PAD_B);
  const H = {
    title: 28,      
    rule: 12,      
    headerBand: 20,
    headerRow: 24,
    sectionBand: 20,
    row: 18,
  };

  const contentHeight =
    H.title + H.rule + H.headerBand + H.headerRow + sectionBands * H.sectionBand + rowsCount * H.row;

  const rawScale = Math.min(1, (pageInnerHeight - 6) / contentHeight) * 0.99;
  const scale = Math.max(0.60, rawScale);

  return (
    <Page size="A4" style={styles.page}>
      <View style={[styles.scaler, { transform: `scale(${scale})` }]} wrap={false}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rule} />

        <View style={styles.tableWrap}>
          <View style={styles.headerBand}>
            <Text style={styles.headerText}>Applications • Security • Infrastructure</Text>
          </View>
          <TableHeader />
          {tableData.map((section, sIdx) => (
            <View key={sIdx}>
              <SectionBand name={section.section} color={section.color} />
              {section.rows.map((r, idx) => <Row key={idx} item={r} idx={idx} />)}
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
};

export default CurrentState;