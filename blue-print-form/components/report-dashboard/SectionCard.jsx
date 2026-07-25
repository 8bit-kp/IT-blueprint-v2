"use client";

/**
 * SectionCard — the standard shell for every dashboard section on the
 * report page. Provides the anchor id (with scroll-margin so the sticky
 * header + floating sidebar never cover the heading), title row with an
 * optional icon/eyebrow/description, and an optional right-aligned action
 * slot (e.g. a collapsible toggle button).
 */
const SectionCard = ({ id, eyebrow, title, description, Icon, action, children }) => (
    <section id={id} className="scroll-mt-24">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-1 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                    {Icon && (
                        <div className="w-9 h-9 rounded-xl bg-[#15587B]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon size={16} className="text-[#15587B]" />
                        </div>
                    )}
                    <div className="min-w-0">
                        {eyebrow && (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                                {eyebrow}
                            </p>
                        )}
                        <h2 className="text-base sm:text-lg font-bold text-gray-800 leading-tight">{title}</h2>
                        {description && (
                            <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">{description}</p>
                        )}
                    </div>
                </div>
                {action && <div className="flex-shrink-0">{action}</div>}
            </div>
            <div className="px-6 pb-7 pt-4">{children}</div>
        </div>
    </section>
);

export default SectionCard;
