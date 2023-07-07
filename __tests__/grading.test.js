/**
 * @jest-environment node
 */
const fs = require('fs');
const path = require("path");
const { JSDOM } = require("jsdom");
const { window } = new JSDOM(fs.readFileSync(path.resolve(__dirname, "../index.html"), 'utf8'));
const { document } = window;
const { screen } = require('@testing-library/jest-dom');

var studentFunctions = require('../scriptHelper.js');
let script = fs.readFileSync(path.resolve(__dirname, "../script.js"), 'utf8');

const studentPlanet = studentFunctions.pickPlanet.toString();

const planetsResponse = [
   {
      "name": "Tatooine",
      "diameter": "10465 km",
      "star": "Tatoo I & Tatoo II",
      "distance": "43000 light years from galactic core",
      "image": "https://www.nasa.gov/sites/default/files/images/587837main_Kepler16_transit_art2_full.jpg",
      "moons": 3
   },
   {
       "name": "Pern",
       "diameter": "measurement is under dispute",
       "star": "Alpha Sagittarius (a.k.a. Rukbat)",
       "distance": "Varies - find a library",
       "image": "https://www.nasa.gov/centers/langley/images/content/698148main_Brains_904_2.jpg",
       "moons": 2
   },
   {
       "name": "Saturn/Titan",
       "diameter": "5149.5 km",
       "star": "Sol",
       "distance": "1.4 billion km from Earth",
       "image": "https://solarsystem.nasa.gov/system/resources/detail_files/16278_PIA20016.jpg",
       "moons": 0
   },
   {
       "name": "Mars",
       "diameter": "6779 km",
       "star": "Sol",
       "distance": "225 million km from Earth",
       "image": "https://mars.nasa.gov/system/resources/detail_files/7808_global-color-views-mars-PIA00407-full2.jpg",
       "moons": 2
   },
   {
       "name": "K2-18b",
       "diameter": "34500 km",
       "star": "K2-18",
       "distance": "110 light years from Earth",
       "image": "https://www.nasa.gov/sites/default/files/thumbnails/image/heic1916a.jpg",
       "moons": "unknown"
   },
   {
       "name": "Jupiter/Europa",
       "diameter": "3,121.6 km",
       "star": "Sol",
       "distance": "628.3 million km from Earth",
       "image": "https://apod.nasa.gov/apod/image/1609/Europa_Galileo_960.jpg",
       "moons": 0
   }
 ];


