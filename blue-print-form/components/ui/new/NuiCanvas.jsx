"use client";

/**
 * NuiCanvas — root of the "new UI" layer.
 *
 * Does exactly two things:
 *   1. Applies the `.nui` class, which is what scopes every design token in
 *      styles/new-ui/tokens.css. Nothing in the new UI renders correctly —
 *      or leaks — outside this wrapper.
 *   2. Paints the ambient page canvas (soft brand bloom + faded blueprint
 *      grid) as a fixed, pointer-events-none layer behind the content.
 *
 * The canvas is `fixed inset-0 z-0` with the content at `z-10` so it sits
 * above AppShell's flat `bg-[#F3F4F6]` without AppShell having to change.
 * AppSidebar (z-40) and TopBar (z-30) stay above both.
 */
const NuiCanvas = ({ children, className = "" }) => (
    <div className={`nui ${className}`}>
        <div aria-hidden="true" className="nui-bg pointer-events-none fixed inset-0 z-0" />
        <div className="relative z-10">{children}</div>
    </div>
);

export default NuiCanvas;
