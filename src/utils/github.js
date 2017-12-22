export const buildRepoPath = ({ owner, repository }) =>
  `${owner}/${repository}`

export const parseRepoPath = (path) =>
  path.split('/').slice(0, 2)

export const isValidRepoPath = (path) =>
  /^[a-z0-9-][a-z0-9-]*[a-z0-9]\/[a-z0-9][a-z0-9-]*[a-z0-9]$/i.test(path)
