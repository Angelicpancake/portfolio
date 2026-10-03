/** Prefix a root-relative public path with the deploy base path (GitHub Pages serves under /<repo>/). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
