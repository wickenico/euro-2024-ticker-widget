/* --------------------------------------------------------------
Script: euro-2024-ticker-widget
Author: Nico Wickersheim
Version: 1.0.1

Description:
Displays the nearest upcoming match of the UEFA EURO 2024 in a widget. 
The widget shows the group name, the team icons and names, the match date and time, and the location of the match.

Changelog:

1.0.0: Initialization
1.0.1: Added support for different languages (English and German)
-------------------------------------------------------------- */

// Fetch match data from the API
const apiUrl = "https://api.openligadb.de/getmatchdata/em/2024";
const response = await new Request(apiUrl).loadJSON();
const language = "en"; // Set to "en" for English or "de" for German
// Placeholder flag URL
const placeholderFlagUrl = "https://via.placeholder.com/20x20.png?text=Flag";

const teamNamesDE = [
  "Deutschland",
  "Schottland",
  "Ungarn",
  "Schweiz",
  "Spanien",
  "Kroatien",
  "Italien",
  "Albanien",
  "Polen",
  "Niederlande",
  "Slowenien",
  "Dänemark",
  "Serbien",
  "England",
  "Rumänien",
  "Ukraine",
  "Belgien",
  "Slowakei",
  "Österreich",
  "Frankreich",
  "Türkei",
  "Georgien",
  "Portugal",
  "Tschechien",
];

const teamNamesEN = [
  "Germany",
  "Scotland",
  "Hungary",
  "Switzerland",
  "Spain",
  "Croatia",
  "Italy",
  "Albania",
  "Poland",
  "Netherlands",
  "Slovenia",
  "Denmark",
  "Serbia",
  "England",
  "Romania",
  "Ukraine",
  "Belgium",
  "Slovakia",
  "Austria",
  "France",
  "Turkey",
  "Georgia",
  "Portugal",
  "Czech Republic",
];

const groupNameDE = [
  "1. Runde Gruppenphase",
  "2. Runde Gruppenphase",
  "3. Runde Gruppenphase",
  "Achtelfinale",
  "Viertelfinale",
  "Halbfinale",
  "Finale",
];

const groupNameEN = [
  "1st Round Group Stage",
  "2nd Round Group Stage",
  "3rd Round Group Stage",
  "Round of 16",
  "Quarterfinals",
  "Semifinals",
  "Final",
];

const dayNamesDE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const dayNamesEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Function to format date and time
function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const formatter = new DateFormatter();
  formatter.useMediumDateStyle();
  formatter.useShortTimeStyle();

  // Get the day of the week
  const dayIndex = date.getDay();
  const dayOfWeek =
    language === "de" ? dayNamesDE[dayIndex] : dayNamesEN[dayIndex];

  // Return the formatted date and time with the day of the week
  return `${dayOfWeek}, ${formatter.string(date)}`;
}

// Function to get the team name based on the language
function getTeamName(teamName) {
  const index = teamNamesDE.indexOf(teamName);
  if (index === -1) return teamName;
  return language === "de" ? teamNamesDE[index] : teamNamesEN[index];
}

function getGroupName(groupName) {
  const index = groupNameDE.indexOf(groupName);
  if (index === -1) return groupName;
  return language === "de" ? groupNameDE[index] : groupNameEN[index];
}

// Find the nearest upcoming match
function findNearestMatch(matches) {
  //const now = new Date("2024-06-20T17:00:00");
  const now = new Date();
  let nearestMatch = null;
  let nearestTimeDiff = Infinity;

  matches.forEach((match) => {
    const matchDate = new Date(match.matchDateTime);
    const timeDiff = matchDate - now;

    if (timeDiff > 0 && timeDiff < nearestTimeDiff) {
      nearestTimeDiff = timeDiff;
      nearestMatch = match;
    }
  });

  return nearestMatch;
}

// Load the nearest match data
const matchData = findNearestMatch(response);

// Create a new widget
let widget = new ListWidget();
widget.setPadding(16, 16, 16, 16);
widget.backgroundColor = Color.black();

// Logo
let logoStack = widget.addStack();
logoStack.layoutHorizontally();
logoStack.addSpacer();

let logoUrl =
  "https://seeklogo.com/images/U/uefa-euro-2024-logo-124EEA67D8-seeklogo.com.png";
let logoIcon = await loadImage(logoUrl);
let logoIconImage = logoStack.addImage(logoIcon);
logoIconImage.imageSize = new Size(40, 40);

logoStack.addSpacer();
widget.addSpacer(8);

// Title
let title = widget.addText("UEFA EURO 2024");
title.font = Font.boldSystemFont(16);
title.centerAlignText();
title.textColor = Color.white();

// Match Info
widget.addSpacer(8);

