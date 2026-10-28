export const reportFields = ['design_name', 'fabric_analysis', 'tailoring_instructions', 'styling_accessories'];
export function parseFabricImage(value) {
  if (typeof value !== 'string') throw new Error('Please upload a PNG, JPEG or WebP image.');
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match || match[2].length % 4 !== 0) throw new Error('Invalid image data. Use PNG, JPEG or WebP.');
  if (Buffer.from(match[2], 'base64').length > 10 * 1024 * 1024) throw new Error('Image must be 10 MB or smaller.');
  return { mimeType: match[1], data: match[2] };
}
export function validateReport(report) {
  if (!report || !reportFields.every(field => typeof report[field] === 'string' && report[field].trim())) throw new Error('AI returned an incomplete report.');
  return Object.fromEntries(reportFields.map(field => [field, report[field]]));
}
