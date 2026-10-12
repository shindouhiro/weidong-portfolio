import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  stylistic: true,
  ignores: ['dist/**', 'tmp/**'],
}, {
  rules: {
    'vue/max-attributes-per-line': 'off',
    'vue/html-self-closing': 'off',
  },
})
