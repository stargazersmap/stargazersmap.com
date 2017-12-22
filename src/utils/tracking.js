import { buildRepoPath } from './github'

export const trackEvent = (label, data) => {
  window.gtag && window.gtag('event', label, data)
}

export const trackVisualization = ({ owner, repository }) =>
  trackEvent('visualize', {
    event_category: 'Repository',
    event_action: 'Visualize',
    event_label: buildRepoPath({ owner, repository }),
    owner,
    repository,
  })
