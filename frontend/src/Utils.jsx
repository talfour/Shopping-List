const sortFoodItemsByTypeAndName = (items) => {
  items.sort((a, b) => {
    if (a.food_type < b.food_type) return -1;
    if (a.food_type > b.food_type) return 1;

    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;

    return 0;
  });
  return items;
};

export default sortFoodItemsByTypeAndName;
