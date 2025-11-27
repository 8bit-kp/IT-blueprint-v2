// src/pdfs/BlueprintDocument.jsx
import React from "react";
import PdfFooter from "./pdfFooter";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// bring your existing CurrentState page (portrait, one-page fit)
import CurrentState from "../CurrentState";
import logo from "../../../public/coverlogo.png";

// Brand colors
const C = {
  primary: "#15587B",
  accent: "#935010",
  teal: "#34808A",
  gray700: "#374151",
  gray600: "#4B5563",
  gray500: "#6B7280",
  lightLine: "#D1D5DB",
  softBg: "#F5F7FA",
};

const base = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 72,
    paddingHorizontal: 56,
    backgroundColor: "#FFFFFF",
  },
  h1: { fontSize: 28, color: C.primary, fontWeight: 700, marginBottom: 8 },
  h2: { fontSize: 18, color: C.primary, fontWeight: 700, marginBottom: 8 },
  h3: { fontSize: 13, color: C.gray700, fontWeight: 700, marginBottom: 6 },
  p: { fontSize: 11, color: C.gray700, lineHeight: 1.4 },
  small: { fontSize: 10, color: C.gray600 },
  rule: { height: 1, backgroundColor: C.lightLine, marginVertical: 10 },
});

// === Styles specifically for the Last Page ===
const lastPageStyles = StyleSheet.create({
  // Main container: Flex column, takes full height, NO default padding to allow full-width footer
  pageContainer: {
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  // The middle section that holds centered text, takes up available space
  contentSpacer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  endOfDocText: {
    fontSize: 24,
    color: C.primary,
    fontWeight: 700,
  },
  // "Technology Simplified" text container
  techSimplifiedContainer: {
    alignItems: "center",
    marginBottom: 20, // Space above the footer banner
  },
  techSimplifiedText: {
    fontSize: 42, // Very large
    fontWeight: 700,
    color: C.lightLine, // Very light gray
  },
  // The full-width teal footer banner
  footerBanner: {
    backgroundColor: C.primary, // Using primary brand color for banner background
    paddingVertical: 30,
    paddingHorizontal: 56, // Left/Right padding to match rest of document margins
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  footerColumn: {
    flexDirection: "column",
    width: "30%", // Ensure columns don't overlap
  },
  // Wider column for the long Bangalore address
  footerColumnWide: {
    flexDirection: "column",
    width: "38%",
  },
  footerHeader: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 6,
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 9,
    lineHeight: 1.5,
    fontFamily: "Helvetica", // Ensure clean sans-serif look
  },
  contactRow: {
     flexDirection: 'row',
     flexWrap: 'wrap',
      marginBottom: 2,
  }
});


// ============ 1) COVER PAGE ============
const CoverPage = ({ companyName = "—", dateStr = "" }) => (
  <Page
    size="A4"
    style={[base.page, { justifyContent: "center", alignItems: "center" }]}
  >
    {/* Centered Container */}
    <View style={{ alignItems: "center", textAlign: "center" }}>
      {/* Logo & tagline */}
      <Image src={logo} style={{ width: 270, marginBottom: 10 }} />

      {/* Horizontal line */}
      <View
        style={{
          height: 2,
          width: 200,
          backgroundColor: C.teal,
          opacity: 0.8,
          marginBottom: 40,
        }}
      />

      {/* Title */}
      <Text
        style={{
          fontSize: 34,
          color: C.primary,
          fontWeight: 700,
          marginBottom: 40,
        }}
      >
        IT Blueprint
      </Text>

      {/* Date and company */}
      <Text
        style={{
          fontSize: 11,
          color: C.teal,
          letterSpacing: 0.5,
          marginBottom: 10,
        }}
      >
        {dateStr}
      </Text>
      <Text
        style={{
          fontSize: 10,
          color: C.accent,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        PREPARED FOR:
      </Text>
      <Text style={{ fontSize: 16, color: C.gray700, fontWeight: 700 }}>
        {companyName}
      </Text>
    </View>

    {/* Optional subtle decorative background shapes */}
    <View
      style={{
        position: "absolute",
        left: -120,
        top: 140,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: C.softBg,
      }}
    />
    <View
      style={{
        position: "absolute",
        bottom: -60,
        left: -30,
        width: 140,
        height: 140,
        borderTopLeftRadius: 140,
        backgroundColor: C.primary,
        opacity: 0.12,
      }}
    />
    <PdfFooter companyName={companyName} />
  </Page>
);

// ============ 2) TABLE OF CONTENTS ============
const TOCRow = ({ label, page }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 6,
    }}
  >
    <Text style={{ fontSize: 12, color: C.gray700 }}>
      {label}
      {" ".repeat(2)}
      {".".repeat(80)}
    </Text>
    <Text style={{ fontSize: 12, color: C.gray700 }}>{page}</Text>
  </View>
);

const TableOfContents = ({ companyName = "—" }) => (
  <Page size="A4" style={base.page}>
    <Text
      style={{
        fontSize: 24,
        color: C.teal,
        fontWeight: 700,
        marginBottom: 18,
      }}
    >
      Table of Contents
    </Text>

    {/* Updated Page Numbers since Doc Info is removed */}
    <TOCRow label="EXECUTIVE SUMMARY" page="3" />
    <TOCRow label="CURRENT STATE" page="4" />
    <TOCRow label="SECURITY BLUEPRINT" page="5" />
    <TOCRow label="OPERATIONAL BLUEPRINT" page="6" />
    <TOCRow label="FINANCIAL BLUEPRINT" page="7" />

    <View style={{ marginTop: 18 }}>
      <TOCRow label="Technical Controls" page="5" />
      <TOCRow label="Administrative Controls" page="6" />
    </View>
    <PdfFooter companyName={companyName} />
  </Page>
);

// ============ 3) EXECUTIVE SUMMARY ============
const Bullet = ({ children }) => (
  <View style={{ flexDirection: "row", marginBottom: 6 }}>
    <Text style={{ fontSize: 12, marginRight: 6 }}>•</Text>
    <Text style={{ fontSize: 12, color: C.gray700 }}>{children}</Text>
  </View>
);

const ExecutiveSummary = ({ companyName = "—" }) => (
  <Page size="A4" style={base.page}>
    <Text style={[base.h1, { marginBottom: 14 }]}>Executive Summary</Text>
    <Text style={[base.p, { marginBottom: 18 }]}>
      IT Blueprint is a ConsItek Signature System that gives IT executives a
      bird’s-eye view of their IT operations without getting into minute
      details. It provides a summary of critical infrastructure, security
      posture, applications, and financials. The Blueprint is divided into four
      sections.
    </Text>

    <Bullet>Current State</Bullet>
    <Bullet>Security Blueprint</Bullet>
    <Bullet>Operations Blueprint</Bullet>
    <Bullet>Financial Blueprint</Bullet>

    <View style={{ height: 18 }} />

    <Text style={base.h2}>Current State</Text>
    <Text style={[base.p, { marginBottom: 10 }]}>
      Summary of infrastructure, security tools, and applications currently in
      use.
    </Text>

    <Text style={base.h2}>Security Blueprint</Text>
    <Text style={[base.p, { marginBottom: 10 }]}>
      How your infrastructure, tools, and applications stack against best
      practices.
    </Text>

    <Text style={base.h2}>Operational Blueprint</Text>
    <Text style={[base.p, { marginBottom: 10 }]}>
      Potential areas for improvement in your operations.
    </Text>

    <Text style={base.h2}>Financial Blueprint</Text>
    <Text style={base.p}>Overall summary of your IT spend.</Text>
    <PdfFooter companyName={companyName} />
  </Page>
);

// ============ last) LAST PAGE (REDESIGNED) ============
const LastPage = () => (
  // Using custom pageContainer style instead of base.page to allow full-width footer
  <Page size="A4" style={lastPageStyles.pageContainer}>
    
    {/* Spacer to center the middle content vertically */}
    <View style={lastPageStyles.contentSpacer}>
       <Text style={lastPageStyles.endOfDocText}>End of Document</Text>
    </View>

    {/* Large light gray text above footer */}
    <View style={lastPageStyles.techSimplifiedContainer}>
      <Text style={lastPageStyles.techSimplifiedText}>Technology Simplified</Text>
    </View>

    {/* Full Width Footer Banner with Contact Info */}
    <View style={lastPageStyles.footerBanner}>
      
      {/* Column 1: Headquarters */}
      <View style={lastPageStyles.footerColumn}>
        <Text style={lastPageStyles.footerHeader}>Headquarters</Text>
        <Text style={lastPageStyles.footerText}>
          2010 Crow Canyon Pl, STE 100, San Ramon, CA-94583
        </Text>
      </View>

      {/* Column 2: Technology Centre (Wider for long address) */}
      <View style={lastPageStyles.footerColumnWide}>
        <Text style={lastPageStyles.footerHeader}>Technology Centre</Text>
        <Text style={lastPageStyles.footerText}>
          18, 4th 'C' Cross, 1st Main Road, Koramangala Industrial Layout, 5th Block,
          Bengaluru, Karnataka 560095
        </Text>
      </View>

      {/* Column 3: Contact details */}
      <View style={lastPageStyles.footerColumn}>
        <Text style={lastPageStyles.footerHeader}>Contact</Text>
        {/* Phone and Email on one line if space permits, wrapping if needed */}
        <View style={lastPageStyles.contactRow}>
           <Text style={lastPageStyles.footerText}>P: 1-925-233-3366   </Text>
           <Text style={lastPageStyles.footerText}>E: sales@consitek.com</Text>
        </View>
        <Text style={lastPageStyles.footerText}>W: https://www.consitek.com</Text>
      </View>

    </View>
  </Page>
);

// ============ 4) WRAPPER DOCUMENT ============
// Props let you feed form data (company name, date, etc.)
const BlueprintDocument = ({
  companyName = "—",
  preparedDate = new Date(),
//   author = "Rajesh Haridas",
  currentStateData,
}) => {
  const dateStr = preparedDate
    ? preparedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      })
    : "";

  return (
    <Document>
      <CoverPage companyName={companyName} dateStr={dateStr} />
      <TableOfContents companyName={companyName} />
      {/* DocumentInformation page removed */}
      <ExecutiveSummary companyName={companyName} />
      {/* Your existing Current State page (portrait, single page) */}
      <CurrentState title="Current State" data={currentStateData} />
      <LastPage />
    </Document>
  );
};

export default BlueprintDocument;