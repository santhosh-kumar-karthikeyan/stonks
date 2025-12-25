import fs from 'fs/promises';
import path from 'path';
export async function GET() {
  const file = path.join(process.cwd(), 'data/raw/securities.json');
  const data = await fs.readFile(file, 'utf-8');
  return Response.json(JSON.parse(data));
}
