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
  sectionTitle: {
    fontSize: 14,
    color: "#15587B",
    fontFamily: "Times-Roman",
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: "#7BC5C5",
    padding: 6,
    fontWeight: "bold",
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
    fontSize: 8,
    color: "#FFFFFF",
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#FFFFFF",
  },
  cell: {
    fontSize: 7,
    padding: 5,
    textAlign: "left",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  cellCenter: {
    textAlign: "center",
  },
  bgLightBlue: { backgroundColor: "#E0F2F7" },
  blackBox: { backgroundColor: "#000000", height: 20 },
  totalRow: { backgroundColor: "#D1E7F0", fontWeight: "bold" },
});

const FinancialDocument = ({ companyName, preparedDate, formData }) => {
  // Demo data matching your image
  const infrastructureData = [
    { item: "Generator", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "UPS", annualCost: "", contractType: "Perpetual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "WAN1 - BlueBird", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "WAN2 - Spectrum", annualCost: "", contractType: "Multi-year", upcomingExpense: "$23,000", expenseType: "", potentialSavings: "", comments: "Contract can be renegotiated. Paying higher than market price" },
    { item: "Routing and Switching", annualCost: "", contractType: "Perpetual", upcomingExpense: "$15,000", expenseType: "Annual Expense", potentialSavings: "", comments: "Support contract is necessary" },
    { item: "Wireless", annualCost: "", contractType: "Perpetual", upcomingExpense: "$5,000", expenseType: "Annual Expense", potentialSavings: "", comments: "Support contract is necessary" },
    { item: "Baremetal", annualCost: "", contractType: "Perpetual", upcomingExpense: "$60,000", expenseType: "One-time Expense", potentialSavings: "", comments: "Servers are past end of life" },
    { item: "Virtualization", annualCost: "", contractType: "Perpetual", upcomingExpense: "$20,000", expenseType: "One-time + Annual", potentialSavings: "", comments: "Vmware replacement is necessary" },
    { item: "Servers", annualCost: "", contractType: "Perpetual", upcomingExpense: "$0", expenseType: "", potentialSavings: "", comments: "" },
  ];

  const securityData = [
    { item: "Cato", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "AD", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Azure AD", annualCost: "", contractType: "Monthly", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "ClearPass", annualCost: "", contractType: "Perpetual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Microsoft Authenticator", annualCost: "", contractType: "Ongoing/Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "DUO", annualCost: "", contractType: "Monthly", upcomingExpense: "", expenseType: "", potentialSavings: "$75,000", comments: "E5 licenses already provide Anti-malware functionality" },
    { item: "CrowdStrike", annualCost: "", contractType: "Annual", upcomingExpense: "$23,000", expenseType: "", potentialSavings: "", comments: "Optimization can reduce cost significantly" },
    { item: "AWS", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
  ];

  const applicationsData = [
    { item: "Intermediate", annualCost: "", contractType: "Multi-year", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Office365", annualCost: "", contractType: "No-contract", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Canvas w/ Support", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Paycom", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "ShareDrive (Network Drives)", annualCost: "", contractType: "Perpetual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "Annual Expense $13,000 Redundant licenses. Not required anymore" },
    { item: "MS Dynamics", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Anthology", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Accruent", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Papercutt", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Adeante", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Library", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "DCLC", annualCost: "", contractType: "", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Google MS", annualCost: "", contractType: "", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Moom", annualCost: "", contractType: "Annual", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Ring Central", annualCost: "", contractType: "", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Microsoft Enterprise Agreement", annualCost: "", contractType: "", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
  ];

  const operationsData = [
    { item: "Staffing Cost", annualCost: "", contractType: "", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Managed Services Cost", annualCost: "", contractType: "", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "Security Services Cost", annualCost: "", contractType: "", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "RMM", annualCost: "", contractType: "", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "RMM", annualCost: "", contractType: "", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
    { item: "PDQ", annualCost: "", contractType: "", upcomingExpense: "", expenseType: "", potentialSavings: "", comments: "" },
  ];

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginTop: 200, alignItems: "center" }}>
          <Text style={[styles.title, { fontSize: 32, marginBottom: 30 }]}>Financial Blueprint</Text>
          <Text style={{ fontSize: 12, color: "#666666" }}>
            Prepared for {companyName || "Sample Company"}
          </Text>
          <Text style={{ fontSize: 10, color: "#999999", marginTop: 10 }}>
            {preparedDate ? preparedDate.toLocaleDateString() : new Date().toLocaleDateString()}
          </Text>
        </View>
        <PdfFooter pageNumber={1} companyName={companyName} />
      </Page>

      {/* Financial Table */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Financial Blueprint</Text>

        {/* Infrastructure Section */}
        <Text style={styles.sectionTitle}>Infrastructure</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { width: "15%" }]}>Item</Text>
            <Text style={[styles.headerCell, { width: "12%" }]}>Annual Cost</Text>
            <Text style={[styles.headerCell, { width: "13%" }]}>Contract Type</Text>
            <Text style={[styles.headerCell, { width: "13%" }]}>Upcoming Expense</Text>
            <Text style={[styles.headerCell, { width: "12%" }]}>Expense Type</Text>
            <Text style={[styles.headerCell, { width: "15%" }]}>Potential Annual Savings</Text>
            <Text style={[styles.headerCell, { width: "20%", borderRightWidth: 0 }]}>Comments</Text>
          </View>

          {infrastructureData.map((row, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.bgLightBlue : {}]}>
              <Text style={[styles.cell, { width: "15%" }]}>{row.item}</Text>
              <Text style={[styles.cell, { width: "12%" }, styles.blackBox]}></Text>
              <Text style={[styles.cell, { width: "13%" }]}>{row.contractType}</Text>
              <Text style={[styles.cell, { width: "13%" }]}>{row.upcomingExpense}</Text>
              <Text style={[styles.cell, { width: "12%" }]}>{row.expenseType}</Text>
              <Text style={[styles.cell, { width: "15%" }]}>{row.potentialSavings}</Text>
              <Text style={[styles.cell, { width: "20%", borderRightWidth: 0, fontSize: 6 }]}>{row.comments}</Text>
            </View>
          ))}

          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={[styles.cell, { width: "15%" }]}>Total</Text>
            <Text style={[styles.cell, { width: "12%" }]}></Text>
            <Text style={[styles.cell, { width: "13%" }]}></Text>
            <Text style={[styles.cell, { width: "13%" }]}></Text>
            <Text style={[styles.cell, { width: "12%" }]}></Text>
            <Text style={[styles.cell, { width: "15%" }]}></Text>
            <Text style={[styles.cell, { width: "20%", borderRightWidth: 0 }]}></Text>
          </View>
        </View>

        {/* Security Section */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Security</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { width: "15%" }]}>Item</Text>
            <Text style={[styles.headerCell, { width: "12%" }]}>Annual Cost</Text>
            <Text style={[styles.headerCell, { width: "13%" }]}>Contract Type</Text>
            <Text style={[styles.headerCell, { width: "13%" }]}>Upcoming Expense</Text>
            <Text style={[styles.headerCell, { width: "12%" }]}>Expense Type</Text>
            <Text style={[styles.headerCell, { width: "15%" }]}>Potential Annual Savings</Text>
            <Text style={[styles.headerCell, { width: "20%", borderRightWidth: 0 }]}>Comments</Text>
          </View>

          {securityData.map((row, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.bgLightBlue : {}]}>
              <Text style={[styles.cell, { width: "15%" }]}>{row.item}</Text>
              <Text style={[styles.cell, { width: "12%" }, styles.blackBox]}></Text>
              <Text style={[styles.cell, { width: "13%" }]}>{row.contractType}</Text>
              <Text style={[styles.cell, { width: "13%" }]}>{row.upcomingExpense}</Text>
              <Text style={[styles.cell, { width: "12%" }]}>{row.expenseType}</Text>
              <Text style={[styles.cell, { width: "15%" }]}>{row.potentialSavings}</Text>
              <Text style={[styles.cell, { width: "20%", borderRightWidth: 0, fontSize: 6 }]}>{row.comments}</Text>
            </View>
          ))}

          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={[styles.cell, { width: "15%" }]}>Total</Text>
            <Text style={[styles.cell, { width: "12%" }]}></Text>
            <Text style={[styles.cell, { width: "13%" }]}></Text>
            <Text style={[styles.cell, { width: "13%" }]}></Text>
            <Text style={[styles.cell, { width: "12%" }]}></Text>
            <Text style={[styles.cell, { width: "15%" }]}></Text>
            <Text style={[styles.cell, { width: "20%", borderRightWidth: 0 }]}></Text>
          </View>
        </View>

        <PdfFooter pageNumber={2} companyName={companyName} />
      </Page>

      {/* Applications Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Financial Blueprint (continued)</Text>

        {/* Applications Section */}
        <Text style={styles.sectionTitle}>Applications</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { width: "15%" }]}>Item</Text>
            <Text style={[styles.headerCell, { width: "12%" }]}>Annual Cost</Text>
            <Text style={[styles.headerCell, { width: "13%" }]}>Contract Type</Text>
            <Text style={[styles.headerCell, { width: "13%" }]}>Upcoming Expense</Text>
            <Text style={[styles.headerCell, { width: "12%" }]}>Expense Type</Text>
            <Text style={[styles.headerCell, { width: "15%" }]}>Potential Annual Savings</Text>
            <Text style={[styles.headerCell, { width: "20%", borderRightWidth: 0 }]}>Comments</Text>
          </View>

          {applicationsData.map((row, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.bgLightBlue : {}]}>
              <Text style={[styles.cell, { width: "15%" }]}>{row.item}</Text>
              <Text style={[styles.cell, { width: "12%" }, styles.blackBox]}></Text>
              <Text style={[styles.cell, { width: "13%" }]}>{row.contractType}</Text>
              <Text style={[styles.cell, { width: "13%" }]}>{row.upcomingExpense}</Text>
              <Text style={[styles.cell, { width: "12%" }]}>{row.expenseType}</Text>
              <Text style={[styles.cell, { width: "15%" }]}>{row.potentialSavings}</Text>
              <Text style={[styles.cell, { width: "20%", borderRightWidth: 0, fontSize: 6 }]}>{row.comments}</Text>
            </View>
          ))}

          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={[styles.cell, { width: "15%" }]}>Total</Text>
            <Text style={[styles.cell, { width: "12%" }]}></Text>
            <Text style={[styles.cell, { width: "13%" }]}></Text>
            <Text style={[styles.cell, { width: "13%" }]}></Text>
            <Text style={[styles.cell, { width: "12%" }]}></Text>
            <Text style={[styles.cell, { width: "15%" }]}></Text>
            <Text style={[styles.cell, { width: "20%", borderRightWidth: 0 }]}></Text>
          </View>
        </View>

        {/* Operations Section */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Operations</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { width: "15%" }]}>Item</Text>
            <Text style={[styles.headerCell, { width: "12%" }]}>Annual Cost</Text>
            <Text style={[styles.headerCell, { width: "13%" }]}>Contract Type</Text>
            <Text style={[styles.headerCell, { width: "13%" }]}>Upcoming Expense</Text>
            <Text style={[styles.headerCell, { width: "12%" }]}>Expense Type</Text>
            <Text style={[styles.headerCell, { width: "15%" }]}>Potential Annual Savings</Text>
            <Text style={[styles.headerCell, { width: "20%", borderRightWidth: 0 }]}>Comments</Text>
          </View>

          {operationsData.map((row, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.bgLightBlue : {}]}>
              <Text style={[styles.cell, { width: "15%" }]}>{row.item}</Text>
              <Text style={[styles.cell, { width: "12%" }, styles.blackBox]}></Text>
              <Text style={[styles.cell, { width: "13%" }]}>{row.contractType}</Text>
              <Text style={[styles.cell, { width: "13%" }]}>{row.upcomingExpense}</Text>
              <Text style={[styles.cell, { width: "12%" }]}>{row.expenseType}</Text>
              <Text style={[styles.cell, { width: "15%" }]}>{row.potentialSavings}</Text>
              <Text style={[styles.cell, { width: "20%", borderRightWidth: 0 }]}>{row.comments}</Text>
            </View>
          ))}

          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={[styles.cell, { width: "15%" }]}>Total</Text>
            <Text style={[styles.cell, { width: "12%" }]}></Text>
            <Text style={[styles.cell, { width: "13%" }]}></Text>
            <Text style={[styles.cell, { width: "13%" }]}></Text>
            <Text style={[styles.cell, { width: "12%" }]}></Text>
            <Text style={[styles.cell, { width: "15%" }]}>$103,200</Text>
            <Text style={[styles.cell, { width: "20%", borderRightWidth: 0 }]}>$134,000</Text>
          </View>
        </View>

        <PdfFooter pageNumber={3} companyName={companyName} />
      </Page>
    </Document>
  );
};

export default FinancialDocument;
