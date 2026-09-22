import React from "react";

const FinancialDashboard = ({ formData, updateField }) => {
    return (
        <div className="space-y-6">
            {/* Financial Overview Section */}
            <div className="bg-[var(--nui-surface)] rounded-xl border border-[var(--nui-line)] overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[var(--nui-line-soft)] bg-[var(--nui-surface-sunk)]/50 flex items-center gap-2">
                    <div className="h-5 w-1 bg-[var(--nui-accent)] rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-[var(--nui-brand)] uppercase tracking-wide">Financial Applications — Current State</h2>
                        <p className="text-xs text-[var(--nui-text-3)] mt-0.5">Inventory of financial applications from your assessment</p>
                    </div>
                </div>
                
                <div className="p-8">
                    {/* Coming Soon Message */}
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="bg-[var(--nui-accent)]/10 p-8 rounded-full mb-5">
                            <svg className="w-16 h-16 text-[var(--nui-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[var(--nui-text)] mb-2">Financial Applications Dashboard — Coming Soon</h3>
                        <p className="text-sm text-[var(--nui-text-3)] text-center max-w-md mb-8">
                            The interactive financial applications dashboard is under development. It will display the financial application inventory from your Current State Assessment, including vendor details, business priorities, and sensitivity classifications.
                        </p>
                        
                        {/* Feature Preview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl">
                            <div className="bg-[var(--nui-surface)] p-5 rounded-xl border border-[var(--nui-line)] text-center hover:border-[var(--nui-accent)]/50 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-[var(--nui-accent)]/10 flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-5 h-5 text-[var(--nui-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-[var(--nui-text)] text-sm mb-1">Application Inventory</h4>
                                <p className="text-xs text-[var(--nui-text-3)]">View all financial applications from your assessment</p>
                            </div>

                            <div className="bg-[var(--nui-surface)] p-5 rounded-xl border border-[var(--nui-line)] text-center hover:border-[var(--nui-accent)]/50 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-[var(--nui-ok-bg)] flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-5 h-5 text-[var(--nui-ok)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-[var(--nui-text)] text-sm mb-1">Business Priority</h4>
                                <p className="text-xs text-[var(--nui-text-3)]">Review criticality ratings across financial systems</p>
                            </div>

                            <div className="bg-[var(--nui-surface)] p-5 rounded-xl border border-[var(--nui-line)] text-center hover:border-[var(--nui-accent)]/50 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-[var(--nui-info-bg)] flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-5 h-5 text-[var(--nui-info)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-[var(--nui-text)] text-sm mb-1">Sensitivity Classifications</h4>
                                <p className="text-xs text-[var(--nui-text-3)]">PII, HIPAA, and confidentiality flags per application</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Note Section */}
            <div className="bg-[var(--nui-surface)] border border-[var(--nui-line)] rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-[var(--nui-warn-bg)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[var(--nui-warn)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p className="text-xs font-semibold text-[var(--nui-text-2)] mb-0.5">Download your Current State Report</p>
                    <p className="text-xs text-[var(--nui-text-3)]">
                        You can download the Financial Applications section of your Current State Report from the Reports page.
                        The interactive dashboard is currently in development.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FinancialDashboard;
