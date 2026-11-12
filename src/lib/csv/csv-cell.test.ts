import { test } from "node:test";
import assert from "node:assert/strict";
import { csvCell } from "./csv-cell";

test("csvCell quotes and escapes", () => {
  assert.equal(csvCell('Say "hi", ok'), '"Say ""hi"", ok"');
  assert.equal(csvCell(null), '""');
  assert.equal(csvCell(21.5), '"21.5"');
});

test("csvCell neutralizes spreadsheet formulas in text", () => {
  assert.equal(csvCell('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"');
  assert.equal(csvCell("+1"), '"\'+1"');
  assert.equal(csvCell("@SUM(A1)"), '"\'@SUM(A1)"');
  // numbers are not text and keep their sign
  assert.equal(csvCell(-5), '"-5"');
});
