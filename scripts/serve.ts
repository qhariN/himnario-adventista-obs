console.info('➜  Local:   http://localhost:3000/')

Bun.serve({
  port: 80,
  fetch(request) {
    const path = (new URL(request.url as URL)).pathname
    if (path === "/favicon.ico") {
      return new Response(null, { status: 404 })
    }
    const url = path === "/" ? "/index.html" : path
    return new Response(Bun.file(`.${url}`))
  },
});