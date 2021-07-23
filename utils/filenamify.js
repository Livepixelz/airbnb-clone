export default string => {
  const regexp = /[\\/:"*?<>()|\s]+/g
  return string.replaceAll(regexp, '')
}
