import { test } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import {
  paymentFieldsSchema,
  donorFieldsSchema,
  redactDonor,
  hasPaymentInfo,
} from "./charity-fields";

const payment = z.object(paymentFieldsSchema);
const donor = z.object(donorFieldsSchema);

test("payment URL accepts http(s) only and clears on empty string", () => {
  assert.equal(
    payment.parse({ paymentUrl: "https://www.fhu.edu/give" }).paymentUrl,
    "https://www.fhu.edu/give",
  );
  assert.equal(payment.parse({ paymentUrl: "" }).paymentUrl, null);
  assert.equal(
    payment.safeParse({ paymentUrl: "javascript:alert(1)" }).success,
    false,
  );
  assert.equal(
    payment.safeParse({ paymentUrl: "fhu.edu/give" }).success,
    false,
  );
});

test("instructions are trimmed; blank becomes null; omitted stays undefined", () => {
  const parsed = payment.parse({
    paymentInstructions: "  Pay $20 at the Business Office  ",
    pickupInstructions: "   ",
  });
  assert.equal(parsed.paymentInstructions, "Pay $20 at the Business Office");
  assert.equal(parsed.pickupInstructions, null);
  assert.equal(payment.parse({}).paymentInstructions, undefined);
});

test("donor fields validate and clear", () => {
  const parsed = donor.parse({
    donorName: " Main Street Bakery ",
    donorUrl: "",
    showDonor: false,
  });
  assert.deepEqual(parsed, {
    donorName: "Main Street Bakery",
    donorUrl: null,
    showDonor: false,
  });
  assert.equal(
    donor.safeParse({ donorUrl: "data:text/html,x" }).success,
    false,
  );
});

test("anonymous donors are hidden unless the viewer may see them", () => {
  const item = {
    id: "1",
    donorName: "A",
    donorUrl: "https://a.com",
    showDonor: false,
  };
  assert.deepEqual(redactDonor(item, false), {
    ...item,
    donorName: null,
    donorUrl: null,
  });
  assert.equal(redactDonor(item, true).donorName, "A");
  const publicItem = { ...item, showDonor: true };
  assert.equal(redactDonor(publicItem, false).donorName, "A");
});

test("hasPaymentInfo", () => {
  assert.equal(hasPaymentInfo({}), false);
  assert.equal(
    hasPaymentInfo({ paymentUrl: null, pickupInstructions: "Gym" }),
    true,
  );
});
