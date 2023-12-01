/* eslint-disable import/no-extraneous-dependencies */
import presetWind from '@unocss/preset-wind';
import transformerDirectives from '@unocss/transformer-directives';
import { defineConfig } from 'unocss';

export default defineConfig({
  presets: [presetWind()],
  transformers: [transformerDirectives()],
});
