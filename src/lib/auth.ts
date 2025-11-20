export function assertAdminAuth(request: Request, env: { ADMIN_TOKEN: string }): void {
  const token = request.headers.get('x-admin-token');

  if (!token || token !== env.ADMIN_TOKEN) {
    throw new Response('Unauthorized', { status: 401 });
  }
}

export function isAdminAuth(request: Request, env: { ADMIN_TOKEN: string }): boolean {
  const token = request.headers.get('x-admin-token');
  return token === env.ADMIN_TOKEN;
}
