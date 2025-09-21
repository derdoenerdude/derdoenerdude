import presetWind3 from '@unocss/preset-wind3';
import transformerDirectives from '@unocss/transformer-directives';
import { defineConfig } from 'unocss';

export default defineConfig({
  presets: [presetWind3()],
  transformers: [transformerDirectives()],
});
