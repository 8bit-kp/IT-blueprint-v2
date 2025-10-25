import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="mt-12  bg border-[#34808A]/50 pt-6 text-center test-sm text-gray-600">
      &copy; {new Date().getFullYear()} Consltek. All rights reserved.
    </div>
  );
};

export default Footer;