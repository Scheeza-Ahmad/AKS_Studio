import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFabricImage, validateReport, reportFields } from './validation.js';
test('preserves supported image MIME types', () => {
  for (const type of ['png', 'jpeg', 'webp']) assert.deepEqual(parseFabricImage(`data:image/${type};base64,YQ==`), { mimeType: `image/${type}`, data: 'YQ==' });
});
test('rejects malformed or unsupported uploads', () => {
  for (const value of [null, {}, '', 'data:image/svg+xml;base64,YQ==', 'data:image/png;base64,?!', 'data:image/png;base64,YQ=']) assert.throws(() => parseFabricImage(value));
});
test('rejects images above 10 MB', () => {
  assert.throws(() => parseFabricImage('data:image/png;base64,' + Buffer.alloc(10 * 1024 * 1024 + 1).toString('base64')));
});
test('rejects reports that would break rendering', () => {
  assert.throws(() => validateReport({ design_name: {} }));
  const report = Object.fromEntries(reportFields.map(field => [field, 'Valid text']));
  assert.deepEqual(validateReport(report), report);
  assert.throws(() => validateReport({ ...report, fabric_analysis: {} }));
});
