export function requirePinnedSample(sample) {
  if (!sample || !/^[0-9a-f]{40}$/i.test(sample.commit || '')) {
    throw new Error('sample.commit must be a full 40-character git commit')
  }
  return sample.commit
}
