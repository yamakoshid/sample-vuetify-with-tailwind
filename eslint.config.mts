import prettier from 'eslint-config-prettier'
import vuetify from 'eslint-config-vuetify'
import withNuxt from './.nuxt/eslint.config.mjs'

const vuetifyConfigs = await vuetify(
  {
    ts: true,
  },
  {
    rules: {
      'vue/no-multiple-template-root': 'off',
    },
  },
)

export default withNuxt({
  settings: {
    tailwindcss: {
      config: {},
    },
  },
})
  .append(...vuetifyConfigs)
  .append(prettier)
