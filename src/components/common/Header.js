"use client";

import { useState, useEffect } from "react";
import MainNav from "./MainNav";
import HeaderLogo from "./Header/HeaderLogo";
import LanguageSelector from "./Header/LanguageSelector";
import ProfileDropdown from "./Header/ProfileDropdown";
import MobileMenuButton from "./Header/MobileMenuButton";
import MobileMenu from "./Header/MobileMenu";
import AuthButton from "./Header/AuthButton";
import AuthModal from "./AuthModal";
import { useHeaderScroll } from "./Header/useHeaderScroll";
import { useHeaderNavigation } from "./Header/useHeaderNavigation";

/**
 * Main Header Component
 * Refactored with clean code principles and reusable sub-components
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const shouldShowScrolledHeader = useHeaderScroll();
  const navigation = useHeaderNavigation();

  // Wait for component to mount to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    // Close mobile menu when opening login modal
    setIsMenuOpen(false);
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <header className="bg-white border-gray-200 shadow-lg fixed w-full h-16 top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-16">
            <HeaderLogo isScrolled={true} />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`${
        shouldShowScrolledHeader
          ? "bg-white border-gray-200"
          : "bg-gray-900/10 backdrop-blur-md"
      } shadow-lg fixed w-full h-16 top-0 z-50 transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-16">
          {/* Logo */}
          <HeaderLogo isScrolled={shouldShowScrolledHeader} />

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex h-full"
            suppressHydrationWarning
            role="navigation"
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <MainNav
                key={item.route}
                item={item}
                isScrolled={shouldShowScrolledHeader}
              />
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector isScrolled={shouldShowScrolledHeader} />
            <ProfileDropdown isScrolled={shouldShowScrolledHeader} />
            <AuthButton
              isScrolled={shouldShowScrolledHeader}
              onLoginClick={() => setIsLoginModalOpen(true)}
            />
          </div>

          {/* Mobile menu button */}
          <MobileMenuButton
            isOpen={isMenuOpen}
            onClick={handleMenuToggle}
            isScrolled={shouldShowScrolledHeader}
          />
        </div>

        {/* Mobile Navigation */}
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={handleMenuClose}
          isScrolled={shouldShowScrolledHeader}
          navigation={navigation}
          onLoginClick={handleLoginClick}
        />
      </div>

      {/* Auth Modal - rendered at header level to persist when mobile menu closes */}
      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={(user) => {
          console.log("Authentication successful:", user);
          setIsLoginModalOpen(false);
        }}
      />
    </header>
  );
}
