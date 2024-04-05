console.info('➜  Local:   http://localhost/')

Bun.serve({
  port: 80,
  fetch(request) {
    const path = new URL(request.url).pathname
    if (path === '/') {
      return new Response(Bun.file('./index.html'))
    }
    if (path === '/assets/index.js') {
      return new Response(Bun.file('./assets/index.js'))
    }
    if (path === '/assets/index.css') {
      return new Response(Bun.file('./assets/index.css'))
    }
    return new Response(null, { status: 404 })
  },
})
