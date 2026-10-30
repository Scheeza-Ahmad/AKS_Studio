import test from 'node:test';
import assert from 'node:assert/strict';
import { generateReport, generateWithGrok } from './providers.js';

const image = { mimeType: 'image/jpeg', data: '/9j/' };
const report = {
  design_name: 'Rose Kurta',
  fabric_analysis: 'Soft pink cotton.',
  tailoring_instructions: 'A-line cut with straight sleeves.',
  styling_accessories: 'Silver earrings and a matching bag.',
};

test('Gemini succeeds without calling Grok', async () => {
  let grokCalled = false;
  const result = await generateReport({ ai: {}, grokKey: 'test', image, templateType: 'A-Line Kurta', gemini: async () => report, grok: async () => { grokCalled = true; } });
  assert.equal(result.provider, 'gemini');
  assert.equal(grokCalled, false);
});

test('Grok is used when Gemini fails', async () => {
  const result = await generateReport({ ai: {}, grokKey: 'test', image, templateType: 'A-Line Kurta', gemini: async () => { throw new Error('offline'); }, grok: async () => report });
  assert.equal(result.provider, 'grok');
  assert.deepEqual(result.report, report);
});

test('Grok can run alone and validates its response', async () => {
  const result = await generateReport({ ai: null, grokKey: 'test', image, templateType: 'A-Line Kurta', grok: async () => report });
  assert.equal(result.provider, 'grok');
  const output = await generateWithGrok('test', image, 'A-Line Kurta', async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.store, false);
    assert.equal(body.input[0].content[0].image_url, 'data:image/jpeg;base64,/9j/');
    return { ok: true, json: async () => ({ output: [{ content: [{ type: 'output_text', text: JSON.stringify(report) }] }] }) };
  });
  assert.deepEqual(output, report);
});
