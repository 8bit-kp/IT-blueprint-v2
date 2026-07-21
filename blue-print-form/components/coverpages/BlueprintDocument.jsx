// components/coverpages/BlueprintDocument.jsx
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
import CurrentState from "../CurrentState";

const logo = "/coverlogo.png";
const consltekLogo = "/conslteklogo.png";

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

// Base styles shared across pages
const base = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 72,
    paddingHorizontal: 56,
    backgroundColor: "#FFFFFF",
  },
  h1: { fontSize: 28, color: C.primary, fontWeight: 700, marginBottom: 8 },
  p: { fontSize: 11, color: C.gray700, lineHeight: 1.4 },
  small: { fontSize: 10, color: C.gray600 },
  tealRule: { height: 2, backgroundColor: C.teal, opacity: 0.85, marginBottom: 14 },
  lightRule: { height: 1, backgroundColor: C.lightLine, marginBottom: 8 },
});

// Last-page styles
const lastPageStyles = StyleSheet.create({
  pageContainer: {
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  contentSpacer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 56,
    paddingTop: 48,
  },
  heading: {
    fontSize: 28,
    color: C.primary,
    fontWeight: 700,
    marginBottom: 16,
    textAlign: "center",
  },
  body: {
    fontSize: 11,
    color: C.gray700,
    lineHeight: 1.55,
    textAlign: "center",
    marginBottom: 12,
    maxWidth: "80%",
  },
  advisorBadge: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: C.softBg,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: C.teal,
  },
  advisorBadgeText: {
    fontSize: 11,
    color: C.primary,
    fontWeight: 700,
    textAlign: "center",
  },
  techSimplifiedContainer: { alignItems: "center", marginBottom: 20 },
  techSimplifiedText: { fontSize: 42, fontWeight: 700, color: C.lightLine },
  footerBanner: {
    backgroundColor: C.primary,
    paddingVertical: 30,
    paddingHorizontal: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  footerColumn: { flexDirection: "column", width: "30%" },
  footerColumnWide: { flexDirection: "column", width: "38%" },
  footerHeader: { color: "#FFFFFF", fontSize: 10, fontWeight: 700, marginBottom: 6 },
  footerText: { color: "#FFFFFF", fontSize: 9, lineHeight: 1.5 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 2 },
});

// ============ HELPERS ============
const safeVal = (val) => (val || "—");

const deriveDeploymentModel = (data) => {
  if (!data) return "—";
  const onPrem = data.hasOnPremDC === "Yes";
  const cloud = data.hasCloudInfra === "Yes";
  if (onPrem && cloud) return "Hybrid";
  if (cloud) return "Cloud";
  if (onPrem) return "On-premise";
  return "—";
};

// ============ REUSABLE COMPONENTS ============

// Labeled key-value row used in Executive Summary sections
const InfoRow = ({ label, value }) => (
  <View style={{ flexDirection: "row", marginBottom: 5, alignItems: "flex-start" }}>
    <Text style={{ fontSize: 10.5, color: C.gray500, width: 160, flexShrink: 0 }}>{label}</Text>
    <Text style={{ fontSize: 10.5, color: C.gray700, flex: 1, fontWeight: 700 }}>{value || "—"}</Text>
  </View>
);

// Section block with title + light rule divider
const SectionBlock = ({ title, children }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={{ fontSize: 13, color: C.primary, fontWeight: 700, marginBottom: 6 }}>{title}</Text>
    <View style={base.lightRule} />
    {children}
  </View>
);

// Snapshot card used in the Environment Snapshot grid
const SnapshotCard = ({ label, value }) => (
  <View style={{
    width: "47%",
    marginBottom: 12,
    padding: 10,
    backgroundColor: C.softBg,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: C.teal,
  }}>
    <Text style={{ fontSize: 9.5, color: C.gray500, marginBottom: 3 }}>{label.toUpperCase()}</Text>
    <Text style={{ fontSize: 12, color: C.primary, fontWeight: 700 }}>{value || "—"}</Text>
  </View>
);

