// API endpoint for saving celebrities data
export default async function handler(request, response) {
  if (request.method === 'POST') {
    try {
      const { celebrities } = await request.json();
      
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
        error: error.message 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response('Method not allowed', { status: 405 });
}
