import "./globals.css";

export const metadata = {
  title: "NOVA STORE — The New Architecture of Living",
  description: "A curated collision of precision sound hardware, raw architectural wools, and sculptural living objects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
        <script
          id="tailwind-config"
          dangerouslySetInnerHTML={{
            __html: `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          "colors": {
            "on-tertiary": "#ffffff",
            "surface-container": "#eeeeef",
            "outline": "#78767b",
            "on-tertiary-container": "#83838c",
            "on-background": "#1a1c1d",
            "on-primary-fixed-variant": "#474649",
            "surface-tint": "#5f5e60",
            "on-surface-variant": "#47464a",
            "on-secondary": "#ffffff",
            "on-secondary-fixed-variant": "#47464a",
            "secondary-fixed": "#e4e1e6",
            "on-error-container": "#93000a",
            "error-container": "#ffdad6",
            "on-secondary-container": "#656467",
            "on-primary-container": "#858386",
            "primary": "#000000",
            "primary-fixed-dim": "#c8c6c8",
            "surface-container-high": "#e8e8e9",
            "on-primary": "#ffffff",
            "surface-container-low": "#f3f3f4",
            "primary-container": "#1c1b1d",
            "on-error": "#ffffff",
            "surface": "#f9f9fa",
            "on-tertiary-fixed": "#1a1b22",
            "surface-variant": "#e2e2e3",
            "error": "#ba1a1a",
            "secondary-fixed-dim": "#c8c5ca",
            "on-tertiary-fixed-variant": "#46464e",
            "inverse-primary": "#c8c6c8",
            "secondary-container": "#e4e1e6",
            "surface-dim": "#dadadb",
            "surface-container-lowest": "#ffffff",
            "surface-container-highest": "#e2e2e3",
            "on-secondary-fixed": "#1b1b1e",
            "tertiary-fixed": "#e3e1ec",
            "inverse-surface": "#2f3132",
            "secondary": "#5f5e61",
            "on-primary-fixed": "#1c1b1d",
            "tertiary-container": "#1a1b22",
            "outline-variant": "#c8c5ca",
            "surface-bright": "#f9f9fa",
            "on-surface": "#1a1c1d",
            "tertiary": "#000000",
            "background": "#f9f9fa",
            "tertiary-fixed-dim": "#c6c5cf",
            "primary-fixed": "#e5e1e4",
            "inverse-on-surface": "#f0f1f2"
          },
          "borderRadius": {
            "DEFAULT": "0.125rem",
            "lg": "0.25rem",
            "xl": "0.5rem",
            "full": "0.75rem"
          },
          "spacing": {
            "space-xs": "0.25rem",
            "space-lg": "1.5rem",
            "space-md": "1rem",
            "space-xl": "3rem",
            "space-sm": "0.5rem",
            "gutter-mobile": "1rem",
            "margin": "3rem",
            "margin-mobile": "1.25rem",
            "gutter": "1.5rem"
          },
          "fontFamily": {
            "display-xl-mobile": ["Inter"],
            "display-xl": ["Inter"],
            "body-sm": ["Inter"],
            "body-md": ["Inter"],
            "headline-sm": ["Inter"],
            "headline-md": ["Inter"],
            "headline-lg": ["Inter"],
            "label-md": ["Inter"],
            "headline-lg-mobile": ["Inter"],
            "body-lg": ["Inter"],
            "label-sm": ["Inter"]
          },
          "fontSize": {
            "display-xl-mobile": ["36px", { "lineHeight": "44px", "letterSpacing": "-0.025em", "fontWeight": "600" }],
            "display-xl": ["56px", { "lineHeight": "64px", "letterSpacing": "-0.03em", "fontWeight": "600" }],
            "body-sm": ["12px", { "lineHeight": "18px", "letterSpacing": "0.01em", "fontWeight": "400" }],
            "body-md": ["14px", { "lineHeight": "22px", "letterSpacing": "0em", "fontWeight": "400" }],
            "headline-sm": ["18px", { "lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "500" }],
            "headline-md": ["22px", { "lineHeight": "28px", "letterSpacing": "-0.015em", "fontWeight": "500" }],
            "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
            "label-md": ["13px", { "lineHeight": "18px", "letterSpacing": "0.02em", "fontWeight": "500" }],
            "headline-lg-mobile": ["26px", { "lineHeight": "34px", "letterSpacing": "-0.015em", "fontWeight": "600" }],
            "body-lg": ["16px", { "lineHeight": "26px", "letterSpacing": "-0.005em", "fontWeight": "400" }],
            "label-sm": ["11px", { "lineHeight": "14px", "letterSpacing": "0.04em", "fontWeight": "600" }]
          }
        }
      }
    };
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
      font-size: 20px;
      line-height: 1;
      display: inline-block;
      vertical-align: middle;
    }

    @keyframes marquee {
      0% {
        transform: translateX(0%);
      }

      100% {
        transform: translateX(-50%);
      }
    }

    .animate-marquee-infinite {
      display: flex;
      width: 200%;
      animation: marquee 28s linear infinite;
    }

    .animate-marquee-infinite:hover {
      animation-play-state: paused;
    }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
