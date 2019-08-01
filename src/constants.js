import { LayoutAnimation } from 'react-native';

// Brew vessel types
export const VESSEL_AEROPRESS = 'vessel1';
export const VESSEL_CHEMEX = 'vessel2';
export const VESSEL_FRENCH_PRESS = 'vessel3';
export const VESSEL_POUROVER = 'vessel4';

// Filter types
export const FILTER_PAPER = 'filter1';
export const FILTER_METAL = 'filter2';
export const FILTER_CLOTH = 'filter3';

// Orienation/Sizes
export const ORIENTATION_UPRIGHT = 'orientation1';
export const ORIENTATION_INVERTED = 'orientation2';
export const ORIENTATION_4_CUP = 'orientation3';
export const ORIENTATION_8_CUP = 'orientation4';
export const ORIENTATION_12_CUP = 'orientation5';

// Grind Sizes
export const GRIND_FINE = 'fine';
export const GRIND_MEDIUM_FINE = 'medium-fine';
export const GRIND_MEDIUM = 'medium';
export const GRIND_MEDIUM_COARSE = 'medium-coarse';
export const GRIND_COARSE = 'coarse';

// Brew steps
export const STEP_HEAT_WATER = 'step1';
export const STEP_GRIND_COFFEE = 'step2';
export const STEP_RINSE_FILTER = 'step3';
export const STEP_ADD_GROUNDS = 'step4';
export const STEP_BLOOM_GROUNDS = 'step5';
export const STEP_POUR_WATER = 'step6';
export const STEP_WAIT = 'step7';
export const STEP_ADD_ICE = 'step8';
export const STEP_STIR = 'step9';
export const STEP_INSERT_PLUNGER = 'step10';
export const STEP_PUSH_PLUNGER = 'step11';
export const STEP_PUSH_FILTER = 'step12';

// Modal IDs
export const NEW_STEP_ELEM = 'step';
export const RECIPE_NAME_ELEM = 'name';
export const VESSEL_ELEM = 'vessel';
export const FILTER_ELEM = 'filter';
export const ORIENTATION_ELEM = 'orientation';
export const BEAN_ELEM = 'bean';

// Labels for different IDs
export const vesselLabels = {
  [VESSEL_AEROPRESS]: 'Aeropress',
  [VESSEL_CHEMEX]: 'Chemex',
  [VESSEL_FRENCH_PRESS]: 'French Press',
  [VESSEL_POUROVER]: 'V60 Pourover',
};
export const filterLabels = {
  [FILTER_PAPER]: 'Paper',
  [FILTER_METAL]: 'Metal',
  [FILTER_CLOTH]: 'Cloth',
};
export const orientationLabels = {
  [ORIENTATION_UPRIGHT]: 'Upright',
  [ORIENTATION_INVERTED]: 'Inverted',
  [ORIENTATION_4_CUP]: '4 Cup',
  [ORIENTATION_8_CUP]: '8 Cup',
  [ORIENTATION_12_CUP]: '12 Cup',
};
export const stepLabels = {
  [STEP_HEAT_WATER]: 'Heat Water',
  [STEP_GRIND_COFFEE]: 'Grind Coffee',
  [STEP_RINSE_FILTER]: 'Rinse Filter',
  [STEP_ADD_GROUNDS]: 'Add Grounds',
  [STEP_BLOOM_GROUNDS]: 'Bloom Grounds',
  [STEP_POUR_WATER]: 'Pour Water',
  [STEP_WAIT]: 'Wait',
  [STEP_ADD_ICE]: 'Add Ice',
  [STEP_STIR]: 'Stir',
  [STEP_INSERT_PLUNGER]: 'Insert Plunger',
  [STEP_PUSH_PLUNGER]: 'Push Down Plunger',
  [STEP_PUSH_FILTER]: 'Push Down Filter'
};

// Filters for each vessel
export const filters = {
  [VESSEL_AEROPRESS]: [FILTER_PAPER, FILTER_METAL],
  [VESSEL_CHEMEX]: [FILTER_PAPER, FILTER_METAL, FILTER_CLOTH],
  [VESSEL_FRENCH_PRESS]: [FILTER_METAL],
  [VESSEL_POUROVER]: [FILTER_PAPER, FILTER_METAL, FILTER_CLOTH],
};

// Orientations for each vessel
export const orientations = {
  [VESSEL_AEROPRESS]: [ORIENTATION_UPRIGHT, ORIENTATION_INVERTED],
  [VESSEL_FRENCH_PRESS]: [ORIENTATION_4_CUP, ORIENTATION_8_CUP, ORIENTATION_12_CUP]
};

// List of all grind sizes
export const grindSizes = [GRIND_FINE, GRIND_MEDIUM_FINE, GRIND_MEDIUM,
  GRIND_MEDIUM_COARSE, GRIND_COARSE];

// recipe menu options
export const RECIPE_MENU_EDIT = 'recipe_menu1';
export const RECIPE_MENU_FAVORITE = 'recipe_menu2';
export const RECIPE_MENU_UNFAVORITE = 'recipe_menu3';
export const RECIPE_MENU_DELETE = 'recipe_menu4';
export const RECIPE_MENU_CANCEL = 'recipe_menu5';

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
