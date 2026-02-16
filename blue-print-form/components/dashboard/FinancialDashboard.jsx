import React from "react";

const FinancialDashboard = ({ formData, updateField }) => {
    return (
        <div className="space-y-8">
            {/* Financial Overview Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-8 py-5">
                    <h2 className="text-2xl font-bold">Financial Blueprint</h2>
                    <p className="text-sm text-white/90 mt-1">Cost analysis and budget tracking</p>
                </div>
                
                <div className="p-8">
                    {/* Coming Soon Message */}
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="bg-gradient-to-br from-[#7BC5C5] to-[#B8E6E6] p-8 rounded-full mb-6 shadow-lg">
                            <svg className="w-20 h-20 text-[#0F4C5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Financial Dashboard Coming Soon</h3>
                        <p className="text-gray-600 text-center max-w-md mb-8">
                            The interactive financial dashboard is currently under development. It will include comprehensive budget tracking, cost analysis, vendor contracts, and financial projections.
                        </p>
                        
                        {/* Feature Preview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200 text-center">
                                <svg className="w-12 h-12 text-[#15587B] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <h4 className="font-bold text-gray-800 mb-2">Budget Tracking</h4>
                                <p className="text-sm text-gray-600">Monitor IT spending across all categories</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200 text-center">
                                <svg className="w-12 h-12 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <h4 className="font-bold text-gray-800 mb-2">Cost Analysis</h4>
                                <p className="text-sm text-gray-600">Analyze spending patterns and trends</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200 text-center">
                                <svg className="w-12 h-12 text-purple-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <h4 className="font-bold text-gray-800 mb-2">Projections</h4>
                                <p className="text-sm text-gray-600">Financial forecasting and planning</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Note Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-semibold text-amber-900 mb-1">Financial Data in PDF</p>
                        <p className="text-sm text-amber-800">
                            You can still download the Financial Blueprint PDF from the All Blueprints page. 
                            The interactive dashboard for editing financial data is currently in development.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialDashboard;
