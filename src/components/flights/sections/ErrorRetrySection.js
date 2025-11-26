import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Section } from "../styles/PassengerForm.styles";

const ErrorRetrySection = ({ error, onRetry }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <Section>
        <div
          style={{
            textAlign: "center",
            padding: "3rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {/* Error Icon */}
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#fef2f2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ef4444",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          {/* Error Title */}
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1e293b",
              margin: 0,
            }}
          >
            {t(
              "passenger_form.error_loading_requirements_title",
              "Unable to Load Form"
            )}
          </h3>

          {/* Error Message */}
          <p
            style={{
              color: "#64748b",
              fontSize: "1rem",
              margin: 0,
              maxWidth: "400px",
              lineHeight: "1.5",
            }}
          >
            {t(
              "passenger_form.error_loading_requirements_description",
              "We're having trouble loading the passenger form requirements. Please check your connection and try again."
            )}
          </p>

          {/* Technical Error (if available) */}
          {error && process.env.NODE_ENV === "development" && (
            <details
              style={{
                marginTop: "1rem",
                padding: "1rem",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                fontSize: "0.875rem",
                color: "#64748b",
                textAlign: "left",
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <summary style={{ cursor: "pointer", fontWeight: "500" }}>
                Technical Details
              </summary>
              <pre
                style={{
                  marginTop: "0.5rem",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {typeof error === "string"
                  ? error
                  : JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}

          {/* Retry Button */}
          <button
            onClick={onRetry}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "#3d4fff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#2d3eef";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#3d4fff";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            {t("passenger_form.retry_button", "Try Again")}
          </button>

          {/* Help Text */}
          <p
            style={{
              fontSize: "0.875rem",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            {t(
              "passenger_form.error_help_text",
              "If the problem persists, please contact our support team."
            )}
          </p>
        </div>
      </Section>
    </Container>
  );
};

export default ErrorRetrySection;
