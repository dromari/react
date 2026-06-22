import { NextResponse } from 'next/server';
import { BASE_URL } from '@/constants/pokemonConstants';

interface IPokeResponse {
  id: number;
  name: string;
  weight: number;
  height: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsString = searchParams.get('ids');
    const count = searchParams.get('count') || 'selected';

    if (!idsString) {
      return NextResponse.json({ error: 'No items selected' }, { status: 400 });
    }

    const ids = idsString.split(',');

    const detailedData = await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(`${BASE_URL}/${id.toLowerCase().trim()}`);
          if (!res.ok) return null;
          const details = (await res.json()) as IPokeResponse;

          const weightKg = details.weight / 10;
          const heightM = details.height / 10;
          const types = details.types.map((t) => t.type.name).join(', ');
          const attacks = details.abilities
            .map((a) => a.ability.name)
            .join(', ');

          const description = `Type: ${types} | Weight: ${weightKg}kg | Height: ${heightM}m | Attacks: ${attacks}`;

          const detailsUrl = `${BASE_URL}/${details.name.toLowerCase()}`;

          return {
            name: details.name.toUpperCase(),
            description,
            detailsUrl,
          };
        } catch {
          return null;
        }
      })
    );

    const validPokemons = detailedData.filter(
      (p): p is { name: string; description: string; detailsUrl: string } =>
        p !== null
    );

    const csvHeaders = 'Name,Description,Details URL\n';

    const csvRows = validPokemons
      .map((p) => {
        const cleanDesc = p.description.replace(/"/g, '""');
        return `"${p.name}","${cleanDesc}","${p.detailsUrl}"`;
      })
      .join('\n');

    const csvContent = csvHeaders + csvRows;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename=${count}_items.csv`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
