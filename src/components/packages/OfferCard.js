"use client";
import { useTranslation } from "react-i18next";
import { localizeNumber } from "@/utils/numberLocalization";
import { IoMdPerson } from "react-icons/io";
import { FaClock, FaWhatsapp } from "react-icons/fa";
import { BiCalendarCheck } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import styled from "styled-components";

import { urlFor } from "@/services/sanity";
import SARCurrencyIcon from "@/components/common/SARCurrencyIcon";

// Constants
const WHATSAPP_NUMBER = "1234567890";
const CARD_HEIGHT = 470;
const CONTENT_HEIGHT = 223;
const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

// Styled Components
const Card = styled.div`
  max-width: 20rem;
  width: 100%;
  margin-bottom: 1.25rem;
  min-height: ${CARD_HEIGHT}px;
  height: 100%;
  background-color: white;
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;

  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15),
      0 10px 10px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
    transform: translateY(-4px);
  }

  @media (max-width: 640px) {
    max-width: 100%;
    margin-bottom: 1rem;
    min-height: 420px;
    height: 420px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.12),
      0 2px 4px -1px rgba(0, 0, 0, 0.08), 0 10px 15px -3px rgba(0, 0, 0, 0.12);
  }

  @media (min-width: 641px) and (max-width: 768px) {
    max-width: 100%;
    height: 100%;
  }

  @media (min-width: 769px) {
    max-width: 20rem;
    height: 100%;
  }

  @media (min-width: 1024px) {
    margin-top: 0;
  }

  @media (max-width: 1023px) {
    margin-top: 1.25rem;
  }
`;

const BestSaleBadge = styled.div`
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background-color: #10b981;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  z-index: 10;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 0.6875rem;
    padding: 0.2rem 0.4rem;
    top: 0.75rem;
    left: 0.75rem;
  }

  [dir="rtl"] & {
    left: auto;
    right: 1.25rem;

    @media (max-width: 640px) {
      right: 0.75rem;
    }
  }
`;

const MapBadge = styled.div`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background-color: rgba(243, 244, 246, 0.7);
  color: black;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  backdrop-filter: blur(12px);
  z-index: 10;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 0.6875rem;
    padding: 0.2rem 0.4rem;
    top: 0.75rem;
    right: 0.75rem;
  }

  [dir="rtl"] & {
    right: auto;
    left: 1.25rem;

    @media (max-width: 640px) {
      left: 0.75rem;
    }
  }
`;

const ImageContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const NoImageContainer = styled.div`
  width: 100%;
  height: 65%;
  background-color: #e5e7eb;
  border-radius: 2rem 2rem 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: 640px) {
    height: 240px;
    min-height: 240px;
  }

  span {
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 65%;
  min-height: 200px;
  object-fit: cover;
  border-radius: 2rem 2rem 0 0;
  max-width: 100%;

  @media (max-width: 640px) {
    min-height: 240px;
    height: 240px;
    flex-shrink: 0;
  }
`;

const ContentContainer = styled.div`
  padding: 1.5rem 1.25rem 1.25rem;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #e5e7eb;
  background-color: white;
  border-radius: 0 0 2rem 2rem;
  min-height: ${CONTENT_HEIGHT}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;

  @media (max-width: 640px) {
    padding: 1.25rem 1rem 1rem;
    min-height: 180px;
    height: 180px;
  }
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;

  @media (max-width: 640px) {
    font-size: 1.125rem;
    margin-bottom: 0.375rem;
  }
`;

const Overview = styled.p`
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0 0.75rem 0;

  @media (max-width: 640px) {
    font-size: 0.8125rem;
    line-height: 1.4;
    margin-bottom: 0.5rem;
  }
`;

