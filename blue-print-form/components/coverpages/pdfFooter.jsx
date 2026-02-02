// src/pdfs/components/PdfFooter.jsx
import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const COLORS = {
  primary: "#15587B",
  accent: "#935010",
  text: "#6B7280",
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 40,
    right: 40,
    bottom: 18,
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftWrap: { flexDirection: "row", alignItems: "center" },
  tealBlock: { width: 28, height: 18, backgroundColor: COLORS.primary, marginRight: 8 },
  logo: { height: 18, width: 120, objectFit: "contain" },

  rightWrap: { flexDirection: "row", alignItems: "center" },
  rightText: { fontSize: 10.5, color: COLORS.accent, fontWeight: 700 },
  sep: { fontSize: 10.5, color: COLORS.accent, marginHorizontal: 6 },
  pageNum: { fontSize: 10.5, color: COLORS.accent, fontWeight: 700 },
});

/**
 * logoSrc can be a public path (e.g., "/conslteklogo.png") or imported asset.
 */
const PdfFooter = ({ companyName = "—", logoSrc = "/conslteklogo.png" }) => (
  <View style={styles.container} fixed>
    <View style={styles.leftWrap}>
      <View style={styles.tealBlock} />
      <Image src={logoSrc} style={styles.logo} />
    </View>

    <View style={styles.rightWrap}>
      <Text style={styles.rightText}>IT Blueprint for {companyName}</Text>
      <Text style={styles.sep}>|</Text>
      <Text style={styles.rightText}>PAGE</Text>
      <Text
        style={styles.pageNum}
        render={({ pageNumber }) => `  ${pageNumber}`}
      />
    </View>
  </View>
);

export default PdfFooter;
