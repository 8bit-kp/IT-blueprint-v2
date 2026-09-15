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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            {/* Brand accent bar — gives every section a consistent color identity instead of a flat white top edge */}
            <div className="h-1 bg-gradient-to-r from-[#15587B] via-[#34808A] to-[#15587B]/40" />

            <div className="px-6 pt-6 pb-1 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                    {Icon && (
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#15587B] to-[#0f4460] shadow-sm shadow-[#15587B]/20 flex items-center justify-center flex-shrink-0">
                            <Icon size={19} className="text-white" />
                        </div>
                    )}
                    <div className="min-w-0">
                        {eyebrow && (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#34808A] mb-0.5">
                                {eyebrow}
                            </p>
                        )}
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{title}</h2>
                        {description && (
                            <p className="text-xs text-gray-500 mt-1 max-w-xl leading-relaxed">{description}</p>
                        )}
                    </div>
                </div>
                {action && <div className="flex-shrink-0">{action}</div>}
            </div>
            <div className="px-6 pb-7 pt-3">{children}</div>
        </div>
    </section>
);

export default SectionCard;
