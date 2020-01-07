import { LayoutAnimation } from 'react-native';

// Brew vessel types
export const VESSEL_AEROPRESS = 'Aeropress';
export const VESSEL_CHEMEX = 'Chemex';
export const VESSEL_FRENCH_PRESS = 'French Press';
export const VESSEL_POUROVER = 'V60 Pourover';
export const VESSEL_KALITA_WAVE = 'Kalita Wave';
export const VESSEL_MIZUDASHI = 'Mizudashi';
export const vessels = [VESSEL_AEROPRESS, VESSEL_CHEMEX, VESSEL_FRENCH_PRESS,
  VESSEL_POUROVER, VESSEL_KALITA_WAVE, VESSEL_MIZUDASHI];
export const vesselApiNames = {
  [VESSEL_AEROPRESS]: 'aeropress',
  [VESSEL_CHEMEX]: 'chemex',
  [VESSEL_FRENCH_PRESS]: 'french_press',
  [VESSEL_POUROVER]: 'v60_pourover',
  [VESSEL_KALITA_WAVE]: 'kalita_wave',
  [VESSEL_MIZUDASHI]: 'mizudashi',
};

// Filter types
export const FILTER_PAPER = 'Paper';
export const FILTER_METAL = 'Metal';
export const FILTER_CLOTH = 'Cloth';
export const FILTER_MESH = 'Mesh';
export const filters = {
  [VESSEL_AEROPRESS]: [FILTER_PAPER, FILTER_METAL],
  [VESSEL_CHEMEX]: [FILTER_PAPER, FILTER_METAL, FILTER_CLOTH],
  [VESSEL_FRENCH_PRESS]: [FILTER_METAL],
  [VESSEL_POUROVER]: [FILTER_PAPER, FILTER_METAL, FILTER_CLOTH],
  [VESSEL_KALITA_WAVE]: [FILTER_PAPER, FILTER_METAL, FILTER_CLOTH],
  [VESSEL_MIZUDASHI]: [FILTER_MESH],
};

// Orienation/Sizes
export const ORIENTATION_UPRIGHT = 'Upright';
export const ORIENTATION_INVERTED = 'Inverted';
export const ORIENTATION_4_CUP = '4 Cup';
export const ORIENTATION_8_CUP = '8 Cup';
export const ORIENTATION_12_CUP = '12 Cup';
export const ORIENTATION_1000_ML = '1000 mL';
export const ORIENTATION_600_ML = '600 mL';
export const orientations = {
  [VESSEL_AEROPRESS]: [ORIENTATION_UPRIGHT, ORIENTATION_INVERTED],
  [VESSEL_FRENCH_PRESS]: [ORIENTATION_4_CUP, ORIENTATION_8_CUP, ORIENTATION_12_CUP],
  [VESSEL_MIZUDASHI]: [ORIENTATION_1000_ML, ORIENTATION_600_ML],
};

// Grind Sizes
export const GRIND_FINE = 'fine';
export const GRIND_MEDIUM_FINE = 'medium-fine';
export const GRIND_MEDIUM = 'medium';
export const GRIND_MEDIUM_COARSE = 'medium-coarse';
export const GRIND_COARSE = 'coarse';
export const grindSizes = [GRIND_FINE, GRIND_MEDIUM_FINE, GRIND_MEDIUM,
  GRIND_MEDIUM_COARSE, GRIND_COARSE];

// Brew steps
export const STEP_HEAT_WATER = 'Heat Water';
export const STEP_CHILL_WATER = 'Chill Water';
export const STEP_INSERT_FILTER = 'Insert Filter';
export const STEP_GRIND_COFFEE = 'Grind Coffee';
export const STEP_RINSE_FILTER = 'Rinse Filter';
export const STEP_ADD_GROUNDS = 'Add Grounds';
export const STEP_BLOOM_GROUNDS = 'Bloom Grounds';
export const STEP_POUR_WATER = 'Pour Water';
export const STEP_WAIT = 'Wait';
export const STEP_ADD_ICE = 'Add Ice';
export const STEP_STIR = 'Stir';
export const STEP_INSERT_PLUNGER = 'Insert Plunger';
export const STEP_PUSH_PLUNGER = 'Push Down Plunger';
export const STEP_PUSH_FILTER = 'Push Down Filter';
export const STEP_STEEP = 'Steep';
export const steps = [STEP_HEAT_WATER, STEP_CHILL_WATER, STEP_INSERT_FILTER, STEP_GRIND_COFFEE,
  STEP_RINSE_FILTER, STEP_ADD_GROUNDS, STEP_BLOOM_GROUNDS, STEP_POUR_WATER, STEP_WAIT, STEP_ADD_ICE,
  STEP_STIR, STEP_INSERT_PLUNGER, STEP_PUSH_PLUNGER, STEP_PUSH_FILTER, STEP_STEEP];

// Modal IDs
export const NEW_STEP_ELEM = 'step';
export const RECIPE_NAME_ELEM = 'name';
export const VESSEL_ELEM = 'vessel';
export const FILTER_ELEM = 'filter';
export const ORIENTATION_ELEM = 'orientation';
export const BEAN_ELEM = 'bean';
export const USER_NAME_ELEM = 'username';
export const RECIPE_DESCRIPTION_ELEM = 'description';

