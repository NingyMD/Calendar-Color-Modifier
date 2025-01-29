// Create input fields for user input
const namespaceInput = document.createElement('input');
const colorInput = document.createElement('input');
const timeInput = document.createElement('input');
const applyButton = document.createElement('button');
const saveButton = document.createElement('button');

namespaceInput.placeholder = 'Enter event name';
colorInput.placeholder = 'Enter background color';
timeInput.placeholder = 'Enter event time';
applyButton.textContent = 'Apply';
saveButton.textContent = 'Save';

// Prepend inputs and buttons to the body
document.body.prepend(namespaceInput);
document.body.prepend(timeInput);
document.body.prepend(colorInput);
document.body.prepend(applyButton);
document.body.prepend(saveButton);

// Retrieve stored colors from localStorage
const savedColors = JSON.parse(localStorage.getItem('savedColors')) || {};
const defaultColors = JSON.parse(localStorage.getItem('defaultColors')) || {};

// Function to capture and save the default background colors
function saveDefaultBackgroundColors() {
  document.querySelectorAll(".GTG3wb").forEach((element) => {
    if (!defaultColors[element.dataset.eventid]) {
      defaultColors[element.dataset.eventid] = element.style.backgroundColor || '';
    }
  });

  localStorage.setItem('defaultColors', JSON.stringify(defaultColors));
}

// Function to normalize time input (convert different dash types and spaces)
function normalizeTime(text) {
  return text.replace(/[-–—]/g, '-').replace(/\s+/g, ' ').trim(); // Replaces hyphen, en dash, and em dash with a standard hyphen
}

// Function to extract event time from different possible locations
function extractEventTime(element) {
  let timeText = '';

  // 1. Check `.lhydbb` (used in most events)
  const timeElement1 = element.querySelector('.lhydbb.gVNoLb');
  if (timeElement1) {
    timeText = timeElement1.textContent.trim();
  }

  // 2. Check `.EWOIrf` (used in some events)
  const timeElement2 = element.querySelector('.EWOIrf');
  if (timeElement2) {
    timeText = timeElement2.textContent.trim();
  }

  // 3. Check `.XuJrye` (used in some events)
  const timeElement3 = element.querySelector('.XuJrye');
  if (timeElement3 && !timeText) {
    timeText = timeElement3.textContent.split(',')[0].trim(); // Extracts only the time part
  }

  return normalizeTime(timeText);
}

// Function to extract text from an element
function getElementText(element) {
  return element ? element.textContent.trim() : '';
}

// Function to apply background color to matching events
function applyBackgroundColor() {
  const namespace = namespaceInput.value.trim();
  const color = colorInput.value.trim();
  const time = normalizeTime(timeInput.value.trim()); // Normalize user input

  document.querySelectorAll(".GTG3wb").forEach((element) => {
    const nameElement = element.querySelector(".I0UMhf");
    const eventTime = extractEventTime(element);

    const nameMatches = nameElement && getElementText(nameElement) === namespace;
    const timeMatches = time && eventTime.includes(time); // Allow partial match for time

    if (nameMatches && (!time || timeMatches)) {
      if (!color) {
        // Revert to default if no color is entered
        element.style.backgroundColor = defaultColors[element.dataset.eventid] || '';
      } else {
        element.style.backgroundColor = color;
      }
    }
  });
}

// Function to save the applied background color as "custom"
function saveCustomBackgroundColor() {
  const namespace = namespaceInput.value.trim();
  const color = colorInput.value.trim();
  const time = normalizeTime(timeInput.value.trim()); // Normalize user input

  document.querySelectorAll(".GTG3wb").forEach((element) => {
    const nameElement = element.querySelector(".I0UMhf");
    const eventTime = extractEventTime(element);

    const nameMatches = nameElement && getElementText(nameElement) === namespace;
    const timeMatches = time && eventTime.includes(time); // Allow partial match for time

    if (nameMatches && (!time || timeMatches)) {
      if (color) {
        savedColors[element.dataset.eventid] = color;
      } else {
        delete savedColors[element.dataset.eventid];
      }
    }
  });

  localStorage.setItem('savedColors', JSON.stringify(savedColors));
}

// Function to reapply saved colors dynamically
function reapplySavedColors() {
  document.querySelectorAll(".GTG3wb").forEach((element) => {
    if (savedColors[element.dataset.eventid]) {
      element.style.backgroundColor = savedColors[element.dataset.eventid];
    }
  });
}

// Observe DOM changes and reapply saved colors dynamically
const observer = new MutationObserver(() => {
  reapplySavedColors();
});

observer.observe(document.body, { childList: true, subtree: true });

// Apply button event
applyButton.addEventListener('click', applyBackgroundColor);

// Save button event
saveButton.addEventListener('click', saveCustomBackgroundColor);

// Ensure default colors are saved before applying custom colors on page load
window.addEventListener('load', () => {
  saveDefaultBackgroundColors();
  reapplySavedColors();
});
