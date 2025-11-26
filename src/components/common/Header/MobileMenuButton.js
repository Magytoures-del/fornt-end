"use client";

/**
 * Reusable Mobile Menu Button (Hamburger) Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether menu is open
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.isScrolled - Whether header is in scrolled state
 * @param {string} props.className - Additional CSS classes
 */
export default function MobileMenuButton({
  isOpen = false,
  onClick,
  isScrolled = false,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      className={`md:hidden p-2 rounded-lg transition-all duration-300 relative ${
        isScrolled
          ? "text-gray-700 hover:bg-gray-100 hover:scale-105"
          : "text-white hover:bg-blue-800/50 hover:scale-105"
      } ${className}`}
      aria-label="Toggle mobile menu"
      aria-expanded={isOpen}
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <span
          className={`mobile-menu-button-line block h-0.5 w-6 bg-current ${
            isOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
          }`}
        />
        <span
          className={`mobile-menu-button-line block h-0.5 w-6 bg-current ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`mobile-menu-button-line block h-0.5 w-6 bg-current ${
            isOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
          }`}
        />
      </div>
    </button>
  );
}

