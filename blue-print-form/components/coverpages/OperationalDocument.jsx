import React from "react";
import PdfFooter from "./pdfFooter";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 30,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    color: "#15587B",
    fontFamily: "Times-Roman",
    marginBottom: 15,
  },
  table: {
    width: "100%",
    border: "1pt solid #E5E7EB",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0F4C5C",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerCell: {
    fontSize: 7,
    color: "#FFFFFF",
    fontWeight: "bold",
    padding: 4,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#FFFFFF",
  },
  cell: {
    fontSize: 7,
    padding: 4,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  functionCell: {
    textAlign: "left",
    paddingLeft: 6,
  },
  
  // Row background colors
  bgLightBlue: { backgroundColor: "#B8E6E6" },
  bgMediumBlue: { backgroundColor: "#7BC5C5" },
  bgDarkBlue: { backgroundColor: "#4A9A9A" },
  bgLightGray: { backgroundColor: "#E5E7EB" },
  
  // Status colors
  bgCriticalRed: { backgroundColor: "#DC2626", color: "#FFFFFF", fontWeight: "bold" },
  bgMajorOrange: { backgroundColor: "#F97316", color: "#FFFFFF", fontWeight: "bold" },
  bgMinorYellow: { backgroundColor: "#FCD34D", color: "#000000" },
  bgNoSolution: { backgroundColor: "#EF4444", color: "#FFFFFF", fontWeight: "bold" },
});

