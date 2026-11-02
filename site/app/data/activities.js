import { roles } from './career';

export const activities = roles.map(({ period, activityTitle, org, category, detail }) => ({
  period,
  title: activityTitle,
  org,
  category,
  detail,
}));
