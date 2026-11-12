import { renderLayout, theme, escapeHtml } from "../layout";
import { brand } from "@/config/brand";

const content = `
    <mj-text font-size="22px" font-weight="600" color="${theme.colors.text.main}">
      Welcome to ${brand.appName}, {{NAME}}! 🎉
    </mj-text>
    <mj-text>
      Thank you for joining ${brand.appName}, home of ${brand.orgName}'s charity auctions supporting our students, faculty, and staff.
    </mj-text>
    <mj-text>
      With your account, you can:
    </mj-text>
    <mj-text padding-left="20px">
      • Browse and join charity auctions<br/>
      • Place bids and follow them in real time<br/>
      • Get notified when you're outbid or win an item
    </mj-text>
    <mj-text>
      Ready to get started? Click the button below to explore your dashboard.
    </mj-text>
    <mj-button href="{{APP_URL}}/dashboard">
      Go to Dashboard
    </mj-button>
`;

export const welcomeTemplate = renderLayout({
  title: `Welcome to ${brand.appName}`,
  previewText: `Welcome to ${brand.appName} - ${brand.orgName} charity auctions`,
  content,
});

export function getWelcomeTemplateData(data: { name: string; appUrl: string }) {
  return {
    template: welcomeTemplate,
    replacements: {
      // HTML-encode user-provided content to prevent injection
      "{{NAME}}": escapeHtml(data.name || "there"),
      "{{APP_URL}}": data.appUrl,
      "{{YEAR}}": new Date().getFullYear().toString(),
    },
  };
}
