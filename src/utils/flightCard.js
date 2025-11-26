export const formatDateFromISOString = (isoString, locale = "en-US") => {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      calendar: "gregory",
    }).format(d);
  } catch (e) {
    return "";
  }
};

export const formatTimeWithMeridiem = (timeStr, locale = "en-US", t) => {
  const raw = (timeStr || "").toString().trim();
  if (!raw) return "";

  // Handle ISO datetime like 2025-09-19T10:25:00
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(raw)) {
    const dateObj = new Date(raw);
    if (!isNaN(dateObj.getTime())) {
      return new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        calendar: "gregory",
      }).format(dateObj);
    }
  }

  // If already contains AM/PM, normalize label localization
  const ampmMatch = raw.match(/\b(AM|PM|am|pm|Am|Pm)\b/);
  if (ampmMatch && t) {
    const isPM = ampmMatch[0].toLowerCase() === "pm";
    const label = isPM ? t("flight_results.pm") : t("flight_results.am");
    return raw.replace(/\b(AM|PM|am|pm|Am|Pm)\b/, label);
  }

  // Expect HH:mm → convert to 12-hour format with localized AM/PM
  const m = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return raw;
  let hours = parseInt(m[1], 10);
  const minutes = m[2];
  const isPM2 = hours >= 12;
  const label2 = t
    ? isPM2
      ? t("flight_results.pm")
      : t("flight_results.am")
    : isPM2
    ? "PM"
    : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${label2}`;
};

export const formatAirportWithTerminal = (code, terminal) => {
  const c = (code || "").toString().trim();
  const t = (terminal || "").toString().trim();
  if (!c && !t) return "";
  if (!t) return c;
  return `${c} • T${t}`;
};