// Bulleted row used in Assessment Coverage
const CoverageRow = ({ area, description }) => (
  <View style={{ flexDirection: "row", marginBottom: 10, alignItems: "flex-start" }}>
    <View style={{
      width: 6, height: 6, borderRadius: 3,
      backgroundColor: C.teal, marginTop: 3, marginRight: 10, flexShrink: 0,
    }} />
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 11, color: C.gray700, fontWeight: 700 }}>{area}</Text>
      <Text style={{ fontSize: 10.5, color: C.gray600, lineHeight: 1.4 }}>{description}</Text>
    </View>
  </View>
);

// TOC row with dotted leader
const TOCRow = ({ label, page }) => (
  <View style={{
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "baseline", marginBottom: 10,
  }}>
    <Text style={{ fontSize: 12, color: C.gray700 }}>{label}{"  "}{".".repeat(80)}</Text>
    <Text style={{ fontSize: 12, color: C.gray700 }}>{page}</Text>
  </View>
);

// ============ 1) COVER PAGE ============
const CoverPage = ({ companyName = "—", dateStr = "" }) => (
  <Page size="A4" style={[base.page, { justifyContent: "center", alignItems: "center" }]}>
    <View style={{ alignItems: "center", textAlign: "center" }}>
      <Image src={logo} style={{ width: 270, marginBottom: 10 }} />
      <View style={{ height: 2, width: 200, backgroundColor: C.teal, opacity: 0.8, marginBottom: 40 }} />
      <Text style={{ fontSize: 34, color: C.primary, fontWeight: 700, marginBottom: 40 }}>
        Current State Assessment
      </Text>
      <Text style={{ fontSize: 11, color: C.teal, letterSpacing: 0.5, marginBottom: 10 }}>{dateStr}</Text>
      <Text style={{ fontSize: 10, color: C.accent, fontWeight: 700, marginBottom: 6 }}>PREPARED FOR:</Text>
      <Text style={{ fontSize: 16, color: C.gray700, fontWeight: 700 }}>{companyName}</Text>
    </View>

    {/* Decorative background shapes */}
    <View style={{
      position: "absolute", left: -120, top: 140,
      width: 300, height: 300, borderRadius: 150, backgroundColor: C.softBg,
    }} />
    <View style={{
      position: "absolute", bottom: -60, left: -30,
      width: 140, height: 140, borderTopLeftRadius: 140,
      backgroundColor: C.primary, opacity: 0.12,
    }} />

    <PdfFooter companyName={companyName} logoSrc={consltekLogo} documentLabel="Current State Assessment" />
  </Page>
);

// ============ 2) TABLE OF CONTENTS ============
const TableOfContents = ({ companyName = "—" }) => (
  <Page size="A4" style={base.page}>
    <Text style={{ fontSize: 24, color: C.teal, fontWeight: 700, marginBottom: 18 }}>
      Table of Contents
    </Text>
    <TOCRow label="EXECUTIVE SUMMARY" page="3" />
    <TOCRow label="ENVIRONMENT SNAPSHOT" page="4" />
    <TOCRow label="CURRENT STATE" page="5" />
    <TOCRow label="NEXT STEPS" page="6" />
    <PdfFooter companyName={companyName} logoSrc={consltekLogo} documentLabel="Current State Assessment" />
  </Page>
);

