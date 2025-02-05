// Create input fields for user input
const namespaceInput = document.createElement('input');
const colorInput = document.createElement('input');
const timeInput = document.createElement('input');
const colorPicker = document.createElement('input'); // Color Picker
const applyButton = document.createElement('button');
const saveButton = document.createElement('button');
const clearFiltersButton = document.createElement('button'); // Clear Filters Button
let selectedElement = null; // Track selected event

namespaceInput.placeholder = 'Enter event name';
colorInput.placeholder = 'Enter background color';
timeInput.placeholder = 'Enter event time';
applyButton.textContent = 'Apply';
saveButton.textContent = 'Save';
clearFiltersButton.textContent = 'Remove ID Filter';

// Set up the color picker
colorPicker.type = 'color';
colorPicker.style.border = '1px solid #ccc';
colorPicker.style.cursor = 'pointer';

// Adjust width when page loads
setTimeout(() => {
  colorPicker.style.width = `${colorInput.offsetHeight}px`;
  colorPicker.style.height = `${colorInput.offsetHeight}px`;
}, 100);

// Sync color picker with text input
colorPicker.addEventListener('input', () => {
  colorInput.value = colorPicker.value;
});

// Prepend inputs and buttons to the body
document.body.prepend(clearFiltersButton); // Add Clear Filters button next to the name box
document.body.prepend(namespaceInput);
document.body.prepend(timeInput);
document.body.prepend(colorInput);
document.body.prepend(colorPicker);
document.body.prepend(applyButton);
document.body.prepend(saveButton);

// Clear Filters Functionality
clearFiltersButton.addEventListener('click', () => {
  selectedElement = null; // Deselect any selected event
});

// Attach event listeners and logic
function attachEventClickListeners() {
  document.querySelectorAll(".GTG3wb").forEach((element) => {
    element.addEventListener("click", handleEventSelection);
  });
}

// Retrieve stored colors from localStorage
const savedColors = JSON.parse(localStorage.getItem('savedColors')) || {};
const defaultColors = JSON.parse(localStorage.getItem('defaultColors')) || {};

// Function to save default background colors
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
  return text.replace(/[-–—]/g, '-').replace(/\s+/g, ' ').trim();
}

// Function to extract event time
function extractEventTime(element) {
  let timeText = '';

  const timeElement1 = element.querySelector('.lhydbb.gVNoLb');
  if (timeElement1) timeText = timeElement1.textContent.trim();

  const timeElement2 = element.querySelector('.EWOIrf');
  if (timeElement2) timeText = timeElement2.textContent.trim();

  const timeElement3 = element.querySelector('.XuJrye');
  if (timeElement3 && !timeText) {
    timeText = timeElement3.textContent.split(',')[0].trim();
  }

  return normalizeTime(timeText);
}

// Function to extract text from an element
function getElementText(element) {
  return element ? element.textContent.trim() : '';
}

// Function to select an individual event when clicked
function handleEventSelection(event) {
  if (selectedElement) {
    selectedElement.style.border = ''; // Remove highlight from the previously selected event
  }

  selectedElement = event.currentTarget;
  selectedElement.style.border = '2px solid #ffcc00'; // Highlight the selected event

  // Auto-fill name and time based on the selected event
  const nameElement = selectedElement.querySelector('.I0UMhf');
  if (nameElement) {
    namespaceInput.value = getElementText(nameElement);
  }

  const eventTime = extractEventTime(selectedElement);
  timeInput.value = eventTime;
}

// Attach click event to each event block
function attachEventClickListeners() {
  document.querySelectorAll(".GTG3wb").forEach((element) => {
    element.addEventListener("click", handleEventSelection);
  });
}

// Function to apply background color to the selected event or matching events
function applyBackgroundColor() {
  const namespace = namespaceInput.value.trim();
  const color = colorInput.value.trim();
  const time = normalizeTime(timeInput.value.trim());

  if (selectedElement) {
    selectedElement.style.backgroundColor = color || defaultColors[selectedElement.dataset.eventid] || '';
  } else {
    document.querySelectorAll(".GTG3wb").forEach((element) => {
      const nameElement = element.querySelector(".I0UMhf");
      const eventTime = extractEventTime(element);

      const nameMatches = nameElement && getElementText(nameElement) === namespace;
      const timeMatches = time && eventTime.includes(time);

      if (nameMatches && (!time || timeMatches)) {
        element.style.backgroundColor = color || defaultColors[element.dataset.eventid] || '';
      }
    });
  }
}

// Function to save the applied background color as "custom"
function saveCustomBackgroundColor() {
  const namespace = namespaceInput.value.trim();
  const color = colorInput.value.trim();
  const time = normalizeTime(timeInput.value.trim());

  if (selectedElement) {
    savedColors[selectedElement.dataset.eventid] = color;
  } else {
    document.querySelectorAll(".GTG3wb").forEach((element) => {
      const nameElement = element.querySelector(".I0UMhf");
      const eventTime = extractEventTime(element);

      const nameMatches = nameElement && getElementText(nameElement) === namespace;
      const timeMatches = time && eventTime.includes(time);

      if (nameMatches && (!time || timeMatches)) {
        if (color) {
          savedColors[element.dataset.eventid] = color;
        } else {
          delete savedColors[element.dataset.eventid];
        }
      }
    });
  }

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
  attachEventClickListeners(); // Reattach event listeners in case new events are added dynamically
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
  attachEventClickListeners(); // Attach event listeners on page load
});
