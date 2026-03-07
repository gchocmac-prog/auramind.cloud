/**
 * Redirects all requests from auramind.gchocmac.workers.dev to https://auramind.cloud
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const destination = `https://auramind.cloud${url.pathname}${url.search}`;
    return Response.redirect(destination, 301);
  },
};
