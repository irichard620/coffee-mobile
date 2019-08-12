import { LayoutAnimation } from 'react-native';

// Brew vessel types
export const VESSEL_AEROPRESS = 'Aeropress';
export const VESSEL_CHEMEX = 'Chemex';
export const VESSEL_FRENCH_PRESS = 'French Press';
export const VESSEL_POUROVER = 'V60 Pourover';
export const vessels = [VESSEL_AEROPRESS, VESSEL_CHEMEX, VESSEL_FRENCH_PRESS,
  VESSEL_POUROVER];

// Filter types
export const FILTER_PAPER = 'Paper';
export const FILTER_METAL = 'Metal';
export const FILTER_CLOTH = 'Cloth';
export const filters = {
  [VESSEL_AEROPRESS]: [FILTER_PAPER, FILTER_METAL],
  [VESSEL_CHEMEX]: [FILTER_PAPER, FILTER_METAL, FILTER_CLOTH],
  [VESSEL_FRENCH_PRESS]: [FILTER_METAL],
  [VESSEL_POUROVER]: [FILTER_PAPER, FILTER_METAL, FILTER_CLOTH],
};

// Orienation/Sizes
export const ORIENTATION_UPRIGHT = 'Upright';
export const ORIENTATION_INVERTED = 'Inverted';
export const ORIENTATION_4_CUP = '4 Cup';
export const ORIENTATION_8_CUP = '8 Cup';
export const ORIENTATION_12_CUP = '12 Cup';
export const orientations = {
  [VESSEL_AEROPRESS]: [ORIENTATION_UPRIGHT, ORIENTATION_INVERTED],
  [VESSEL_FRENCH_PRESS]: [ORIENTATION_4_CUP, ORIENTATION_8_CUP, ORIENTATION_12_CUP]
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
export const steps = [STEP_HEAT_WATER, STEP_GRIND_COFFEE, STEP_RINSE_FILTER,
  STEP_ADD_GROUNDS, STEP_BLOOM_GROUNDS, STEP_POUR_WATER, STEP_WAIT, STEP_ADD_ICE,
  STEP_STIR, STEP_INSERT_PLUNGER, STEP_PUSH_PLUNGER, STEP_PUSH_FILTER];

// Modal IDs
export const NEW_STEP_ELEM = 'step';
export const RECIPE_NAME_ELEM = 'name';
export const VESSEL_ELEM = 'vessel';
export const FILTER_ELEM = 'filter';
export const ORIENTATION_ELEM = 'orientation';
export const BEAN_ELEM = 'bean';

// recipe menu options
export const RECIPE_MENU_EDIT = 'Edit recipe';
export const RECIPE_MENU_FAVORITE = 'Favorite recipe';
export const RECIPE_MENU_UNFAVORITE = 'Unfavorite recipe';
export const RECIPE_MENU_DELETE = 'Delete';
export const RECIPE_MENU_CANCEL = 'Cancel';

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
