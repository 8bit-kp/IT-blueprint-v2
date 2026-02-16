import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import CurrentState from "../CurrentState";
import PdfFooter from "./pdfFooter";

// Styles
const styles = StyleSheet.create({
    page: {
        paddingTop: 35,
        paddingBottom: 55,
        paddingHorizontal: 35,
        fontFamily: "Helvetica",
    },
    coverPage: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    coverTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#15587B",
        marginBottom: 10,
        textAlign: "center",
    },
    coverSubtitle: {
        fontSize: 18,
        color: "#34808A",
        marginBottom: 40,
        textAlign: "center",
    },
    companyName: {
        fontSize: 24,
        color: "#333333",
        marginBottom: 10,
        textAlign: "center",
    },
    preparedDate: {
        fontSize: 14,
        color: "#666666",
        textAlign: "center",
    },
    sectionCover: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "#f8f9fa",
    },
    sectionTitle: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#15587B",
        marginBottom: 20,
        textAlign: "center",
    },
    sectionSubtitle: {
        fontSize: 16,
        color: "#666666",
        textAlign: "center",
        maxWidth: "70%",
    },
    contentPage: {
        paddingTop: 35,
        paddingBottom: 55,
        paddingHorizontal: 35,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#15587B",
        marginBottom: 15,
        paddingBottom: 8,
        borderBottom: "2 solid #34808A",
    },
    table: {
        display: "table",
        width: "100%",
        marginBottom: 20,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    tableHeader: {
        backgroundColor: "#15587B",
        color: "#ffffff",
    },
    tableCell: {
        padding: 8,
        fontSize: 10,
        borderRightWidth: 1,
        borderRightColor: "#e5e7eb",
    },
    tableCellHeader: {
        padding: 8,
        fontSize: 11,
        fontWeight: "bold",
        borderRightWidth: 1,
        borderRightColor: "#ffffff",
    },
    statusYes: {
        color: "#059669",
        fontWeight: "bold",
    },
    statusNo: {
        color: "#dc2626",
        fontWeight: "bold",
    },
    statusPartial: {
        color: "#f59e0b",
        fontWeight: "bold",
    },
    textSmall: {
        fontSize: 9,
        color: "#666666",
    },
});

// Helper functions
const renderControlValue = (value) => {
    if (typeof value === "object" && value !== null) {
        if (value.choice) {
            return `${value.choice}${value.vendor ? ` - ${value.vendor}` : ''}`;
        }
        return JSON.stringify(value);
    }
    return value || "—";
};

const getStatusColor = (value) => {
    if (!value) return {};
    const val = typeof value === "object" ? value.choice : value;
    if (val === "Yes") return styles.statusYes;
    if (val === "No") return styles.statusNo;
    return {};
};

const renderVendorValue = (value) => {
    if (typeof value === "object" && value !== null) {
        const parts = [];
        if (value.choice) parts.push(value.choice);
        if (value.vendor) parts.push(value.vendor);
        if (value.businessPriority) parts.push(`Priority: ${value.businessPriority}`);
        if (value.offering) parts.push(value.offering);
        return parts.join(" | ") || "—";
    }
    return value || "—";
};

