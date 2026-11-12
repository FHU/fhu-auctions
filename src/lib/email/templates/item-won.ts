import { renderLayout, theme, escapeHtml } from "../layout";

const content = `
    <mj-text font-size="22px" font-weight="600" color="${theme.colors.text.main}">
      Congratulations! 🎉
    </mj-text>
    <mj-text>
      You've won an item in the auction:
    </mj-text>
    <mj-text font-size="18px" font-weight="600" color="${theme.colors.primary}" padding="8px 0">
      "{{ITEM_NAME}}"
    </mj-text>
    <mj-text font-size="14px" color="${theme.colors.text.muted}">
      in auction: <strong>{{AUCTION_NAME}}</strong>
    </mj-text>
    <mj-text font-size="16px" padding="16px 0">
      Winning bid: <strong style="color: #16a34a;">{{CURRENCY_SYMBOL}}{{WINNING_AMOUNT}}</strong>
    </mj-text>
    {{PAYMENT_SECTION}}
    <mj-button href="{{ITEM_URL}}">
      View Item Details
    </mj-button>
    <mj-text align="center" font-size="11px" color="${theme.colors.text.light}" font-style="italic" padding-top="20px">
      Don't want to receive these notifications? You can turn them off in your user settings after logging in.
    </mj-text>
`;

/** Escape user text for MJML and keep line breaks */
function multiline(text: string): string {
  return escapeHtml(text).replace(/\r?\n/g, "<br/>");
}

/** "How to pay / pick up" block from the auction's settings (FHU) */
function renderPaymentSection(data: {
  paymentUrl?: string | null;
  paymentInstructions?: string | null;
  pickupInstructions?: string | null;
}): string {
  const { paymentUrl, paymentInstructions, pickupInstructions } = data;
  if (!paymentUrl && !paymentInstructions && !pickupInstructions) {
    return `<mj-text>
      The auction for this item has ended and you are the winner! Contact the auction organizer for next steps.
    </mj-text>`;
  }

  let section = `<mj-text>
      The auction for this item has ended and you are the winner! Here's how to complete your purchase:
    </mj-text>`;
  if (paymentInstructions || paymentUrl) {
    section += `
    <mj-text font-size="17px" font-weight="700" padding-top="16px">How to pay</mj-text>`;
    if (paymentInstructions) {
      section += `
    <mj-text>${multiline(paymentInstructions)}</mj-text>`;
    }
    if (paymentUrl) {
      section += `
    <mj-button href="${escapeHtml(paymentUrl)}" align="left">Pay online</mj-button>`;
    }
  }
  if (pickupInstructions) {
    section += `
    <mj-text font-size="17px" font-weight="700" padding-top="16px">Picking up your item</mj-text>
    <mj-text>${multiline(pickupInstructions)}</mj-text>`;
  }
  return (
    section +
    `
    <mj-divider border-color="${theme.colors.border}" padding="20px 0 8px" />`
  );
}

export const itemWonTemplate = renderLayout({
  title: "You Won!",
  previewText: "Congratulations! You've won an item",
  content,
});

export function getItemWonTemplateData(data: {
  itemName: string;
  auctionName: string;
  auctionId: string;
  itemId: string;
  winningAmount: number;
  currencySymbol: string;
  normalizedAmount?: number;
  appUrl: string;
  paymentUrl?: string | null;
  paymentInstructions?: string | null;
  pickupInstructions?: string | null;
}) {
  return {
    template: itemWonTemplate,
    replacements: {
      // HTML-encode user-provided content to prevent injection
      "{{ITEM_NAME}}": escapeHtml(data.itemName),
      "{{AUCTION_NAME}}": escapeHtml(data.auctionName),
      "{{CURRENCY_SYMBOL}}": escapeHtml(data.currencySymbol),
      "{{WINNING_AMOUNT}}": `${data.winningAmount.toFixed(2)}${
        typeof data.normalizedAmount === "number"
          ? ` (normalized: ${data.normalizedAmount})`
          : ""
      }`,
      "{{PAYMENT_SECTION}}": renderPaymentSection(data),
      "{{ITEM_URL}}": `${data.appUrl}/auctions/${encodeURIComponent(data.auctionId)}/items/${encodeURIComponent(data.itemId)}`,
      "{{YEAR}}": new Date().getFullYear().toString(),
    },
  };
}