const OperationalDocument = ({ companyName, preparedDate, formData }) => {
  // Demo data matching your image
  const operationalData = [
    { function: "Payroll", provider: "Paycom", priority: "Critical", offering: "SaaS", pii: "PII", russell: "Yes", sso: "No", delivery: "N/A", patched: "Yes", eol_eos: "Annual", support: "Jan 2026", contract: "Jan 2026", rowColor: "bgLightBlue" },
    { function: "Finance", provider: "Quickbooks", priority: "Critical", offering: "SaaS", pii: "Sensitive", russell: "Yes", sso: "No", delivery: "N/A", patched: "Yes", eol_eos: "Annual", support: "Mar 2026", contract: "Mar 2026", rowColor: "bgLightBlue" },
    { function: "HRIT", provider: "Rippling", priority: "Critical", offering: "SaaS", pii: "PII", russell: "No", sso: "Yes", delivery: "N/A", patched: "Yes", eol_eos: "Annual", support: "NO DATA", contract: "NO DATA", rowColor: "bgLightBlue" },
    { function: "Productivity", provider: "O365", priority: "Critical", offering: "SaaS", pii: "PII", russell: "Yes", sso: "No", delivery: "N/A", patched: "Yes", eol_eos: "Annual", support: "NO DATA", contract: "NO DATA", rowColor: "bgLightBlue" },
    { function: "Telephony", provider: "Verizon", priority: "Critical", offering: "On-Premise", pii: "N/A", russell: "No", sso: "No", delivery: "N/A", patched: "Yes", eol_eos: "Multi-year", support: "Jun 2025", contract: "Jun 2025", rowColor: "bgMediumBlue" },
    { function: "SOC-SIEM", provider: "RapidFire", priority: "High", offering: "SaaS", pii: "N/A", russell: "N/A", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "Yes", support: "Annual", contract: "Apr 2026", rowColor: "bgLightGray" },
    { function: "Data Classification", provider: "No Solution", priority: "High", priorityBg: "bgNoSolution", offering: "N/A", pii: "N/A", russell: "N/A", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "N/A", support: "N/A", contract: "N/A", rowColor: "bgLightGray" },
    { function: "Endpoint Detection and Response", provider: "Microsoft Defender", priority: "Medium", offering: "SaaS", pii: "N/A", russell: "N/A", sso: "NO DATA", delivery: "N/A", patched: "NO DATA", eol_eos: "N/A", support: "Annual", contract: "Sep 2025", rowColor: "bgLightGray" },
    { function: "MDM", provider: "IBM MaaS360", priority: "High", offering: "SaaS", pii: "N/A", russell: "NO DATA", sso: "No", delivery: "N/A", patched: "N/A", eol_eos: "Yes", support: "Annual", contract: "Oct 2025", rowColor: "bgLightGray" },
    { function: "MFA", provider: "Microsoft Authenticator", priority: "Critical", offering: "SaaS", pii: "N/A", russell: "N/A", sso: "N/A", delivery: "No", patched: "N/A", eol_eos: "N/A", support: "Annual", contract: "Jul 2025", rowColor: "bgMediumBlue" },
    { function: "NAC", provider: "No Solution", priority: "Critical", priorityBg: "bgCriticalRed", offering: "N/A", pii: "N/A", russell: "N/A", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "N/A", support: "N/A", contract: "N/A", rowColor: "bgMediumBlue" },
    { function: "IAM", provider: "Multi-vendor", priority: "Critical", offering: "Hybrid", pii: "N/A", russell: "No", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "N/A", support: "Annual", contract: "Jan 2026", rowColor: "bgMediumBlue" },
    { function: "Vulnerability Management", provider: "Nodeware", priority: "High", offering: "SaaS", pii: "N/A", russell: "N/A", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "N/A", support: "Annual", contract: "Jan 2026", rowColor: "bgMediumBlue" },
    { function: "Asset Management", provider: "No Solution", priority: "High", priorityBg: "bgNoSolution", offering: "N/A", pii: "N/A", russell: "No", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "N/A", support: "N/A", contract: "N/A", rowColor: "bgLightGray" },
    { function: "E-mail Security", provider: "Barracuda", priority: "High", offering: "NO DATA", pii: "N/A", russell: "NO DATA", sso: "N/A", delivery: "N/A", patched: "NO DATA", eol_eos: "N/A", support: "Multi-year", contract: "Jan 2028", rowColor: "bgLightGray" },
    { function: "SSA-VPN", provider: "Cato", priority: "Critical", offering: "SaaS", pii: "N/A", russell: "N/A", sso: "Yes", delivery: "No", patched: "N/A", eol_eos: "N/A", support: "Annual", contract: "Mar 2026", rowColor: "bgMediumBlue" },
    { function: "Data Loss Prevention", provider: "No Solution", priority: "High", priorityBg: "bgNoSolution", offering: "N/A", pii: "N/A", russell: "Yes", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "N/A", support: "N/A", contract: "N/A", rowColor: "bgLightGray" },
    { function: "Cloud Access Security Broker", provider: "No Solution", priority: "High", priorityBg: "bgNoSolution", offering: "N/A", pii: "N/A", russell: "Yes", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "N/A", support: "N/A", contract: "N/A", rowColor: "bgLightGray" },
    { function: "Secure Web Gateway", provider: "Cato", priority: "High", offering: "SaaS", pii: "N/A", russell: "Yes", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "N/A", support: "Annual", contract: "Oct 2025", rowColor: "bgMediumBlue" },
    { function: "NGFW", provider: "Cato", priority: "Critical", offering: "SaaS", pii: "N/A", russell: "Yes", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "N/A", support: "Annual", contract: "Oct 2025", rowColor: "bgMediumBlue" },
    { function: "SD/WAN", provider: "Cato", priority: "Critical", offering: "SaaS", pii: "N/A", russell: "Yes", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "N/A", support: "Annual", contract: "Sep 2025", rowColor: "bgMediumBlue" },
    { function: "Cloud", provider: "NO DATA", priority: "Medium", offering: "NO DATA", pii: "N/A", russell: "NO DATA", sso: "N/A", delivery: "NO DATA", patched: "N/A", eol_eos: "NO DATA", support: "NO DATA", contract: "N/A", rowColor: "bgLightGray" },
    { function: "Virtualization", provider: "VMWare", priority: "Critical", offering: "On-Premise", pii: "N/A", russell: "NO DATA", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "Mar 2024", support: "No", contract: "N/A", rowColor: "bgDarkBlue" },
    { function: "Baremetal", provider: "Dell", priority: "Critical", priorityBg: "bgCriticalRed", offering: "On-Premise", pii: "N/A", russell: "N/A", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "May 2023", support: "No", contract: "N/A", rowColor: "bgDarkBlue" },
    { function: "Wireless", provider: "Multi-vendor", priority: "Critical", priorityBg: "bgMinorYellow", offering: "On-Premise", pii: "N/A", russell: "N/A", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "June 2026", support: "Yes", contract: "N/A", rowColor: "bgDarkBlue" },
    { function: "Routing", provider: "Cisco", priority: "Critical", priorityBg: "bgMajorOrange", offering: "On-Premise", pii: "N/A", russell: "N/A", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "Aug 2025", support: "Yes", contract: "N/A", rowColor: "bgDarkBlue" },
    { function: "Switching", provider: "Multi-vendor", priority: "Critical", priorityBg: "bgMinorYellow", offering: "On-Premise", pii: "N/A", russell: "N/A", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "Aug 2025", support: "Yes", contract: "N/A", rowColor: "bgDarkBlue" },
    { function: "WAN2", provider: "No Solution", priority: "High", priorityBg: "bgNoSolution", offering: "N/A", pii: "N/A", russell: "N/A", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "N/A", support: "N/A", contract: "Multi-year Jan 2027", rowColor: "bgDarkBlue" },
    { function: "WAN1", provider: "ATT", priority: "Critical", offering: "On-Premise", pii: "N/A", russell: "N/A", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "N/A", support: "N/A", contract: "Multi-year Mar 2027", rowColor: "bgDarkBlue" },
    { function: "UPS", provider: "APC", priority: "Critical", offering: "N/A", pii: "N/A", russell: "N/A", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "NO DATA", support: "NO DATA", contract: "N/A", rowColor: "bgLightGray" },
    { function: "Generator", provider: "Generator", priority: "Critical", offering: "N/A", pii: "N/A", russell: "N/A", sso: "N/A", delivery: "N/A", patched: "N/A", eol_eos: "N/A", support: "N/A", contract: "N/A", rowColor: "bgLightGray" },
  ];

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginTop: 200, alignItems: "center" }}>
          <Text style={[styles.title, { fontSize: 32, marginBottom: 30 }]}>Operational Blueprint</Text>
          <Text style={{ fontSize: 12, color: "#666666" }}>
            Prepared for {companyName || "Sample Company"}
          </Text>
          <Text style={{ fontSize: 10, color: "#999999", marginTop: 10 }}>
            {preparedDate ? preparedDate.toLocaleDateString() : new Date().toLocaleDateString()}
          </Text>
        </View>
        <PdfFooter pageNumber={1} companyName={companyName} />
      </Page>

      {/* Operational Table */}
      <Page size="A4" style={styles.page} orientation="landscape">
        <Text style={styles.title}>Operational Blueprint</Text>
        
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { width: "10%" }]}>FUNCTION</Text>
            <Text style={[styles.headerCell, { width: "8%" }]}>PROVIDER</Text>
            <Text style={[styles.headerCell, { width: "6%" }]}>PRIORITY</Text>
            <Text style={[styles.headerCell, { width: "7%" }]}>OFFERING</Text>
            <Text style={[styles.headerCell, { width: "6%" }]}>PII/PHI</Text>
            <Text style={[styles.headerCell, { width: "5%" }]}>Russell</Text>
            <Text style={[styles.headerCell, { width: "5%" }]}>SSO</Text>
            <Text style={[styles.headerCell, { width: "7%" }]}>Delivery</Text>
            <Text style={[styles.headerCell, { width: "6%" }]}>EOL/Data</Text>
            <Text style={[styles.headerCell, { width: "7%" }]}>Support</Text>
            <Text style={[styles.headerCell, { width: "8%" }]}>Contract</Text>
            <Text style={[styles.headerCell, { width: "8%", borderRightWidth: 0 }]}>Comments</Text>
          </View>

          {/* Table Rows */}
          {operationalData.map((row, index) => (
            <View key={index} style={[styles.tableRow, styles[row.rowColor]]}>
              <Text style={[styles.cell, styles.functionCell, { width: "10%" }]}>{row.function}</Text>
              <Text style={[styles.cell, { width: "8%" }]}>{row.provider}</Text>
              <Text style={[styles.cell, { width: "6%" }, row.priorityBg ? styles[row.priorityBg] : {}]}>{row.priority}</Text>
              <Text style={[styles.cell, { width: "7%" }]}>{row.offering}</Text>
              <Text style={[styles.cell, { width: "6%" }]}>{row.pii}</Text>
              <Text style={[styles.cell, { width: "5%" }]}>{row.russell}</Text>
              <Text style={[styles.cell, { width: "5%" }]}>{row.sso}</Text>
              <Text style={[styles.cell, { width: "7%" }]}>{row.delivery}</Text>
              <Text style={[styles.cell, { width: "6%" }]}>{row.eol_eos}</Text>
              <Text style={[styles.cell, { width: "7%" }]}>{row.support}</Text>
              <Text style={[styles.cell, { width: "8%" }]}>{row.contract}</Text>
              <Text style={[styles.cell, { width: "8%", borderRightWidth: 0 }]}></Text>
            </View>
          ))}
        </View>

        {/* Legend */}
        <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 15, height: 15, backgroundColor: "#DC2626", marginRight: 3 }} />
            <Text style={{ fontSize: 7 }}>Critical Gap</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 15, height: 15, backgroundColor: "#F97316", marginRight: 3 }} />
            <Text style={{ fontSize: 7 }}>Major Gap</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 15, height: 15, backgroundColor: "#FCD34D", marginRight: 3 }} />
            <Text style={{ fontSize: 7 }}>Minor Gap</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 15, height: 15, backgroundColor: "#9CA3AF", marginRight: 3 }} />
            <Text style={{ fontSize: 7 }}>Information Only</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 15, height: 15, backgroundColor: "#6B7280", marginRight: 3 }} />
            <Text style={{ fontSize: 7 }}>Missing Info</Text>
          </View>
        </View>

        <PdfFooter pageNumber={2} companyName={companyName} />
      </Page>
    </Document>
  );
};

export default OperationalDocument;
