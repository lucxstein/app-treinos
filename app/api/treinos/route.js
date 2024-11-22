import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const treinos = await prisma.treino.findMany({
    orderBy: { criadoEm: 'asc' },
  });
  return new Response(JSON.stringify(treinos), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req) {
  const { titulo, descricao } = await req.json();
  try {
    const novoTreino = await prisma.treino.create({
      data: { titulo, descricao },
    });
    return new Response(JSON.stringify(novoTreino), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Erro ao criar treino' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  try {
    await prisma.treino.delete({
      where: { id: Number(id) },
    });
    return new Response(null, { status: 204 }); // 204: Sem conteúdo
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Erro ao remover treino' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
