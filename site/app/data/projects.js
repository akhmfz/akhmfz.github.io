import projects from './projects-content.json';

// Shared by the home summaries and the /projects/:slug pages, so the copy only
// lives in one place.
export { projects };

export function getProject(slug) {
  return projects.find(project => project.slug === slug);
}
