// API endpoint for saving celebrities data
export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'POST') {
    try {
      const body = await request.json() as { celebrities: unknown[] };
      const { celebrities } = body;
      
      // В реальном приложении здесь был бы код для сохранения в базу данных
      // Для демо версии логируем данные
      console.log('Saving celebrities:', celebrities);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Celebrities saved successfully',
        count: celebrities.length 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response('Method not allowed', { status: 405 });
}
