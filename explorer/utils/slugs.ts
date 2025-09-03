export const validSlug = (slug: string) => {
  // Validate that slug is not empty and contains only expected characters.
  if (slug === '' || !slug.match(/^[a-zA-Z0-9-]+$/)) {
    return false
  } else {
    return true
  }
}

export const slugToCamelCase = (slug: string) => {
  // Convert slug string from lowercase-with-dashes style to the CamelCase
  // style used for Vue components.
  return slug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}
