import React, { useState } from "react";
import Image from "next/image";

const FlagImage = ({
  src,
  alt,
  className = "",
  fallback = null,
  width = 32,
  height = 24,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  if (imageError && fallback) {
    return <span className={className}>{fallback}</span>;
  }

  if (!src) {
    return fallback ? <span className={className}>{fallback}</span> : null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};

export default FlagImage;
