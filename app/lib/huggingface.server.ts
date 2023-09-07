import { HfInference } from '@huggingface/inference';

import { genImageUrl } from './cloudinary.server';
import { Env } from './environment';

const inference = new HfInference(Env.HF_TOKEN);

export async function inferImageContent(imageId: string) {
  try {
    const { generated_text } = await inference.imageToText({
      data: await (await fetch(genImageUrl(imageId))).blob(),
      // model: 'paragon-AI/blip2-image-to-text',
      model: 'Salesforce/blip-image-captioning-large',
      // model: 'nlpconnect/vit-gpt2-image-captioning',
    });
    return generated_text;
  } catch (error) {
    console.error('error', error);
    return undefined;
  }
}