const InfoContainer = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;

  @media (max-width: 640px) {
    font-size: 0.8125rem;
    gap: 0.875rem;
    margin-bottom: 0.5rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;

  svg {
    flex-shrink: 0;
  }

  span {
    font-weight: 600;
  }

  @media (max-width: 640px) {
    font-size: 0.8125rem;
    gap: 0.2rem;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 0.375rem;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;

  .price-main {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }

  .price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    line-height: 1;
  }

  .currency {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #374151;
  }

  .currency-icon {
    width: 0.8125rem;
    height: 0.8125rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .price-unit {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
    white-space: nowrap;
  }

  .no-price {
    display: flex;
    align-items: center;
  }

  .price-unavailable {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    font-style: italic;
    padding: 0.25rem 0.5rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
    white-space: nowrap;
  }

  /* RTL Support */
  [dir="rtl"] & {
    direction: rtl;

    .price-main {
      flex-direction: row-reverse;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    gap: 0.25rem;

    .price {
      font-size: 1.125rem;
    }

    .currency {
      font-size: 0.75rem;
    }

    .currency-icon {
      width: 0.75rem;
      height: 0.75rem;
    }

    .price-unit {
      font-size: 0.6875rem;
    }

    .price-unavailable {
      font-size: 0.8125rem;
      padding: 0.2rem 0.4rem;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BookButton = styled.button`
  padding: 0.5rem 1rem;
  color: black;
  background-color: #f2f4f6;
  border: 1px solid #e4e6e8;
  border-radius: 1.5rem;
  font-weight: 700;
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background-color: #e5e7eb;
  }

  @media (max-width: 640px) {
    padding: 0.4375rem 0.875rem;
    font-size: 0.75rem;
    gap: 0.2rem;
  }
`;

const WhatsAppButton = styled.button`
  padding: 0.5rem 0.75rem;
  color: white;
  background-color: #10b981;
  border: none;
  border-radius: 1.5rem;
  font-weight: 700;
  font-size: 0.8125rem;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background-color: #059669;
  }

  @media (max-width: 640px) {
    padding: 0.4375rem 0.625rem;
    font-size: 0.75rem;
  }
`;

const OfferCard = ({ offer }) => {
  const { i18n, t } = useTranslation();
  const lan = i18n.language;

  // Event handlers
  const handleWhatsAppClick = () => {
    const message = `${t(
      "common.whatsappMessage",
      "مرحبًا، أرغب في حجز العرض التالي:"
    )} ${offer?.title || t("common.thisPackage", "this package")}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const isRTL = lan === "ar";

  return (
    <Card
      aria-label={t("packages.offer_card", "Offer Card")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <BadgeSection offer={offer} t={t} />
      <PosterSection offer={offer} lan={lan} t={t} />
      <ContentSection
        offer={offer}
        lan={lan}
        t={t}
        onWhatsAppClick={handleWhatsAppClick}
      />
    </Card>
  );
};

// Badge Section Component
const BadgeSection = ({ offer, t }) => (
  <>
    {offer?.most && (
      <BestSaleBadge>{t("packages.bestSale", "Best Sale")}</BestSaleBadge>
    )}
    <MapBadge>{offer?.map}</MapBadge>
  </>
);

// Poster Section Component
const PosterSection = ({ offer, lan, t }) => {
  const altText = offer?.title || t("packages.hero.offerImage", "Offer Image");

  if (!offer?.poster) {
    return (
      <NoImageContainer>
        <span>{t("packages.no_image", "No image available")}</span>
      </NoImageContainer>
    );
  }

  return (
    <ImageContainer>
      <StyledImage
        src={urlFor(offer.poster).url()}
        alt={altText}
        width={320}
        height={290}
        loading="lazy"
        quality={40}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
      />
    </ImageContainer>
  );
};

// Content Section Component
const ContentSection = ({ offer, lan, t, onWhatsAppClick }) => (
  <ContentContainer>
    <OfferTitle title={offer?.title} t={t} />
    <OfferOverview overview={offer?.overview} t={t} />
    <OfferInfo offer={offer} t={t} />
    <ActionsSection
      offer={offer}
      t={t}
      onWhatsAppClick={onWhatsAppClick}
      lan={lan}
    />
  </ContentContainer>
);

// Individual Content Components
const OfferTitle = ({ title, t }) => (
  <Title>{title || t("packages.untitled", "Untitled")}</Title>
);

const OfferOverview = ({ overview, t }) => (
  <Overview>
    {overview || t("packages.no_overview", "No overview available.")}
  </Overview>
);

const OfferInfo = ({ offer, t }) => (
  <InfoContainer>
    <DurationInfo duration={offer?.duration} t={t} />
    <GuestInfo numberOfGuests={offer?.numberOfGuests} t={t} />
  </InfoContainer>
);

const DurationInfo = ({ duration, t }) => {
  const days = duration || 0;
  const nights = days > 0 ? days - 1 : 0;

  return (
    <InfoItem>
      <FaClock />
      <span>{days}</span>
      <span>
        {t("common.days", "days")} / {nights} {t("common.nights", "nights")}
      </span>
    </InfoItem>
  );
};

const GuestInfo = ({ numberOfGuests, t }) => {
  const getGuestText = (count) => {
    if (!count) return t("common.guests", "Guests");

    if (count === 1) {
      return t("package.occupancy.single", "Single");
    } else if (count === 2) {
      return t("package.occupancy.double", "Double");
    } else {
      return `${count} ${t("common.guests", "Guests")}`;
    }
  };

  return (
    <InfoItem>
      <IoMdPerson />
      <span>{getGuestText(numberOfGuests)}</span>
    </InfoItem>
  );
};

const ActionsSection = ({ offer, t, onWhatsAppClick, lan }) => (
  <ActionsContainer>
    <PriceDisplay price={offer?.price} t={t} lan={lan} />
    <ActionButtons offer={offer} t={t} onWhatsAppClick={onWhatsAppClick} />
  </ActionsContainer>
);

const PriceDisplay = ({ price, t, lan }) => {
  // Format price with proper number formatting
  const formatPrice = (value) => {
    if (!value || isNaN(value)) return null;
    const numValue = parseFloat(value);
    return localizeNumber(numValue, lan || "en");
  };

  const formattedPrice = formatPrice(price);
  const hasValidPrice = formattedPrice !== null;
  const isRTL = lan === "ar";

  return (
    <PriceContainer
      role="region"
      aria-label={t("common.priceInfo", "Price Information")}
    >
      {hasValidPrice ? (
        <>
          <div className="price-main">
            <SARCurrencyIcon
              className="currency-icon text-xl"
              style={{ width: "1rem", height: "1rem" }}
            />
            <span
              className="price"
              aria-label={`${formattedPrice} ${t("common.currency", "SAR")}`}
            >
              {formattedPrice}
            </span>
          </div>
          <span className="price-unit">
            /{t("common.perPerson", "per person")}
          </span>
        </>
      ) : (
        <div className="no-price">
          <span className="price-unavailable">
            {t("packages.price_on_request", "Price on request")}
          </span>
        </div>
      )}
    </PriceContainer>
  );
};

const ActionButtons = ({ offer, t, onWhatsAppClick }) => (
  <ButtonContainer>
    <Link href={`/package/${offer?.slug?.current || ""}`}>
      <BookButton aria-label={t("common.bookNow", "Book Now")}>
        <BiCalendarCheck />
        {t("common.bookNow", "Book Now")}
      </BookButton>
    </Link>

    <WhatsAppButton
      aria-label={t("common.whatsapp", "Contact via WhatsApp")}
      onClick={onWhatsAppClick}
    >
      <FaWhatsapp />
    </WhatsAppButton>
  </ButtonContainer>
);

// PropTypes
const offerShape = PropTypes.shape({
  most: PropTypes.bool,
  map: PropTypes.string,
  poster: PropTypes.any,
  title: PropTypes.string,
  overview: PropTypes.string,
  duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nights: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  numberOfGuests: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  slug: PropTypes.shape({
    current: PropTypes.string,
  }),
  id: PropTypes.any,
});

OfferCard.propTypes = {
  offer: offerShape.isRequired,
};

BadgeSection.propTypes = {
  offer: offerShape.isRequired,
  t: PropTypes.func.isRequired,
};

PosterSection.propTypes = {
  offer: offerShape.isRequired,
  lan: PropTypes.string,
  t: PropTypes.func.isRequired,
};

ContentSection.propTypes = {
  offer: offerShape.isRequired,
  lan: PropTypes.string,
  t: PropTypes.func.isRequired,
  onWhatsAppClick: PropTypes.func.isRequired,
};

OfferTitle.propTypes = {
  title: PropTypes.string,
  t: PropTypes.func.isRequired,
};

OfferOverview.propTypes = {
  overview: PropTypes.string,
  t: PropTypes.func.isRequired,
};

OfferInfo.propTypes = {
  offer: offerShape.isRequired,
  t: PropTypes.func.isRequired,
};

DurationInfo.propTypes = {
  duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  t: PropTypes.func.isRequired,
};

GuestInfo.propTypes = {
  numberOfGuests: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  t: PropTypes.func.isRequired,
};

ActionsSection.propTypes = {
  offer: offerShape.isRequired,
  t: PropTypes.func.isRequired,
  onWhatsAppClick: PropTypes.func.isRequired,
};

PriceDisplay.propTypes = {
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  t: PropTypes.func.isRequired,
};

ActionButtons.propTypes = {
  offer: offerShape.isRequired,
  t: PropTypes.func.isRequired,
  onWhatsAppClick: PropTypes.func.isRequired,
};

export default OfferCard;
