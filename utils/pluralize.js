export default (number, singularWord) => {
  const text = `${number} ${singularWord}`
  return number === 1 ? text : text + 's'
}
