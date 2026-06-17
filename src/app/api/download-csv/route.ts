import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    const headers = 'Name,Description\n';
    const rows = items
      .map((p: { name: string; description: string }) => {
        const cleanDesc = p.description.replace(/"/g, '""');
        return `"${p.name}","${cleanDesc}"`;
      })
      .join('\n');

    const csvContent = headers + rows;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=pokemons.csv',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