let matchInfo = widget.addText(getGroupName(matchData.group.groupName));
matchInfo.font = Font.mediumSystemFont(14);
matchInfo.centerAlignText();
matchInfo.textColor = Color.white();

widget.addSpacer(8);

// Wrapper stack to center the team stack
let wrapperStack = widget.addStack();
wrapperStack.layoutHorizontally();
wrapperStack.addSpacer();

// Teams and Icons
let teamStack = wrapperStack.addStack();
teamStack.layoutHorizontally();
teamStack.centerAlignContent();

// Add remaining space to the wrapper stack to center content
wrapperStack.addSpacer();

let team1Stack = teamStack.addStack();
team1Stack.layoutVertically();
team1Stack.centerAlignContent();

let team1Icon = await loadImage(matchData.team1.teamIconUrl);
let team1IconImage = team1Stack.addImage(team1Icon);
team1IconImage.imageSize = new Size(50, 50);
team1IconImage.cornerRadius = 4;
team1Stack.addSpacer(4);
let team1Name = team1Stack.addText(getTeamName(matchData.team1.teamName));
team1Name.font = Font.mediumSystemFont(12);
team1Name.centerAlignText();
team1Name.textColor = Color.white();

teamStack.addSpacer(16);

let vsText = teamStack.addText("vs");
vsText.font = Font.boldSystemFont(16);
vsText.centerAlignText();
vsText.textColor = Color.white();

teamStack.addSpacer(16);

let team2Stack = teamStack.addStack();
team2Stack.layoutVertically();
team2Stack.centerAlignContent();

let team2Icon = await loadImage(matchData.team2.teamIconUrl);
let team2IconImage = team2Stack.addImage(team2Icon);
team2IconImage.imageSize = new Size(50, 50);
team2IconImage.cornerRadius = 4;
team2Stack.addSpacer(4);
let team2Name = team2Stack.addText(getTeamName(matchData.team2.teamName));
team2Name.font = Font.mediumSystemFont(12);
team2Name.centerAlignText();
team2Name.textColor = Color.white();

widget.addSpacer(16);

// Match Date and Time with calendar icon
let dateTimeWrapperStack = widget.addStack();
dateTimeWrapperStack.layoutHorizontally();
dateTimeWrapperStack.addSpacer();

let dateTimeStack = dateTimeWrapperStack.addStack();
dateTimeStack.layoutHorizontally();
dateTimeStack.centerAlignContent();
let calendarIconUrl =
  "https://img.icons8.com/ios-filled/50/ffffff/calendar.png"; // Replace with your calendar icon URL
let calendarIcon = await loadImage(calendarIconUrl);
let calendarIconImage = dateTimeStack.addImage(calendarIcon);
calendarIconImage.imageSize = new Size(16, 16);

dateTimeStack.addSpacer(4);

let dateTime = formatDateTime(matchData.matchDateTime);
let dateTimeText = dateTimeStack.addText(dateTime);
dateTimeText.font = Font.mediumSystemFont(12);
dateTimeText.textColor = Color.white();

dateTimeWrapperStack.addSpacer();

widget.addSpacer(8);

// Wrapper stack to center the team stack
let locationWrapperStack = widget.addStack();
locationWrapperStack.layoutHorizontally();
locationWrapperStack.addSpacer();

// Location with pin icon
let locationStack = locationWrapperStack.addStack();
locationStack.layoutHorizontally();
locationStack.centerAlignContent();
let pinIconUrl = "https://img.icons8.com/ios-filled/50/FAB005/marker.png"; // Replace with your pin icon URL
let pinIcon = await loadImage(pinIconUrl);
let pinIconImage = locationStack.addImage(pinIcon);
pinIconImage.imageSize = new Size(16, 16);

locationStack.addSpacer(4);

let locationText = locationStack.addText(
  `${matchData.location.locationStadium}, ${matchData.location.locationCity}`
);
locationText.font = Font.mediumSystemFont(12);
locationText.textColor = Color.yellow();

locationWrapperStack.addSpacer();

// Function to load an image from a URL
async function loadImage(url) {
  try {
    const req = new Request(url);
    return await req.loadImage();
  } catch (e) {
    const req = new Request(placeholderFlagUrl);
    return await req.loadImage();
  }
}

// Finalize the widget
if (config.widgetFamily === "large") {
  widget.addSpacer(8);
  let footer = widget.addText("Match details are subject to change.");
  footer.font = Font.italicSystemFont(10);
  footer.centerAlignText();
  footer.textColor = Color.white();
}

if (config.runsInWidget) {
  // create and show widget
  Script.setWidget(widget);
  Script.complete();
} else {
  widget.presentLarge();
}
