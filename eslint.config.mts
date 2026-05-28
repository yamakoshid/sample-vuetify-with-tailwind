import vuetify from "eslint-config-vuetify";
import pluginTailwindCss from "eslint-plugin-tailwindcss";
import withNuxt from "./.nuxt/eslint.config.mjs";

const vuetifyConfigs = await vuetify(
  {
    ts: {
      preset: "all",
    },
  },
  {
    rules: {
      "vue/no-multiple-template-root": "off",
    },
  },
);

export default withNuxt({
  settings: {
    tailwindcss: {
      config: {},
    },
  },
})
  .append(...vuetifyConfigs)
  .append(...pluginTailwindCss.configs["flat/recommended"]);
