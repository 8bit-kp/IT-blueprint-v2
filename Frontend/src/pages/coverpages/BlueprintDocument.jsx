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
import logo from "../../../public/coverlogo.png"

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

// ============ 1) COVER PAGE ============
const CoverPage = ({ companyName = "—", dateStr = "" }) => (
    <Page size="A4" style={[base.page, { justifyContent: "center", alignItems: "center" }]}>
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
            <Text style={{ fontSize: 34, color: C.primary, fontWeight: 700, marginBottom: 40 }}>
                IT Blueprint
            </Text>

            {/* Date and company */}
            <Text style={{ fontSize: 11, color: C.teal, letterSpacing: 0.5, marginBottom: 10 }}>
                {dateStr}
            </Text>
            <Text style={{ fontSize: 10, color: C.accent, fontWeight: 700, marginBottom: 6 }}>
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
const TOCRow = ({ label, page, }) => (
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

        <TOCRow label="DOCUMENT INFORMATION" page="3" />
        <TOCRow label="EXECUTIVE SUMMARY" page="4" />
        <TOCRow label="CURRENT STATE" page="5" />
        <TOCRow label="SECURITY BLUEPRINT" page="6" />
        <TOCRow label="OPERATIONAL BLUEPRINT" page="7" />
        <TOCRow label="FINANCIAL BLUEPRINT" page="8" />

        <View style={{ marginTop: 18 }}>
            <TOCRow label="Technical Controls" page="6" />
            <TOCRow label="Administrative Controls" page="7" />
        </View>
        <PdfFooter companyName={companyName} />
    </Page>

);

// ============ 3) DOCUMENT INFORMATION ============
const Table = ({ columns, rows }) => (
    <View
        style={{
            borderWidth: 1,
            borderColor: C.lightLine,
            borderRadius: 4,
            overflow: "hidden",
            marginBottom: 14,
        }}
    >
        {/* header */}
        <View style={{ flexDirection: "row", backgroundColor: C.primary }}>
            {columns.map((col, i) => (
                <View
                    key={i}
                    style={{
                        width: `${col.w}%`,
                        paddingVertical: 6,
                        paddingHorizontal: 8,
                        borderRightWidth: i === columns.length - 1 ? 0 : 1,
                        borderRightColor: "#ffffff22",
                    }}
                >
                    <Text style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>
                        {col.label}
                    </Text>
                </View>
            ))}
        </View>
        {/* rows */}
        {rows.map((r, idx) => (
            <View
                key={idx}
                style={{
                    flexDirection: "row",
                    backgroundColor: idx % 2 ? "#F3F7FB" : "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: C.lightLine,
                }}
            >
                {columns.map((col, i) => (
                    <View
                        key={i}
                        style={{
                            width: `${col.w}%`,
                            paddingVertical: 6,
                            paddingHorizontal: 8,
                            borderRightWidth: i === columns.length - 1 ? 0 : 1,
                            borderRightColor: C.lightLine,
                        }}
                    >
                        <Text style={{ fontSize: 10.5, color: C.gray700 }}>
                            {r[col.key] ?? " "}
                        </Text>
                    </View>
                ))}
            </View>
        ))}
    </View>
);

const DocumentInformation = ({ author = "—", dateStr = "—", companyName = "—" }) => (
    <Page size="A4" style={base.page}>
        <Text style={[base.h1, { marginBottom: 16 }]}>Document Information</Text>

        <Text style={[base.small, { marginBottom: 6 }]}>Table 1: Document Authors</Text>
        <Table
            columns={[
                { label: "Author Name", key: "name", w: 60 },
                { label: "Title", key: "title", w: 40 },
            ]}
            rows={[
                { name: author, title: "Principal" },
                { name: "", title: "" },
            ]}
        />

        <Text style={[base.small, { marginBottom: 6 }]}>Table 2: Revision History</Text>
        <Table
            columns={[
                { label: "Date", key: "date", w: 25 },
                { label: "Version", key: "version", w: 15 },
                { label: "Author", key: "author", w: 25 },
                { label: "Description", key: "desc", w: 35 },
            ]}
            rows={[
                { date: dateStr, version: "0.1", author, desc: "Initial Draft" },
                { date: "", version: "", author: "", desc: "" },
            ]}
        />

        <Text style={[base.small, { marginBottom: 6 }]}>Table 3 – Document Approval</Text>
        <Table
            columns={[
                { label: "Date", key: "date", w: 20 },
                { label: "Approver", key: "approver", w: 30 },
                { label: "Title", key: "title", w: 25 },
                { label: "Comments", key: "comments", w: 25 },
            ]}
            rows={[{ date: "", approver: "", title: "", comments: "" }]}
        />
        <PdfFooter companyName={companyName} />
    </Page>
);

// ============ 4) EXECUTIVE SUMMARY ============
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
            Summary of infrastructure, security tools, and applications currently in use.
        </Text>

        <Text style={base.h2}>Security Blueprint</Text>
        <Text style={[base.p, { marginBottom: 10 }]}>
            How your infrastructure, tools, and applications stack against best practices.
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

// ============ 5) WRAPPER DOCUMENT ============
// Props let you feed form data (company name, date, etc.)
const BlueprintDocument = ({
    companyName = "—",
    preparedDate = new Date(),
    author = "Rajesh Haridas", // default per screenshot
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
            +   <CoverPage companyName={companyName} dateStr={dateStr} />
            +   <TableOfContents companyName={companyName} />
            +   <DocumentInformation author={author} dateStr={dateStr} companyName={companyName} />
            +   <ExecutiveSummary companyName={companyName} />
            {/* Your existing Current State page (portrait, single page) */}
            <CurrentState title="Current State" data={currentStateData} />

        </Document>

    );
};

export default BlueprintDocument;
