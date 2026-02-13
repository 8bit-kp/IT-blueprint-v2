"use client";

import { memo } from "react";
import { Card, YesNo } from "./FormComponents";

const InfrastructureStep = memo(({ formData, setField }) => (
  <Card title="Facilities & Infrastructure" className="max-w-5xl mx-auto">
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
        <p className="font-medium text-gray-800 mb-3 text-sm">How many physical office spaces do you have?</p>
        <div className="flex flex-wrap gap-2">
          {["1", "2-5", "5-25", "25+"].map(opt => (
            <button key={opt} onClick={() => setField("physicalOffices", opt)} className={`flex-1 py-2 text-sm rounded border transition ${formData.physicalOffices === opt ? "bg-[#34808A] text-white border-[#34808A]" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1">
          <YesNo label="Have Datacenters?" value={formData.hasDataCenters} onChange={(v) => setField("hasDataCenters", v)} />
          <YesNo label="On-Prem DC?" value={formData.hasOnPremDC} onChange={(v) => setField("hasOnPremDC", v)} />
          <YesNo label="Cloud Infra?" value={formData.hasCloudInfra} onChange={(v) => setField("hasCloudInfra", v)} />
        </div>
        <div className="space-y-1 md:border-l-2 md:border-gray-300 md:pl-8">
          <YesNo label="Onsite Generator?" value={formData.hasGenerator} onChange={(v) => setField("hasGenerator", v)} />
          <YesNo label="UPS Systems?" value={formData.hasUPS} onChange={(v) => setField("hasUPS", v)} />
        </div>
      </div>
    </div>
  </Card>
));

export default InfrastructureStep;
