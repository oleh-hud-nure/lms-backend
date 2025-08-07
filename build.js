require('esbuild').build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/bundle.js',
    external: ['bcrypt'],
    sourcemap: true,
}).catch(() => process.exit(1));
