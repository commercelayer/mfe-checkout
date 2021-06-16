const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')

const path = require("path")

module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config) => {
    config.plugins.push(new DuplicatePackageCheckerPlugin())
    config.resolve.alias['axios'] = path.resolve(
      __dirname,
      'node_modules',
      'axios',
    )
    config.resolve.alias['strip-ansi'] = path.resolve(
      __dirname,
      'node_modules',
      'next/dist/compiled/strip-ansi',
    )
    config.resolve.alias['@babel/runtime'] = path.resolve(
      __dirname,
      'node_modules',
      '@babel/runtime',
    )
    config.resolve.alias['@commercelayer/js-sdk'] = path.resolve(
      __dirname,
      'node_modules',
      '@commercelayer/js-sdk',
    )

    return config
  },
}