import React from "react";
import {
  Container,
  Section,
  SectionTitle,
  InputGrid,
  InputGroup,
} from "./styles/PassengerForm.styles";

const FieldSkeleton = ({ width = "100%" }) => (
  <div
    style={{
      height: "3rem",
      backgroundColor: "#f1f5f9",
      borderRadius: "12px",
      width,
      animation: "pulse 1.5s ease-in-out infinite alternate",
    }}
  />
);

const LabelSkeleton = ({ width = "120px" }) => (
  <div
    style={{
      height: "1rem",
      backgroundColor: "#e2e8f0",
      borderRadius: "4px",
      width,
      marginBottom: "0.5rem",
    }}
  />
);

export default function PassengerFormSkeleton() {
  return (
    <Container>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Main Passenger Section */}
      <Section>
        <SectionTitle>
          <div
            style={{
              height: "1.5rem",
              backgroundColor: "#e2e8f0",
              borderRadius: "4px",
              width: "200px",
            }}
          />
          <div
            style={{
              height: "2rem",
              backgroundColor: "#f1f5f9",
              borderRadius: "8px",
              width: "80px",
            }}
          />
        </SectionTitle>

        {/* Gender Toggle Skeleton */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <FieldSkeleton width="150px" />
          <FieldSkeleton width="150px" />
        </div>

        <InputGrid>
          <InputGroup>
            <LabelSkeleton />
            <FieldSkeleton />
          </InputGroup>
          <InputGroup>
            <LabelSkeleton />
            <FieldSkeleton />
          </InputGroup>
        </InputGrid>

        <InputGrid>
          <InputGroup>
            <LabelSkeleton />
            <FieldSkeleton />
          </InputGroup>
          <InputGroup>
            <LabelSkeleton />
            <FieldSkeleton />
          </InputGroup>
        </InputGrid>

        <InputGrid>
          <InputGroup>
            <LabelSkeleton />
            <FieldSkeleton />
          </InputGroup>
          <InputGroup>
            <LabelSkeleton />
            <FieldSkeleton />
          </InputGroup>
        </InputGrid>
      </Section>

      {/* Special Services Section */}
      <Section>
        <SectionTitle>
          <div
            style={{
              height: "1.5rem",
              backgroundColor: "#e2e8f0",
              borderRadius: "4px",
              width: "250px",
            }}
          />
        </SectionTitle>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <FieldSkeleton width="200px" />
          <FieldSkeleton width="200px" />
          <FieldSkeleton width="200px" />
        </div>
      </Section>

      {/* Contact Details Section */}
      <Section>
        <SectionTitle>
          <div
            style={{
              height: "1.5rem",
              backgroundColor: "#e2e8f0",
              borderRadius: "4px",
              width: "180px",
            }}
          />
        </SectionTitle>

        <InputGrid>
          <InputGroup>
            <LabelSkeleton />
            <FieldSkeleton />
          </InputGroup>
          <InputGroup>
            <LabelSkeleton />
            <FieldSkeleton />
          </InputGroup>
        </InputGrid>
      </Section>

      {/* Submit Button Skeleton */}
      <div
        style={{
          height: "3.5rem",
          backgroundColor: "#e2e8f0",
          borderRadius: "12px",
          marginTop: "2rem",
        }}
      />
    </Container>
  );
}
