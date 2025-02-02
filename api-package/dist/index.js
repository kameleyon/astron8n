"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOUSE_SYSTEMS = exports.ASPECT_TYPES = exports.PLANETS = exports.ZODIAC_SIGNS = exports.BirthChartCalculator = void 0;
exports.createBirthChart = createBirthChart;
const calculator_1 = require("./calculator");
Object.defineProperty(exports, "BirthChartCalculator", { enumerable: true, get: function () { return calculator_1.BirthChartCalculator; } });
const types_1 = require("./types");
Object.defineProperty(exports, "ZODIAC_SIGNS", { enumerable: true, get: function () { return types_1.ZODIAC_SIGNS; } });
Object.defineProperty(exports, "PLANETS", { enumerable: true, get: function () { return types_1.PLANETS; } });
Object.defineProperty(exports, "ASPECT_TYPES", { enumerable: true, get: function () { return types_1.ASPECT_TYPES; } });
Object.defineProperty(exports, "HOUSE_SYSTEMS", { enumerable: true, get: function () { return types_1.HOUSE_SYSTEMS; } });
// Create a default instance with default configuration
function createBirthChart(config) {
    return new calculator_1.BirthChartCalculator(config);
}
