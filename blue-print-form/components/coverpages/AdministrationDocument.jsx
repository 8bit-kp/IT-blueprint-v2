import React from "react";
import PdfFooter from "./pdfFooter";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 40,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    color: "#15587B",
    fontFamily: "Times-Roman",
    marginBottom: 30,
  },
  controlsGrid: {
    flexDirection: "column",
    gap: 8,
  },
  controlRow: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  controlLabel: {
    width: "60%",
    backgroundColor: "#7BC5C5",
    padding: 12,
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
    justifyContent: "center",
  },
  controlValue: {
    width: "40%",
    padding: 12,
    fontSize: 12,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
  statusYes: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000",
  },
  statusPartial: {
    backgroundColor: "#F59E0B",
  },
  statusNo: {
    backgroundColor: "#DC2626",
  },
});

const AdministrationDocument = ({ companyName, preparedDate, formData }) => {
  // Demo data matching your image
  const administrativeControls = [
    { label: "Security Steering Committee", value: "Yes", status: "statusYes" },
    { label: "Written Security Policy", value: "Yes", status: "statusYes" },
    { label: "Employee Security Training", value: "Partial", status: "statusPartial" },
    { label: "BCDR Plan", value: "Partial", status: "statusPartial" },
    { label: "Cybersecurity Insurance", value: "Yes", status: "statusYes" },
    { label: "Incident Response Plan", value: "Yes", status: "statusYes" },
    { label: "Backup Recovery Tested", value: "Yes", status: "statusYes" },
    { label: "Monthly Security Review Meeting", value: "No", status: "statusNo" },
    { label: "Change Control", value: "Yes", status: "statusYes" },
  ];

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginTop: 200, alignItems: "center" }}>
          <Text style={[styles.title, { fontSize: 32, marginBottom: 30 }]}>Administrative Controls</Text>
          <Text style={{ fontSize: 12, color: "#666666" }}>
            Prepared for {companyName || "Sample Company"}
          </Text>
          <Text style={{ fontSize: 10, color: "#999999", marginTop: 10 }}>
            {preparedDate ? preparedDate.toLocaleDateString() : new Date().toLocaleDateString()}
          </Text>
        </View>
        <PdfFooter pageNumber={1} companyName={companyName} />
      </Page>

      {/* Administrative Controls Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Administrative Controls</Text>

        <View style={styles.controlsGrid}>
          {administrativeControls.map((control, index) => (
            <View key={index} style={styles.controlRow}>
              <View style={styles.controlLabel}>
                <Text>{control.label}</Text>
              </View>
              <View style={[styles.controlValue, styles[control.status]]}>
                <Text>{control.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <PdfFooter pageNumber={2} companyName={companyName} />
      </Page>
    </Document>
  );
};

export default AdministrationDocument;
