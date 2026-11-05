import { roles } from './career';

export const activities = roles.map(({ period, activityTitle, org, category, detail, activityImage, activityImageAlt, activityImagePosition }) => ({
  period,
  title: activityTitle,
  org,
  category,
  detail,
  image: activityImage,
  imageAlt: activityImageAlt,
  imagePosition: activityImagePosition,
}));
