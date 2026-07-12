import examples from '../data/examples.json';

export async function mockGetExamples() {
  return { data: examples };
}
