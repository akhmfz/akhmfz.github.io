import { roles } from './career';

export const activities = roles.map(({ period, activityTitle, org, category, detail, activityImage, activityImageAlt }) => ({
  period,
  title: activityTitle,
  org,
  category,
  detail,
  image: activityImage,
  imageAlt: activityImageAlt,
}));