// Builder details
export const BUILDER_RECIPE_NAME_DETAIL = 'Recipe Name';
export const BUILDER_VESSEL_DETAIL = 'Brew Vessel';
export const BUILDER_VESSEL_SIZE_DETAIL = 'Vessel Size';
export const BUILDER_FILTER_DETAIL = 'Filter';
export const BUILDER_DESCRIPTION_DETAIL = 'Recipe Description';
export const BUILDER_RATIO = 'Coffee Water Ratio';
export const details = [BUILDER_RECIPE_NAME_DETAIL, BUILDER_VESSEL_DETAIL,
  BUILDER_VESSEL_SIZE_DETAIL, BUILDER_FILTER_DETAIL, BUILDER_DESCRIPTION_DETAIL,
  BUILDER_RATIO];

// recipe menu options
export const RECIPE_MENU_EDIT = 'Edit recipe';
export const RECIPE_MENU_FAVORITE = 'Favorite recipe';
export const RECIPE_MENU_UNFAVORITE = 'Unfavorite recipe';
export const RECIPE_MENU_DELETE = 'Delete';
export const RECIPE_MENU_CANCEL = 'Cancel';
export const RECIPE_MENU_DRIPPY_PRO = 'Drippy Pro';

// Settings options
export const SETTINGS_PRO = 'Drippy Pro';
export const SETTINGS_PRO_EXISTS = 'Drippy Pro Exists';
export const SETTINGS_PROFILE = 'Profile';
export const SETTINGS_DEFAULT_RECIPES = 'Default Recipes';
export const settings = [SETTINGS_PRO, SETTINGS_PROFILE, SETTINGS_DEFAULT_RECIPES];
export const settingsDescriptions = {
  [SETTINGS_PRO]: 'Love Drippy? Support our two person team by getting our next cup of coffee!'
    + ' As a Drippy Pro user, you’ll get unlimited recipe storage and access to the builder,'
    + ' where you can create and edit recipes to your liking. You’ll have access to all the'
    + ' special Drippy Pro features we have planned for the future, too. (And that’s a lot, we promise.)',
  [SETTINGS_PRO_EXISTS]: 'Thanks for supporting Drippy Pro! We think you will love our upcoming features.',
  [SETTINGS_PROFILE]: '',
  [SETTINGS_DEFAULT_RECIPES]: ''
};
export const OPTION_GET_DRIPPY_PRO = 'Get Drippy Pro';
export const OPTION_RESTORE_PURCHASE = 'Restore Purchase';
export const OPTION_TEMP_UNITS = 'Temperature Units';
export const OPTION_REPLAY_TUTORIAL = 'Replay Tutorial';
export const OPTION_HIDE_DEFAULT = 'Hide Default Recipes';
export const OPTION_RESTORE_DEFAULT = 'Restore Default Recipes';
export const settingsOptions = {
  [SETTINGS_PRO_EXISTS]: [],
  [SETTINGS_PRO]: [{ title: OPTION_GET_DRIPPY_PRO }, { title: OPTION_RESTORE_PURCHASE }],
  [SETTINGS_PROFILE]: [{ title: OPTION_TEMP_UNITS },
    { title: OPTION_REPLAY_TUTORIAL }],
  [SETTINGS_DEFAULT_RECIPES]: [{ title: OPTION_HIDE_DEFAULT }, { title: OPTION_RESTORE_DEFAULT }],
};

// Modal types
export const MODAL_TYPE_BOTTOM = 'bottom';
export const MODAL_TYPE_CENTER = 'center';

// Popup options
export const POPUP_TITLE_DRIPPY_PRO = 'Drippy Pro Feature';
export const POPUP_TITLE_DRIPPY_PRO_LIBRARY = 'Recipe Library Full';
export const POPUP_TITLE_DRIPPY_PRO_AD = 'Get Drippy Pro';
export const POPUP_DESCRIPTION_DRIPPY_PRO = 'Drippy Pro comes with a whole bunch of fun, '
  + 'new features, and it’s a one-time purchase that helps support our little team of two! '
  + 'Enjoy unlimited recipe storage, access to the Recipe Builder to create and edit to your '
  + 'heart’s desire, and all future Pro features we have in the works.';

// Homepage ads
export const AD_TITLE_DRIPPY_PRO = 'Upgrade to Drippy Pro';
export const AD_DESCRIPTION_DRIPPY_PRO = 'Enjoy unlimited recipe storage, recipe building, '
  + 'and access to all future Pro features with a one time purchase of Drippy Pro. Support our '
  + 'tiny team for less than the price of a coffee!';

// Brew details
export const BREW_BREW_SIZE_DETAIL = 'Brew Size';
export const BREW_LEARN_MORE_DETAIL = 'Learn More';
export const BREW_HISTORY_DETAIL = 'History';
export const brewDetails = [BREW_BREW_SIZE_DETAIL, BREW_LEARN_MORE_DETAIL, BREW_HISTORY_DETAIL];

// Animation
export const CustomLayoutSpring = {
  duration: 325,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
    springDamping: 0.6,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
    springDamping: 0.6,
  },
};
export const CustomLayoutEaseIn = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  }
};
