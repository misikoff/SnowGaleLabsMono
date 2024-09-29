// Learn more https://docs.expo.dev/guides/monorepos

// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path')

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getDefaultConfig } = require('expo/metro-config')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { FileStore } = require('metro-cache')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { withNativeWind } = require('nativewind/metro')

// eslint-disable-next-line no-undef
const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// #1 - Watch all files in the monorepo
config.watchFolders = [workspaceRoot]
// #3 - Force resolving nested modules to the folders below
config.resolver.disableHierarchicalLookup = true
// #2 - Try resolving with project modules first, then workspace modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// Use turborepo to restore the cache when possible
config.cacheStores = [
  new FileStore({
    root: path.join(projectRoot, 'node_modules', '.cache', 'metro'),
  }),
]

module.exports = withNativeWind(config, { input: './global.css' })
