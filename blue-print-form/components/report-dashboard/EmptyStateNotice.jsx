"use client";

/**
 * EmptyStateNotice — transparent "not yet collected" panel. Used wherever
 * an assessment section has no backing data (e.g. Business Workflows,
 * which is not yet a live form step) so the dashboard never fabricates
 * content to fill the space.
 */
const EmptyStateNotice = ({ Icon, title, description }) => (
    <div className="border border-dashed border-gray-300 rounded-xl px-6 py-8 flex flex-col items-center text-center gap-3">
        {Icon && (
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon size={18} className="text-gray-400" />
            </div>
        )}
        <p className="text-sm font-semibold text-gray-600">{title}</p>
        {description && (
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">{description}</p>
        )}
    </div>
);

export default EmptyStateNotice;
