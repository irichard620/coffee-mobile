export function getTempUnit(useMetric) {
  let tempUnit = '\u2109';
  if (useMetric) {
    tempUnit = '\u2103';
  }
  return tempUnit;
}

export function translateTempToCelsius(tempString) {
  const newTemp = Number.parseFloat(Number(tempString));
  return Math.round((newTemp - 32) * (5.0 / 9.0)).toString();
}

export function translateTempToFahrenheit(tempString) {
  const newTemp = Number.parseFloat(Number(tempString));
  return Math.round((newTemp * (9.0 / 5.0)) + 32).toString();
}
