const { compile } = require('@riotjs/compiler')
const { Asset } = require('parcel-bundler')
const { relative, dirname } = require('path')

/**
 * Generate the hmr code depending on the tag generated by the compiler
 * @param   {string} path - path to the component file
 * @returns {string} the code needed to handle the riot hot reload
 */
function hotReload(path) {
  return `;(() => {
  if (module.hot) {
    const hotReload = require('@riotjs/hot-reload').default
    module.hot.accept()
    if (module.hot.data) {
      const component = require('./${path}').default;
      hotReload(component)
    }
  }
})()`
}

class RiotAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options)
    this.type = 'js'
  }

  async generate() {
    const options = (await this.getConfig(['.riotrc', '.riotrc.js', 'riot.config.js'])) || {}
    const {code, map} = compile(this.contents, {
      file: this.relativeName,
      ...options
    })

    return [
      {
        sourceMap: this.options.sourceMaps ? map : false,
        type: 'js',
        value: `${code}${options.hot ? hotReload(relative(dirname(this.name), this.relativeName)) : ''}`
      }
    ]
  }
}

module.exports = RiotAsset
