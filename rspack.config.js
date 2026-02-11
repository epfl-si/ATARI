const { defineConfig } = require('@meteorjs/rspack');

/**
 * Rspack configuration for Meteor projects.
 *
 * Provides typed flags on the `Meteor` object, such as:
 * - `Meteor.isClient` / `Meteor.isServer`
 * - `Meteor.isDevelopment` / `Meteor.isProduction`
 * - …and other flags available
 *
 * Use these flags to adjust your build settings based on environment.
 */
module.exports = defineConfig(Meteor => {
  return {
    module: {
      rules: [ typescriptRule(), jsxRule(), tsxRule() ]
    }
  }
});

function typescriptRule () {
  // https://rspack.rs/guide/tech/typescript
  return {
    test: /\.ts$/,
    loader: 'builtin:swc-loader',
    options: {
      jsc: {
        parser: {
          syntax: 'typescript',
        },
      },
    },
    type: 'javascript/auto',
  }
}

function jsxRule () {
  // https://rspack.rs/guide/tech/react
  return {
    test: /\.jsx$/,
    use: {
      loader: 'builtin:swc-loader',
      options: {
        jsc: {
          parser: {
            syntax: 'ecmascript',
            jsx: true,
          },
        },
      },
    },
    type: 'javascript/auto',
  }
}

function tsxRule () {
  // https://rspack.rs/guide/tech/react
  return {
    test: /\.tsx$/,
    use: {
      loader: 'builtin:swc-loader',
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
        },
      },
    },
    type: 'javascript/auto',
  }
}
