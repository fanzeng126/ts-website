
const { resolve } = require('path')

module.exports = {

  browser: {
    alias: {
      entries: [
        { find: '@', replacement: resolve(__dirname, 'src/web-content') },
        {
          find: '@utils',
          replacement: resolve(__dirname, 'src/web-content/utils')
        }
      ]
    },
    vue: {
      css: false,
      config: {
        devtools: process.env.NODE_ENV === 'development'
      }
    },
    postcss: {
    },
    globals: {
      '@mctech/vue-kaka-grid': 'VueKakaGrid'
    }
  },
  sourcemap: true,
  clear: ['dist'],
  copy: {
    'src/server/bootstrap.yml': 'dist/bootstrap.yml',
    'src/server/individual.yml': 'dist/individual.yml',
    'node_modules/vue/dist': 'dist/web-content/lib/vue',
    'node_modules/vuex/dist': 'dist/web-content/lib/vuex',
    'node_modules/vue-router/dist': 'dist/web-content/lib/vue-router',
    'node_modules/axios/dist': 'dist/web-content/lib/axios',
    'node_modules/element-resize-detector/dist': 'dist/web-content/lib/element-resize-detector',
    'node_modules/@mctech/mussel/dist': 'dist/web-content/lib/mussel',
    'node_modules/@mctech/kaka-grid/dist': 'dist/web-content/lib/kaka-grid',
    'node_modules/@mctech/perfect-scrollbar/dist': 'dist/web-content/lib/perfect-scrollbar',
    'node_modules/@mctech/perfect-scrollbar/css': 'dist/web-content/lib/perfect-scrollbar',
    'node_modules/@mctech/vue-kaka-grid/dist': 'dist/web-content/lib/vue-kaka-grid',
    'node_modules/@mctech/web-frame/dist': 'dist/web-content/lib/web-frame',
    'node_modules/@mctech/infra-cloud/src/error/templates': 'dist/web-content/templates',
    'src/web-content/asset': 'dist/web-content/asset',
  },
  entries: {
    // 服务
    server: {
      alias: {
        entries: [
          {
            find: '@lib',
            replacement: resolve(__dirname, 'src/lib')
          }
        ]
      },
      input: 'src/server/index.js',
      output: 'dist/app.js'
    },
    concrete_part_match: {
      title: '混凝土部位关联',
      input: 'src/web-content/module/concrete-part-match/index.js',
      output: 'dist/web-content/asset/concrete-part-match.js'
    },
    // mixer_station_config: {
    //   title: '搅拌站机组配置',
    //   input: 'src/web-content/module/mixer-station-config/index.js',
    //   output: 'dist/web-content/asset/mixer-station-config.js'
    // },
    // concrete_history_data: {
    //   title: '混凝土历史数据补录',
    //   input: 'src/web-content/module/concrete-history-data/index.js',
    //   output: 'dist/web-content/asset/concrete-history-data.js'
    // },
    // concrete_basic_setting: {
    //   title: '基础数据设置',
    //   input: 'src/web-content/module/concrete-basic-setting/index.js',
    //   output: 'dist/web-content/asset/concrete-basic-setting.js'
    // },
    // concrete_team_analysis: {
    //   title: '队伍实时节超分析',
    //   input: 'src/web-content/module/concrete-team-analysis/index.js',
    //   output: 'dist/web-content/asset/concrete-team-analysis.js'
    // },
    // concrete_part_analysis: {
    //   title: '部位实时节超分析',
    //   input: 'src/web-content/module/concrete-part-analysis/index.js',
    //   output: 'dist/web-content/asset/concrete-part-analysis.js'
    // },
    theoretical_mixer_ratio: {
      title: '理论配合比台账',
      input: 'src/web-content/module/theoretical-mixer-ratio/index.js',
      output: 'dist/web-content/asset/theoretical-mixer-ratio.js'
    },
    concrete_material_analysis: {
      title: '地节材料分析',
      input: 'src/web-content/module/concrete-material-analysis/index.js',
      output: 'dist/web-content/asset/concrete-material-analysis.js'
    }
  }
}
