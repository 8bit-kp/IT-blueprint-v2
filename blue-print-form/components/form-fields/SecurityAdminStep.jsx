"use client";

import { memo } from "react";
import { Card, YesNo } from "./FormComponents";

const SecurityAdminStep = memo(({ formData, setField }) => (
  <Card title="Governance Checklist" className="max-w-4xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
      <YesNo label="Security Steering Committee?" value={formData.securityCommittee} onChange={(v) => setField("securityCommittee", v)} />
      <YesNo label="Written Security Policy?" value={formData.securityPolicy} onChange={(v) => setField("securityPolicy", v)} />
      <YesNo label="Employee Training?" value={formData.employeeTraining} onChange={(v) => setField("employeeTraining", v)} />
      <YesNo label="Written BCDR Plan?" value={formData.bcdrPlan} onChange={(v) => setField("bcdrPlan", v)} />
      <YesNo label="Cybersecurity Insurance?" value={formData.cyberInsurance} onChange={(v) => setField("cyberInsurance", v)} />
      <YesNo label="Test Backup Recovery?" value={formData.testBackup} onChange={(v) => setField("testBackup", v)} />
      <YesNo label="Change Control Process?" value={formData.changeControl} onChange={(v) => setField("changeControl", v)} />
      <YesNo label="Incident Response Plan?" value={formData.incidentResponse} onChange={(v) => setField("incidentResponse", v)} />
      <YesNo label="Monthly Security Review?" value={formData.securityReview} onChange={(v) => setField("securityReview", v)} />
      <YesNo label="Penetration Test (1 yr)?" value={formData.penetrationTest} onChange={(v) => setField("penetrationTest", v)} />
    </div>
  </Card>
));

export default SecurityAdminStep;