// ============ 3) EXECUTIVE SUMMARY (DATA-DRIVEN) ============
const ExecutiveSummary = ({ companyName = "—", data = {}, dateStr = "" }) => {
  const deploymentModel = deriveDeploymentModel(data);

  const workforceParts = [];
  if (data.remotePercentage) workforceParts.push(`${data.remotePercentage}% remote`);
  if (data.contractorPercentage) workforceParts.push(`${data.contractorPercentage}% contractors`);
  const workforceStr = workforceParts.length ? workforceParts.join(", ") : "—";

  const powerParts = [
    data.hasUPS === "Yes" ? "UPS" : null,
    data.hasGenerator === "Yes" ? "Generator" : null,
  ].filter(Boolean);
  const powerStr = powerParts.length ? powerParts.join(", ") : "None recorded";

  const challenges = (data.operationalChallenges || []).join(", ") || "—";

  return (
    <Page size="A4" style={base.page}>
      <Text style={[base.h1, { marginBottom: 4 }]}>Executive Summary</Text>
      <View style={base.tealRule} />

      <Text style={[base.p, { marginBottom: 16 }]}>
        {companyName} engaged Consltek to conduct a Current State Assessment of their IT
        environment. This report presents an objective inventory of infrastructure, security
        controls, applications, and business operations observed during the assessment.
        No recommendations, gap analysis, or risk scoring are included in this document.
      </Text>

      <SectionBlock title="Organization Profile">
        <InfoRow label="Company" value={data.companyName || companyName} />
        <InfoRow label="Industry" value={safeVal(data.industry)} />
        <InfoRow label="Employee Count" value={safeVal(data.employees)} />
        <InfoRow label="Workforce Mix" value={workforceStr} />
        <InfoRow label="Geographic Reach" value={safeVal(data.geographicReach)} />
        <InfoRow label="Office Locations" value={safeVal(data.numberOfLocations)} />
        <InfoRow label="Customer Type" value={safeVal(data.primaryCustomerType)} />
      </SectionBlock>

      <SectionBlock title="Infrastructure Overview">
        <InfoRow label="Deployment Model" value={deploymentModel} />
        <InfoRow label="Data Centres" value={safeVal(data.hasDataCenters)} />
        <InfoRow label="Cloud Infrastructure" value={safeVal(data.hasCloudInfra)} />
        <InfoRow label="Physical Offices" value={safeVal(data.physicalOffices)} />
        <InfoRow label="Power Resilience" value={powerStr} />
      </SectionBlock>

      <SectionBlock title="Business Operations Overview">
        <InfoRow label="Primary Function" value={safeVal(data.primaryBusinessFunction)} />
        <InfoRow label="Main Products / Services" value={safeVal(data.mainProductsServices)} />
        <InfoRow label="Top Business Priority" value={safeVal(data.highestBusinessPriority)} />
        <InfoRow label="Operational Challenges" value={challenges} />
      </SectionBlock>

      <View style={{ borderTopWidth: 1, borderTopColor: C.lightLine, paddingTop: 8, marginTop: 4 }}>
        <Text style={[base.small, { color: C.gray500 }]}>Assessment Date: {dateStr || "—"}</Text>
      </View>

      <PdfFooter companyName={companyName} logoSrc={consltekLogo} documentLabel="Current State Assessment" />
    </Page>
  );
};

// ============ 4) ENVIRONMENT SNAPSHOT + ASSESSMENT COVERAGE ============
const EnvironmentSnapshot = ({ companyName = "—", data = {} }) => {
  const deploymentModel = deriveDeploymentModel(data);

  return (
    <Page size="A4" style={base.page}>
      <Text style={[base.h1, { marginBottom: 4 }]}>Environment Snapshot</Text>
      <View style={base.tealRule} />

      {/* 2-column snapshot card grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 22 }}>
        <SnapshotCard label="Company Size" value={data.employees} />
        <SnapshotCard label="Industry" value={data.industry} />
        <SnapshotCard label="Deployment Model" value={deploymentModel} />
        <SnapshotCard label="Office Locations" value={data.numberOfLocations} />
        <SnapshotCard label="Customer Type" value={data.primaryCustomerType} />
        <SnapshotCard label="Geographic Reach" value={data.geographicReach} />
      </View>

      {/* Assessment Coverage */}
      <Text style={{ fontSize: 15, color: C.primary, fontWeight: 700, marginBottom: 6 }}>
        Assessment Coverage
      </Text>
      <View style={base.lightRule} />
      <Text style={[base.p, { marginBottom: 12 }]}>
        This assessment covers the following areas of the IT environment:
      </Text>

      <CoverageRow
        area="Infrastructure & Facilities"
        description="Physical offices, data centres, power resilience (UPS, generator), and network connectivity — WAN links, switching, routing, wireless, cloud, and virtualisation."
      />
      <CoverageRow
        area="Security Controls"
        description="Sixteen technical security controls (NGFW, EDR, MFA, IAM, SOC-SIEM, DLP, CASB, and more) plus ten governance and administrative controls (policies, employee training, BCDR plan, penetration testing)."
      />
      <CoverageRow
        area="Application Portfolio"
        description="Business applications grouped by category (productivity, finance, HRIT, payroll, and any custom categories added during the assessment) including delivery model and business priority."
      />
      <CoverageRow
        area="Business Operations"
        description="Operational context: primary business function, customer type, geographic reach, business criticality, top strategic priorities, and key operational challenges."
      />

      <PdfFooter companyName={companyName} logoSrc={consltekLogo} documentLabel="Current State Assessment" />
    </Page>
  );
};

