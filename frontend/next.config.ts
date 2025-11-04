import type { NextConfig } from "next";
import fs, { access } from "node:fs/promises";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
    };

    /**
     * NOTE: Webpack doesn't recognize the necessity to source the WebAssembly asset, even if it recognizes
     * it is required to the codebase.
     * I solved this problem by writing the Webpack plugin CopyFileWebpackPlugin, which copies a file from
     *   a target to a destination.
     * If the problem turns to happen or it becomes insuficient refer to following issues:
     *   - https://github.com/vercel/next.js/issues/25852
     *   - https://github.com/vercel/next.js/discussions/35637
     */
    config.plugins.push(
      new CopyFileWebpackPlugin({
        from: path.resolve(__dirname, 'node_modules/@iota/identity-wasm/node/identity_wasm_bg.wasm'),
        to: path.resolve(__dirname, '.next/server/app/api/verify-domain-linkage/identity_wasm_bg.wasm'),
      }, { isServer }),
      new CopyFileWebpackPlugin({
        from: path.resolve(__dirname, 'node_modules/@iota/identity-wasm/node/identity_wasm_bg.wasm'),
        to: path.resolve(__dirname, '.next/server/vendor-chunks/identity_wasm_bg.wasm'),
      }, { isServer }),
    );
    return config;
  },
};

/**
 * Copy a file `from ` a target `to` a destination only if the build is targeting
 * the server, otherwise do nothing.
 */
class CopyFileWebpackPlugin {
  from;
  to;
  options;

  static defaultOptions = {
    isServer: false,
  };

  constructor(intruction = { from: '', to: '' }, options = {}) {
    this.from = intruction.from;
    this.to = intruction.to;
    this.options = { ...CopyFileWebpackPlugin.defaultOptions, ...options };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- turn off noise
  apply(compiler: any) {
    compiler.hooks.afterEmit.tapPromise(
      'CopyFileWebpackPlugin',
      async () => {
        if (this.options.isServer) {
          try {
            await access(this.to);
            console.log(`\t[CopyFileWebpackPlugin] ✓ ${this.to} already exists`);
            return;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- turn off noise
          } catch (error: any) {
            if (error.code === 'ENOENT') {
              // No file exists
            } else {
              throw error;
            }
          }

          await fs.mkdir(path.dirname(this.to), { recursive: true });
          await fs.copyFile(this.from, this.to);
          console.log(`\t[CopyFileWebpackPlugin] ✓ file copied from ${this.from} to ${this.to}`);
        }
      },
    );
  }
}

export default nextConfig;
