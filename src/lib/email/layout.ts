import { brand } from "@/config/brand";

/**
 * HTML-encode a string to prevent XSS in email templates
 * This should be used for all user-provided content in email templates
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// FHU brand colors (FHU Brand Kit; matches the app's light theme)
export const theme = {
  colors: {
    primary: "#702e3e", // FHU Maroon
    primaryContent: "#ffffff",
    gold: "#c6b682", // FHU Gold (accents; text only on maroon)
    background: "#f1f1f1", // gray-100
    surface: "#ffffff",
    text: {
      main: "#333333", // ink
      muted: "#595d64", // slate
      light: "#595d64", // slate (kit gray-500 fails contrast)
    },
    border: "#cccccc", // gray-300
    error: "#ba0000",
  },
  // FHU is a square-cornered brand (MJML only supports px/%)
  borderRadius: {
    sm: "0px",
    md: "0px",
    lg: "0px",
    xl: "0px",
  },
  // Montserrat where installed; most email clients fall back to Helvetica/Arial
  fontFamily: "Montserrat, Helvetica, Arial, sans-serif",
};

interface LayoutProps {
  content: string;
  previewText?: string;
  title?: string;
  year?: string;
}

export function renderLayout({
  content,
  previewText,
  title = brand.appName,
  year = "{{YEAR}}",
}: LayoutProps) {
  return `
    <mjml>
      <mj-head>
        <mj-title>${title}</mj-title>
        <mj-preview>${previewText || title}</mj-preview>
        <mj-attributes>
          <mj-all font-family="${theme.fontFamily}" />
          <mj-text font-size="16px" color="${
            theme.colors.text.main
          }" line-height="1.6" />
          <mj-button 
            background-color="${theme.colors.primary}" 
            color="#ffffff" 
            font-size="16px" 
            font-weight="600" 
            border-radius="${theme.borderRadius.md}" 
            padding="12px 24px" 
            inner-padding="12px 24px"
          />
          <mj-section padding="0px" />
          <mj-class name="heading" font-size="24px" font-weight="700" color="${
            theme.colors.text.main
          }" />
          <mj-class name="subheading" font-size="18px" font-weight="600" color="${
            theme.colors.text.main
          }" />
          <mj-class name="muted" color="${
            theme.colors.text.muted
          }" font-size="14px" />
        </mj-attributes>
        <mj-style inline="inline">
          .fhu-logo a, .fhu-logo img { color: #ffffff; font-weight: 700; text-decoration: none; }
        </mj-style>
        <mj-style>
          .header-link { text-decoration: none; color: ${
            theme.colors.primary
          }; font-weight: 700; font-size: 24px; }
          .footer-link { color: ${
            theme.colors.text.muted
          }; text-decoration: underline; }
        </mj-style>
      </mj-head>
      <mj-body background-color="${theme.colors.background}" width="600px">
        
        <!-- Header: maroon band, white FHU logo | AUCTIONS, gold bar -->
        <mj-section background-color="${theme.colors.primary}" padding="20px 24px" border-bottom="4px solid ${theme.colors.gold}">
          <mj-group>
            <mj-column width="62%" vertical-align="middle">
              <mj-image css-class="fhu-logo" src="${brand.siteUrl}/brand/fhu-logo-white.png" alt="${brand.orgName}" href="${brand.siteUrl}" width="200px" align="left" padding="0" />
            </mj-column>
            <mj-column width="38%" vertical-align="middle">
              <mj-text align="right" padding="0" color="${theme.colors.gold}" font-family="'Zilla Slab', Georgia, serif" font-size="22px" font-weight="700" letter-spacing="1px">
                ${brand.siteLabel.toUpperCase()}
              </mj-text>
            </mj-column>
          </mj-group>
        </mj-section>
        
        <!-- Main Content Card -->
        <mj-section padding="24px 16px 0">
          <mj-column background-color="${
            theme.colors.surface
          }" border-radius="${
            theme.borderRadius.xl
          }" padding="32px" border="1px solid ${theme.colors.border}">
            ${content}
          </mj-column>
        </mj-section>

        <!-- Footer -->
        <mj-section padding="32px 0 48px">
          <mj-column>
            <mj-text align="center" color="${
              theme.colors.text.light
            }" font-size="12px">
              © ${year} ${brand.orgName}<br/>
              ${brand.postalAddress}
            </mj-text>
            <mj-text align="center" color="${
              theme.colors.text.light
            }" font-size="12px" padding-top="8px">
              <a href="${brand.siteUrl}/privacy" class="footer-link" style="color: ${
                theme.colors.text.light
              }; text-decoration: none;">Privacy Policy</a>
              &nbsp;&nbsp;•&nbsp;&nbsp;
              <a href="${brand.siteUrl}/terms" class="footer-link" style="color: ${
                theme.colors.text.light
              }; text-decoration: none;">Terms of Service</a>
            </mj-text>
          </mj-column>
        </mj-section>

      </mj-body>
    </mjml>
  `;
}
