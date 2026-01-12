export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Allow static assets to pass through
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json)$/i)
  ) {
    return context.next();
  }
  
  // For all other routes, fetch and return index.html
  const indexResponse = await context.env.ASSETS.fetch(new URL('/index.html', context.request.url));
  return new Response(indexResponse.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      ...indexResponse.headers
    }
  });
}
