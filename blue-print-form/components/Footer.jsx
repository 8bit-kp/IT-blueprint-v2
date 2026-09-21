const Footer = () => {
  return (
    <footer className="nui mt-12 border-t border-[color:var(--nui-accent-tint-2)] pt-6 pb-6 text-center text-sm text-[var(--nui-text-3)]">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <span>&copy; {new Date().getFullYear()} Consltek. All rights reserved.</span>
        <span className="hidden sm:inline text-[var(--nui-line-strong)]">|</span>
        <a href="/privacy-policy" className="hover:text-[var(--nui-brand)] transition-colors">
          Privacy Policy
        </a>
        <span className="hidden sm:inline text-[var(--nui-line-strong)]">|</span>
        <a href="/terms-of-service" className="hover:text-[var(--nui-brand)] transition-colors">
          Terms of Service
        </a>
      </div>
    </footer>
  );
};

export default Footer;
