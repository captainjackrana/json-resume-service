import { NextApiRequest, NextApiResponse } from 'next';
import { renderWithTheme } from '@lib/themes';
import type { ResumeSchema } from '../../types/json-resume';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { theme = 'elegant', variations = 'false', seed = '' } = req.query;
    const resumeData = req.body as ResumeSchema;
    resumeData.enableVariations = variations === 'true';
    resumeData.variationSeed = seed;
    const html = renderWithTheme(theme as string, resumeData);
    
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Error rendering resume:', error);
    return res.status(500).json({ error: 'Failed to render resume' });
  }
} 