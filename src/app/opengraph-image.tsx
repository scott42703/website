import { ImageResponse } from "next/og";
import { personal } from "@/data/personal";

export const alt = `${personal.name}, ${personal.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rendered once at build time rather than per request, which is what a
// static host needs and is cheaper everywhere else.
export const dynamic = "force-static";

/** Generated at build time, no image asset to keep in sync. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(168deg, #1b2440 0%, #0d1120 100%)",
        padding: 64,
        fontFamily: "sans-serif",
      }}
    >
      {/* menu bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: "rgba(250,250,252,0.92)",
          borderRadius: 10,
          padding: "10px 18px",
          fontSize: 22,
          color: "#16161a",
        }}
      >
        <span style={{ fontWeight: 700 }}>{personal.name}</span>
        <span style={{ opacity: 0.6 }}>File</span>
        <span style={{ opacity: 0.6 }}>Edit</span>
        <span style={{ opacity: 0.6 }}>View</span>
        <span style={{ opacity: 0.6 }}>Go</span>
      </div>

      {/* window */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#f6f6f8",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 30px 70px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(0,0,0,0.12)",
            padding: "10px 16px",
            fontSize: 22,
            color: "#16161a",
          }}
        >
          <span style={{ fontWeight: 600, color: "#1d1d1f" }}>Portfolio</span>
          <span style={{ display: "flex", gap: 8 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <span
                key={c}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: c,
                }}
              />
            ))}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#ffffff",
            padding: "34px 40px 40px",
          }}
        >
          <div
            style={{
              fontSize: 74,
              fontWeight: 800,
              color: "#1d1d1f",
              letterSpacing: -2.5,
              lineHeight: 1,
            }}
          >
            {personal.name}
          </div>
          <div
            style={{
              fontSize: 34,
              color: "#0071e3",
              fontWeight: 600,
              marginTop: 12,
            }}
          >
            {personal.title}
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#52525a",
              marginTop: 14,
            }}
          >
            {personal.disciplines.join("  •  ")}
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
