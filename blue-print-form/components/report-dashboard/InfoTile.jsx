"use client";

/**
 * InfoTile — small label/value tile for raw inventory facts (organization
 * profile, infrastructure, business operations). Renders "—" for any
 * missing/empty value rather than hiding the tile, so the grid stays
 * visually stable regardless of how much the customer filled in.
 */
const InfoTile = ({ label, value }) => {
    const isEmpty = value === null || value === undefined || value === "";
    const display = isEmpty ? "Not reported" : value;
    return (
        <div className="group bg-white border border-gray-200 hover:border-[#34808A]/40 shadow-sm hover:shadow-md rounded-xl px-4 py-3 transition-all duration-200 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#34808A]/0 group-hover:bg-[#34808A] transition-colors duration-200" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
            <p className={`text-sm leading-snug ${isEmpty ? "font-medium text-gray-400 italic" : "font-semibold text-gray-800"}`}>
                {display}
            </p>
        </div>
    );
};

export default InfoTile;