// ============ 5) LAST PAGE — ADVISOR REVIEW CLOSING ============
const LastPage = () => (
  <Page size="A4" style={lastPageStyles.pageContainer}>
    <View style={lastPageStyles.contentSpacer}>
      <Text style={lastPageStyles.heading}>Next Steps</Text>

      <Text style={lastPageStyles.body}>
        This report establishes the documented baseline for your IT environment. The findings
        presented here form the foundation for the next stage of your engagement with Consltek.
      </Text>

      <Text style={lastPageStyles.body}>
        Your Consltek advisor will use this assessment to prepare your Assessment with
        Remediation Plan — a prioritised roadmap that addresses identified gaps and aligns
        remediation activities to your business priorities and risk tolerance.
      </Text>

      <View style={lastPageStyles.advisorBadge}>
        <Text style={lastPageStyles.advisorBadgeText}>
          Next Deliverable: Assessment with Remediation Plan
        </Text>
      </View>
    </View>

    <View style={lastPageStyles.techSimplifiedContainer}>
      <Text style={lastPageStyles.techSimplifiedText}>Technology Simplified</Text>
    </View>

    <View style={lastPageStyles.footerBanner}>
      <View style={lastPageStyles.footerColumn}>
        <Text style={lastPageStyles.footerHeader}>Headquarters</Text>
        <Text style={lastPageStyles.footerText}>
          2010 Crow Canyon Pl, STE 100, San Ramon, CA-94583
        </Text>
      </View>
      <View style={lastPageStyles.footerColumnWide}>
        <Text style={lastPageStyles.footerHeader}>Technology Centre</Text>
        <Text style={lastPageStyles.footerText}>
          18, 4th 'C' Cross, 1st Main Road, Koramangala Industrial Layout, 5th Block,
          Bengaluru, Karnataka 560095
        </Text>
      </View>
      <View style={lastPageStyles.footerColumn}>
        <Text style={lastPageStyles.footerHeader}>Contact</Text>
        <View style={lastPageStyles.contactRow}>
          <Text style={lastPageStyles.footerText}>P: 1-925-233-3366   </Text>
          <Text style={lastPageStyles.footerText}>E: sales@consitek.com</Text>
        </View>
        <Text style={lastPageStyles.footerText}>W: https://www.consitek.com</Text>
      </View>
    </View>
  </Page>
);

// ============ WRAPPER DOCUMENT ============
const BlueprintDocument = ({
  companyName = "—",
  preparedDate = new Date(),
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
      <ExecutiveSummary companyName={companyName} data={currentStateData || {}} dateStr={dateStr} />
      <EnvironmentSnapshot companyName={companyName} data={currentStateData || {}} />
      <CurrentState title="Current State" data={currentStateData} />
      <LastPage />
    </Document>
  );
};

export default BlueprintDocument;
