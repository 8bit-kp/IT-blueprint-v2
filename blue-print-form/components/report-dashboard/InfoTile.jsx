"use client";

/**
 * InfoTile — small label/value tile for raw inventory facts (organization
 * profile, infrastructure, business operations). Renders "—" for any
 * missing/empty value rather than hiding the tile, so the grid stays
 * visually stable regardless of how much the customer filled in.
 */
const InfoTile = ({ label, value }) => {
    const display = value === null || value === undefined || value === "" ? "—" : value;
    return (
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-700 leading-snug">{display}</p>
        </div>
    );
};

export default InfoTile;