const CompleteDocument = ({ companyName, preparedDate, formData }) => {
    return (
        <Document>
            {/* MAIN COVER PAGE */}
            <Page size="A4" style={styles.page}>
                <View style={styles.coverPage}>
                    <Text style={styles.coverTitle}>Complete IT Blueprint</Text>
                    <Text style={styles.coverSubtitle}>Comprehensive Technology Assessment</Text>
                    <Text style={styles.companyName}>{companyName}</Text>
                    <Text style={styles.preparedDate}>
                        Prepared: {preparedDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </Text>
                </View>
                <PdfFooter pageNumber={1} companyName={companyName} />
            </Page>

            {/* CURRENT STATE SECTION - Full Original Design */}
            <Page size="A4" style={styles.page}>
                <View style={styles.sectionCover}>
                    <Text style={styles.sectionTitle}>Current State Blueprint</Text>
                    <Text style={styles.sectionSubtitle}>
                        Complete overview of your current IT infrastructure, applications, and technology stack
                    </Text>
                </View>
                <PdfFooter pageNumber={2} companyName={companyName} />
            </Page>
            
            <CurrentState formData={formData} />

            {/* SECURITY BLUEPRINT SECTION */}
            <Page size="A4" style={styles.page}>
                <View style={styles.sectionCover}>
                    <Text style={styles.sectionTitle}>Security Blueprint</Text>
                    <Text style={styles.sectionSubtitle}>
                        Technical and administrative security controls for comprehensive protection
                    </Text>
                </View>
                <PdfFooter pageNumber={3} companyName={companyName} />
            </Page>

            {/* Security Technical Controls */}
            <Page size="A4" style={styles.contentPage}>
                <Text style={styles.header}>Security Technical Controls</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, { width: "35%" }]}>Control</Text>
                        <Text style={[styles.tableCellHeader, { width: "15%" }]}>Status</Text>
                        <Text style={[styles.tableCellHeader, { width: "25%" }]}>Vendor</Text>
                        <Text style={[styles.tableCellHeader, { width: "25%" }]}>Details</Text>
                    </View>
                    {[
                        { label: "Firewall", key: "firewall" },
                        { label: "Endpoint Security", key: "endpointSecurity" },
                        { label: "Email Security", key: "emailSecurity" },
                        { label: "SIEM", key: "siem" },
                        { label: "EDR", key: "edr" },
                        { label: "MDM", key: "mdm" },
                        { label: "MFA", key: "mfa" },
                        { label: "NAC", key: "nac" },
                        { label: "IAM", key: "iam" },
                        { label: "SSO", key: "sso" },
                        { label: "VPN", key: "vpn" },
                        { label: "DLP", key: "dlp" },
                        { label: "CASB", key: "casb" },
                    ].map((item, idx) => {
                        const value = formData[item.key];
                        const status = typeof value === "object" ? value.choice : value;
                        return (
                            <View key={idx} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { width: "35%" }]}>{item.label}</Text>
                                <Text style={[styles.tableCell, { width: "15%" }, getStatusColor(value)]}>{status || "—"}</Text>
                                <Text style={[styles.tableCell, { width: "25%" }]}>{value?.vendor || "—"}</Text>
                                <Text style={[styles.tableCell, { width: "25%", fontSize: 8 }]}>
                                    {value?.businessPriority ? `${value.businessPriority} | ${value.offering || ""}` : "—"}
                                </Text>
                            </View>
                        );
                    })}
                </View>
                <PdfFooter pageNumber={4} companyName={companyName} />
            </Page>

            {/* Governance & Admin Controls */}
            <Page size="A4" style={styles.contentPage}>
                <Text style={styles.header}>Governance & Administrative Controls</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, { width: "60%" }]}>Control</Text>
                        <Text style={[styles.tableCellHeader, { width: "40%" }]}>Status</Text>
                    </View>
                    {[
                        { label: "Security Committee", key: "securityCommittee" },
                        { label: "IT Governance Framework", key: "itGovernance" },
                        { label: "Security Policies", key: "securityPolicies" },
                        { label: "Risk Assessment Process", key: "riskAssessment" },
                        { label: "Incident Response Plan", key: "incidentResponse" },
                        { label: "Business Continuity Plan", key: "businessContinuity" },
                        { label: "Disaster Recovery Plan", key: "disasterRecovery" },
                        { label: "Security Awareness Training", key: "securityTraining" },
                        { label: "Third-Party Risk Management", key: "thirdPartyRisk" },
                        { label: "Vulnerability Management", key: "vulnerabilityManagement" },
                        { label: "Penetration Testing", key: "penetrationTest" },
                    ].map((item, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: "60%" }]}>{item.label}</Text>
                            <Text style={[styles.tableCell, { width: "40%" }, getStatusColor(formData[item.key])]}>
                                {formData[item.key] || "—"}
                            </Text>
                        </View>
                    ))}
                </View>
                <PdfFooter pageNumber={5} companyName={companyName} />
            </Page>

            {/* FINANCIAL BLUEPRINT SECTION */}
            <Page size="A4" style={styles.page}>
                <View style={styles.sectionCover}>
                    <Text style={styles.sectionTitle}>Financial Blueprint</Text>
                    <Text style={styles.sectionSubtitle}>
                        Finance and payroll application portfolio
                    </Text>
                </View>
                <PdfFooter pageNumber={6} companyName={companyName} />
            </Page>

            {/* Finance Applications */}
            <Page size="A4" style={styles.contentPage}>
                <Text style={styles.header}>Finance Applications</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, { width: "40%" }]}>Application</Text>
                        <Text style={[styles.tableCellHeader, { width: "20%" }]}>In Use</Text>
                        <Text style={[styles.tableCellHeader, { width: "40%" }]}>Vendor</Text>
                    </View>
                    {formData.financeApplications?.map((app, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: "40%" }]}>{app.name || "—"}</Text>
                            <Text style={[styles.tableCell, { width: "20%" }, getStatusColor(app.inUse)]}>
                                {app.inUse || "—"}
                            </Text>
                            <Text style={[styles.tableCell, { width: "40%" }]}>{app.vendor || "—"}</Text>
                        </View>
                    ))}
                </View>

                <Text style={[styles.header, { marginTop: 30 }]}>Payroll Applications</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, { width: "40%" }]}>Application</Text>
                        <Text style={[styles.tableCellHeader, { width: "20%" }]}>In Use</Text>
                        <Text style={[styles.tableCellHeader, { width: "40%" }]}>Vendor</Text>
                    </View>
                    {formData.payrollApplications?.map((app, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: "40%" }]}>{app.name || "—"}</Text>
                            <Text style={[styles.tableCell, { width: "20%" }, getStatusColor(app.inUse)]}>
                                {app.inUse || "—"}
                            </Text>
                            <Text style={[styles.tableCell, { width: "40%" }]}>{app.vendor || "—"}</Text>
                        </View>
                    ))}
                </View>
                <PdfFooter pageNumber={7} companyName={companyName} />
            </Page>

            {/* OPERATIONAL BLUEPRINT SECTION */}
            <Page size="A4" style={styles.page}>
                <View style={styles.sectionCover}>
                    <Text style={styles.sectionTitle}>Operational Blueprint</Text>
                    <Text style={styles.sectionSubtitle}>
                        Infrastructure vendors, network configuration, and facilities
                    </Text>
                </View>
                <PdfFooter pageNumber={8} companyName={companyName} />
            </Page>

            {/* Infrastructure Vendors */}
            <Page size="A4" style={styles.contentPage}>
                <Text style={styles.header}>Infrastructure Vendors</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, { width: "100%" }]}>Configuration</Text>
                    </View>
                    {[
                        { label: "WAN 1", key: "WAN1" },
                        { label: "WAN 2", key: "WAN2" },
                        { label: "WAN 3", key: "WAN3" },
                        { label: "Switching Vendor", key: "switchingVendor" },
                        { label: "Routing Vendor", key: "routingVendor" },
                        { label: "Wireless Vendor", key: "wirelessVendor" },
                        { label: "Baremetal Vendor", key: "baremetalVendor" },
                        { label: "Virtualization Vendor", key: "virtualizationVendor" },
                        { label: "Cloud Vendor", key: "cloudVendor" },
                    ].map((item, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: "100%", fontSize: 9 }]}>
                                <Text style={{ fontWeight: "bold" }}>{item.label}:</Text> {renderVendorValue(formData[item.key])}
                            </Text>
                        </View>
                    ))}
                </View>
                <PdfFooter pageNumber={9} companyName={companyName} />
            </Page>

            {/* Network Configuration & Facilities */}
            <Page size="A4" style={styles.contentPage}>
                <Text style={styles.header}>Network Configuration</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, { width: "50%" }]}>Item</Text>
                        <Text style={[styles.tableCellHeader, { width: "50%" }]}>Value</Text>
                    </View>
                    {[
                        { label: "Primary WAN", key: "primaryWAN" },
                        { label: "Secondary WAN", key: "secondaryWAN" },
                        { label: "Branch Offices", key: "branchOffices" },
                        { label: "MPLS", key: "mpls" },
                        { label: "SD-WAN", key: "sdWan" },
                    ].map((item, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: "50%" }]}>{item.label}</Text>
                            <Text style={[styles.tableCell, { width: "50%" }]}>{formData[item.key] || "—"}</Text>
                        </View>
                    ))}
                </View>

                <Text style={[styles.header, { marginTop: 30 }]}>Facilities Information</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, { width: "50%" }]}>Item</Text>
                        <Text style={[styles.tableCellHeader, { width: "50%" }]}>Value</Text>
                    </View>
                    {[
                        { label: "Physical Offices", key: "physicalOffices" },
                        { label: "Has Data Centers", key: "hasDataCenters" },
                        { label: "On-Prem DC", key: "hasOnPremDC" },
                        { label: "Cloud Infrastructure", key: "hasCloudInfra" },
                        { label: "Generator", key: "hasGenerator" },
                        { label: "UPS", key: "hasUPS" },
                    ].map((item, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: "50%" }]}>{item.label}</Text>
                            <Text style={[styles.tableCell, { width: "50%" }]}>{formData[item.key] || "—"}</Text>
                        </View>
                    ))}
                </View>
                <PdfFooter pageNumber={10} companyName={companyName} />
            </Page>

            {/* ADMINISTRATION BLUEPRINT SECTION */}
            <Page size="A4" style={styles.page}>
                <View style={styles.sectionCover}>
                    <Text style={styles.sectionTitle}>Administration Blueprint</Text>
                    <Text style={styles.sectionSubtitle}>
                        Company profile, governance, HRIT, and productivity applications
                    </Text>
                </View>
                <PdfFooter pageNumber={11} companyName={companyName} />
            </Page>

            {/* Company Profile & Governance */}
            <Page size="A4" style={styles.contentPage}>
                <Text style={styles.header}>Company Profile</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, { width: "50%" }]}>Field</Text>
                        <Text style={[styles.tableCellHeader, { width: "50%" }]}>Value</Text>
                    </View>
                    {[
                        { label: "Company Name", key: "companyName" },
                        { label: "Industry", key: "industry" },
                        { label: "Employees", key: "employees" },
                        { label: "IT Department Size", key: "itDepartmentSize" },
                    ].map((item, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: "50%" }]}>{item.label}</Text>
                            <Text style={[styles.tableCell, { width: "50%" }]}>{formData[item.key] || "—"}</Text>
                        </View>
                    ))}
                </View>

                <Text style={[styles.header, { marginTop: 30 }]}>Governance Summary</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, { width: "70%" }]}>Control</Text>
                        <Text style={[styles.tableCellHeader, { width: "30%" }]}>Status</Text>
                    </View>
                    {[
                        { label: "Security Committee", key: "securityCommittee" },
                        { label: "IT Governance", key: "itGovernance" },
                        { label: "Security Policies", key: "securityPolicies" },
                        { label: "Incident Response Plan", key: "incidentResponse" },
                    ].map((item, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: "70%" }]}>{item.label}</Text>
                            <Text style={[styles.tableCell, { width: "30%" }, getStatusColor(formData[item.key])]}>
                                {formData[item.key] || "—"}
                            </Text>
                        </View>
                    ))}
                </View>
                <PdfFooter pageNumber={12} companyName={companyName} />
            </Page>

            {/* HRIT Applications */}
            <Page size="A4" style={styles.contentPage}>
                <Text style={styles.header}>HRIT Applications</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, { width: "40%" }]}>Application</Text>
                        <Text style={[styles.tableCellHeader, { width: "20%" }]}>In Use</Text>
                        <Text style={[styles.tableCellHeader, { width: "40%" }]}>Vendor</Text>
                    </View>
                    {formData.hritApplications?.map((app, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: "40%" }]}>{app.name || "—"}</Text>
                            <Text style={[styles.tableCell, { width: "20%" }, getStatusColor(app.inUse)]}>
                                {app.inUse || "—"}
                            </Text>
                            <Text style={[styles.tableCell, { width: "40%" }]}>{app.vendor || "—"}</Text>
                        </View>
                    ))}
                </View>

                <Text style={[styles.header, { marginTop: 30 }]}>Productivity Applications</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellHeader, { width: "40%" }]}>Application</Text>
                        <Text style={[styles.tableCellHeader, { width: "20%" }]}>In Use</Text>
                        <Text style={[styles.tableCellHeader, { width: "40%" }]}>Vendor</Text>
                    </View>
                    {formData.productivityApplications?.map((app, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: "40%" }]}>{app.name || "—"}</Text>
                            <Text style={[styles.tableCell, { width: "20%" }, getStatusColor(app.inUse)]}>
                                {app.inUse || "—"}
                            </Text>
                            <Text style={[styles.tableCell, { width: "40%" }]}>{app.vendor || "—"}</Text>
                        </View>
                    ))}
                </View>
                <PdfFooter pageNumber={13} companyName={companyName} />
            </Page>
        </Document>
    );
};

export default CompleteDocument;
