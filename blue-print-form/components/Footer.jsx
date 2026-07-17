const Footer = () => {
  return (
    <footer className="mt-12 border-t border-[#34808A]/20 pt-6 pb-6 text-center text-sm text-gray-500">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <span>&copy; {new Date().getFullYear()} Consltek. All rights reserved.</span>
        <span className="hidden sm:inline text-gray-300">|</span>
        <a href="#" className="hover:text-[#15587B] transition-colors" onClick={(e) => e.preventDefault()} title="Privacy Policy — coming soon">
          Privacy Policy
        </a>
        <span className="hidden sm:inline text-gray-300">|</span>
        <a href="#" className="hover:text-[#15587B] transition-colors" onClick={(e) => e.preventDefault()} title="Terms of Service — coming soon">
          Terms of Service
        </a>
      </div>
    </footer>
  );
};

export default Footer;