describe('Test student work on helper functions', () => {

   let list, h2, pilotStatus, copilotStatus, fuelStatus, cargoStatus;

   beforeEach(() => {
      list = document.getElementById("faultyItems");
      h2 = document.getElementById("launchStatus");
      pilotStatus = document.getElementById("pilotStatus");
      copilotStatus = document.getElementById("copilotStatus");
      fuelStatus = document.getElementById("fuelStatus");
      cargoStatus = document.getElementById("cargoStatus");
    });

   test("Function properly validates text", () => {
      expect(studentFunctions.validateInput("")).toEqual("Empty");
      expect(studentFunctions.validateInput("asdf")).toEqual("Not a Number");
      expect(studentFunctions.validateInput("10")).toEqual("Is a Number");
   });

   test('List is properly initialized', () => {
      expect(list).not.toBeVisible(); 
      expect(h2).toHaveTextContent("Awaiting Information Before Launch");
      expect(pilotStatus).toHaveTextContent("Pilot Ready");
      expect(copilotStatus).toHaveTextContent("Co-pilot Ready");
      expect(fuelStatus).toHaveTextContent("Fuel level high enough for launch");
      expect(cargoStatus).toHaveTextContent("Cargo mass low enough for launch");
   });

   test("Launch Checklist when fuel too low for launch", () => {
         // Shuttle should be not be ready for launch, fuel too low
         studentFunctions.formSubmission(document, list, "Chris", "Bob", 0, 5);
         expect(list).toBeVisible();
         expect(h2).toHaveStyle({color: 'red'});
         expect(h2).toHaveTextContent("Shuttle Not Ready for Launch");
         expect(pilotStatus).toHaveTextContent("Pilot Chris is ready for launch");
         expect(copilotStatus).toHaveTextContent("Co-pilot Bob is ready for launch");
         expect(fuelStatus).toHaveTextContent("Fuel level too low for launch");
         expect(cargoStatus).toHaveTextContent("Cargo mass low enough for launch");
   });

   test("Launch Checklist when cargo too heavy for launch", () => {
      // Shuttle should not be ready for launch, cargo too high
      studentFunctions.formSubmission(document, list, "Chris", "Bob", 10000, 100000);
      expect(list).toBeVisible();
      expect(h2).toHaveStyle({color: 'red'});
      expect(h2).toHaveTextContent("Shuttle Not Ready for Launch");
      expect(pilotStatus).toHaveTextContent("Pilot Chris is ready for launch");
      expect(copilotStatus).toHaveTextContent("Co-pilot Bob is ready for launch");
      expect(fuelStatus).toHaveTextContent("Fuel level high enough for launch");
      expect(cargoStatus).toHaveTextContent("Cargo mass too heavy for launch");
   });

   test("Launch Checklist when cargo too heavy and fuel too low for launch", () => {
      // Shuttle should not be ready for launch, cargo too high, fuel too low
      studentFunctions.formSubmission(document, list, "Chris", "Bob", 0, 100000);
      expect(list).toBeVisible();
      expect(h2).toHaveStyle({color: 'red'});
      expect(h2).toHaveTextContent("Shuttle Not Ready for Launch");
      expect(pilotStatus).toHaveTextContent("Pilot Chris is ready for launch");
      expect(copilotStatus).toHaveTextContent("Co-pilot Bob is ready for launch");
      expect(fuelStatus).toHaveTextContent("Fuel level too low for launch");
      expect(cargoStatus).toHaveTextContent("Cargo mass too heavy for launch");
   });

   test("Launch Checklist when everything is good to go", () => { 
      // Shuttle should be ready for launch, enough fuel and cargo
      studentFunctions.formSubmission(document, list, "Chris", "Bob", 10000, 1);
      expect(list).toBeVisible();
      expect(h2).toHaveStyle({color: 'green'});
      expect(h2).toHaveTextContent("Shuttle is Ready for Launch");
      expect(pilotStatus).toHaveTextContent("Pilot Chris is ready for launch");
      expect(copilotStatus).toHaveTextContent("Co-pilot Bob is ready for launch");
      expect(fuelStatus).toHaveTextContent("Fuel level high enough for launch");
      expect(cargoStatus).toHaveTextContent("Cargo mass low enough for launch");
   });

   test("Mission target has the appropriate info", () => {
      let missionTarget = document.getElementById("missionTarget");
      let testTarget = missionTarget.innerHTML.replace(/\s/g,'');
      expect(testTarget).toBe("<!--Fetchsomeplanetarydata-->");
      studentFunctions.addDestinationInfo(window.document, "Saturn/Titan", "5149.5 km", "Sol", "1.4 billion km from Earth", "0", "https://solarsystem.nasa.gov/system/resources/detail_files/16278_PIA20016.jpg");
      testTarget = missionTarget.innerHTML.replace(/\s/g,'');
      expect(testTarget).toBe('<h2>MissionDestination</h2><ol><li>Name:Saturn/Titan</li><li>Diameter:5149.5km</li><li>Star:Sol</li><li>DistancefromEarth:1.4billionkmfromEarth</li><li>NumberofMoons:0</li></ol><imgsrc="https://solarsystem.nasa.gov/system/resources/detail_files/16278_PIA20016.jpg">');
   });

   test("Script contains calls to appropriate helper functions", () => {
      expect(script.includes("formSubmission(")).toBeTruthy();
      expect(script.includes("myFetch(")).toBeTruthy();
      expect(script.includes("pickPlanet(")).toBeTruthy();
      expect(script.includes("addDestinationInfo(")).toBeTruthy();
   });

   test("Student selects planet at random", () => {
      expect(studentPlanet.includes("Math.random()")).toBeTrue;
      expect(planetsResponse.includes(studentFunctions.pickPlanet(planetsResponse))).toBe(true);
  });

  test("Student is fetching list of planets", async function() {
      const result = await studentFunctions.myFetch();
      expect(result).toEqual(planetsResponse);
   });

});