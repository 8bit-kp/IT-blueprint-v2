"use client";

/**
 * NuiTable — the shared table shell for dense blueprint data.
 *
 * The `.nui-table` rules (tokens.css) own spacing, the uppercase micro
 * header, hairline row rules and hover. This wrapper adds the horizontal
 * scroll region plus an optional caption for screen readers, so wide
 * tables degrade to a scrollable region on small screens instead of
 * breaking the page's layout.
 */
export const NuiTableShell = ({ caption, children, className = "" }) => (
    <div className={`nui-scroll-x -mx-px ${className}`}>
        <table className="nui-table min-w-[560px]">
            {caption && <caption className="sr-only">{caption}</caption>}
            {children}
        </table>
    </div>
);

export default NuiTableShell;
