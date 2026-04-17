import vuetify from 'eslint-config-vuetify'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  vuetify({
    ts: true,
    // rules: {
    //   'vue/no-multiple-template-root': 'off', // Nuxt 3 supports multiple root nodes in templates
    // },
  }),
)
