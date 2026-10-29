export const reportFields = ['design_name', 'fabric_analysis', 'tailoring_instructions', 'styling_accessories'];
export function parseFabricImage(value) {
  if (typeof value !== 'string') throw new Error('Please upload a PNG, JPEG or WebP image.');
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match || match[2].length % 4 !== 0) throw new Error('Invalid image data. Use PNG, JPEG or WebP.');
  if (match[2].length > Math.ceil(10 * 1024 * 1024 / 3) * 4) throw new Error('Image must be 10 MB or smaller.');
  const bytes = Buffer.from(match[2], 'base64');
  if (bytes.length > 10 * 1024 * 1024) throw new Error('Image must be 10 MB or smaller.');
  if (bytes.toString('base64') !== match[2]) throw new Error('Invalid image encoding.');
  const valid = match[1] === 'image/png'
    ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    : match[1] === 'image/jpeg'
      ? bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      : bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
  if (!valid) throw new Error('Image contents do not match the file type.');
  return { mimeType: match[1], data: match[2] };
}
export function validateReport(report) {
  if (!report || !reportFields.every(field => typeof report[field] === 'string' && report[field].trim())) throw new Error('AI returned an incomplete report.');
  return Object.fromEntries(reportFields.map(field => [field, report[field]]));
}
