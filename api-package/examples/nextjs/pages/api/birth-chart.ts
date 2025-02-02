import { NextApiRequest, NextApiResponse } from 'next';
import { createBirthChart } from 'astrogenie-birthchart';

const calculator = createBirthChart({
  apiKey: process.env.ASTROGENIE_API_KEY || ''
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const birthChart = await calculator.calculate(req.body);
    res.status(200).json(birthChart);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
