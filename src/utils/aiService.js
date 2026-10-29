import { auth } from '../firebase';

export const generateOutfitAndText = async (fabricImage, templateType = 'A-Line Kurta') => {
  if (!auth.currentUser) throw new Error('Please sign in to analyze fabric.');
  const token = await auth.currentUser.getIdToken();
  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
  const response = await fetch(`${apiUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ fabricImage, templateType }),
    signal: AbortSignal.timeout(60000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to analyze fabric. Please try again.');
  if (!data.report) throw new Error('The server returned an empty report. Please try again.');
  return data.report;
};
