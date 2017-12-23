export const buildRepoPath = ({ owner, repository }) =>
  `${owner}/${repository}`

export const parseRepoPath = (path) =>
  path.split('/').slice(0, 2)

export const isValidRepoPath = (path) => {
  const [owner, repository] = parseRepoPath(path)
  return isValidLoginName(owner) && isValidRepoName(repository)
}

export const isValidLoginName = (str) =>
  /^[a-z0-9][a-z0-9-]*[a-z0-9]$/i.test(str) &&
  !/-{2,}/.test(str)

export const isValidRepoName = (str) =>
  /^[a-z0-9-._]*$/.test(str)
