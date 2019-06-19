import uuidv4 from 'uuid/v4';
import AsyncStorage from '@react-native-community/async-storage';

function Recipe(id, recipeName, vesselId, brewingVessel, filterType, orientation,
  totalWater, totalCoffee, waterTemp, grindSize, steps) {
  // Get ID
  if (id == '') {
    this.id = uuidv4();
  } else {
    this.id = id;
  }

  // Assign other values
  this.recipeName = recipeName;
  this.vesselId = vesselId;
  this.brewingVessel = brewingVessel;
  this.filterType = filterType;
  this.orientation = orientation;
  this.totalWater = totalWater;
  this.totalCoffee = totalCoffee;
  this.waterTemp = waterTemp;
  this.grindSize = grindSize;
  this.steps = steps;

  // Functions
  this.getDescription = function() {
    // Line 1
    description = '';
    if (this.orientation != '') {
      description += this.orientation;
    }
    description += this.brewingVessel;
    description += 'with a ' + this.filterType + ' filter';
    description += '\n';

    // Line 2
    description += this.totalCoffee + ' grams coffee,' + this.grindSize;

    // Line 3
    description += this.totalWater + ' grams of water at ' this.waterTemp + '\u2109';

    return description
  }

  this.saveRecipeToLocal = function() {
    AsyncStorage
  }
}
