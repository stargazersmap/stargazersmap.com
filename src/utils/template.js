export default (str = '', data = {}) =>
  Object.keys(data)
    .reduce(
      (str, key) => str.replace(`{{${key}}}`, data[key]),
      str
    )
