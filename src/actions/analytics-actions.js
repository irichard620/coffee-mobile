import analytics from '@react-native-firebase/analytics';

export async function brewStartAnalytics(recipeId, recipeName, brewingVessel, sponsorId) {
  await analytics().logEvent('brew_start', {
    recipe_id: recipeId,
    recipe_name: recipeName,
    brewing_vessel: brewingVessel,
    sponsor_id: sponsorId
  });
}

export async function brewFinishAnalytics(recipeId, recipeName, brewingVessel, sponsorId) {
  await analytics().logEvent('brew_finish', {
    recipe_id: recipeId,
    recipe_name: recipeName,
    brewing_vessel: brewingVessel,
    sponsor_id: sponsorId
  });
}

export async function sponsorRecipeAnalytics(recipeId, recipeName, brewingVessel, sponsorId) {
  await analytics().logEvent('download_sponsor_recipe', {
    recipe_id: recipeId,
    recipe_name: recipeName,
    brewing_vessel: brewingVessel,
    sponsor_id: sponsorId
  });
}

export async function builderNewRecipeAnalytics() {
  await analytics().logEvent('builder_new_recipe', {});
}

export async function builderEditRecipeAnalytics() {
  await analytics().logEvent('builder_edit_recipe', {});
}
