// Create input fields for user input
const namespaceInput = document.createElement('input');
const colorInput = document.createElement('input');
const timeInput = document.createElement('input');
const colorPicker = document.createElement('input'); // Color Picker
const applyButton = document.createElement('button');
const saveButton = document.createElement('button');
const clearSelectionButton = document.createElement('button'); // Clear Selection Button
let selectedElement = null; // Track selected event

namespaceInput.placeholder = 'Enter event name';
colorInput.placeholder = 'Enter background color';
timeInput.placeholder = 'Enter event time';
applyButton.textContent = 'Apply';
saveButton.textContent = 'Save';
clearSelectionButton.textContent = 'Clear Selection'; // Button text

// Set up the color picker
colorPicker.type = 'color';
colorPicker.style.border = '1px solid rgb(100, 100, 100)';
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
document.body.prepend(clearSelectionButton); // Add clear selection button
document.body.prepend(namespaceInput);
document.body.prepend(timeInput);
document.body.prepend(colorInput);
document.body.prepend(colorPicker);
document.body.prepend(applyButton);
document.body.prepend(saveButton);
document.body.style.backgroundColor = "#f8fafd";

// Function to clear selected event
clearSelectionButton.addEventListener('click', () => {
  if (selectedElement) {
    selectedElement.style.border = ''; // Remove highlight from selected event
    selectedElement = null; // Clear selection
  }
});

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
      const timeMatches = time && eventTime.includes(time);  // Only filter by time if time is not empty

      if (nameMatches && (!time || timeMatches)) {  // Skip time filter if time is empty
        element.style.backgroundColor = color || defaultColors[element.dataset.eventid] || '';
      }
    });
  }
}


// Function to save the background color
function saveCustomBackgroundColor() {
  const namespace = namespaceInput.value.trim();
  const color = colorInput.value.trim();
  const time = normalizeTime(timeInput.value.trim());

  if (selectedElement) {
    // Save by unique event ID if an element is selected
    savedColors[selectedElement.dataset.eventid] = color;
  } else {
    // Save by Name and Time if no specific element is selected
    const key = `${namespace}_${time}`;
    savedColors[key] = color;
  }

  // Immediately save to localStorage and reapply colors
  localStorage.setItem('savedColors', JSON.stringify(savedColors));
  reapplySavedColors();  // Reapply saved colors after saving
}

// Function to reapply saved colors dynamically
function reapplySavedColors() {
  document.querySelectorAll(".GTG3wb").forEach((element) => {
    const eventId = element.dataset.eventid;
    const namespaceElement = element.querySelector(".I0UMhf");
    const eventTime = extractEventTime(element);
    const namespace = getElementText(namespaceElement);

    // Apply color based on unique event ID first (priority)
    if (savedColors[eventId]) {
      element.style.backgroundColor = savedColors[eventId];
    }
    // If no saved color for unique event ID, apply by Name and Time
    else if (savedColors[`${namespace}_${eventTime}`]) {
      element.style.backgroundColor = savedColors[`${namespace}_${eventTime}`];
    }
    // Fallback to default colors if nothing is saved
    else {
      element.style.backgroundColor = defaultColors[eventId] || '';
    }
  });
}

// Function to handle event updates or interactions
function handleEventInteraction(event) {
  const element = event.target.closest(".GTG3wb");
  if (element) {
    const eventId = element.dataset.eventid;
    const namespaceElement = element.querySelector(".I0UMhf");
    const eventTime = extractEventTime(element);
    const namespace = getElementText(namespaceElement);

    // Apply saved color based on priority (unique ID first)
    if (savedColors[eventId]) {
      element.style.backgroundColor = savedColors[eventId];
    } else if (savedColors[`${namespace}_${eventTime}`]) {
      element.style.backgroundColor = savedColors[`${namespace}_${eventTime}`];
    }
  }
}

// Apply button event
applyButton.addEventListener('click', () => {
  const namespace = namespaceInput.value.trim();
  const color = colorInput.value.trim();
  const time = normalizeTime(timeInput.value.trim());

  // Apply color either to selected element or matching events
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

  // Save the color after applying
  saveCustomBackgroundColor();
});

// Save button event
saveButton.addEventListener('click', saveCustomBackgroundColor);

// Event listener for interactions or updates
document.querySelectorAll(".GTG3wb").forEach((element) => {
  element.addEventListener("click", handleEventInteraction);
  element.addEventListener("input", handleEventInteraction); // If events have input fields, listen for updates
});

// Reapply colors on page load or refresh
reapplySavedColors();

// Use MutationObserver to watch for DOM changes and reapply colors
const observer = new MutationObserver(() => {
  reapplySavedColors();
});

// Start observing the document for changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
});

// To ensure that the background color is preserved even when dynamically updated elements are created or modified
document.addEventListener("DOMContentLoaded", () => {
  // Reapply colors after the initial load
  reapplySavedColors();
});

// Handling element deletion
function handleElementDeletion(element) {
  const eventId = element.dataset.eventid;
  const namespaceElement = element.querySelector(".I0UMhf");
  const eventTime = extractEventTime(element);
  const namespace = getElementText(namespaceElement);

  // If an element is deleted, ensure default settings are reapplied for other elements
  if (savedColors[eventId]) {
    element.style.backgroundColor = savedColors[eventId];
  } else if (savedColors[`${namespace}_${eventTime}`]) {
    element.style.backgroundColor = savedColors[`${namespace}_${eventTime}`];
  } else {
    // If no color is saved, apply the default color
    element.style.backgroundColor = defaultColors[eventId] || '';
  }

  // Remove from the saved colors if the element is deleted
  delete savedColors[eventId];
  delete savedColors[`${namespace}_${eventTime}`];
  localStorage.setItem('savedColors', JSON.stringify(savedColors));
}

// Example of deleting an element (this can be modified based on your deletion logic)
document.querySelectorAll(".GTG3wb .delete-btn").forEach((deleteButton) => {
  deleteButton.addEventListener("click", (event) => {
    const element = event.target.closest(".GTG3wb");
    handleElementDeletion(element);
    element.remove();
  });
});


// Create the "View Saved Settings" button
const viewSavedButton = document.createElement('button');
viewSavedButton.textContent = 'View Saved Settings';
document.body.prepend(viewSavedButton);

// Create the modal container
const savedSettingsModal = document.createElement('div');
savedSettingsModal.style.position = 'fixed';
savedSettingsModal.style.top = '50%';
savedSettingsModal.style.left = '50%';
savedSettingsModal.style.transform = 'translate(-50%, -50%)';
savedSettingsModal.style.backgroundColor = 'white';
savedSettingsModal.style.border = '1px solid black';
savedSettingsModal.style.padding = '10px';
savedSettingsModal.style.display = 'none';
savedSettingsModal.style.zIndex = '1000';

// Create the modal title
const modalTitle = document.createElement('h3');
modalTitle.textContent = 'Saved Settings';
savedSettingsModal.appendChild(modalTitle);

// Create the close button
const closeModalButton = document.createElement('button');
closeModalButton.textContent = 'Close';
closeModalButton.addEventListener('click', () => {
  savedSettingsModal.style.display = 'none';
});
savedSettingsModal.appendChild(closeModalButton);

// Create the settings list container
const settingsList = document.createElement('ul');
savedSettingsModal.appendChild(settingsList);

// Function to populate the saved settings modal
function populateSavedSettings() {
  settingsList.innerHTML = ''; // Clear previous list

  Object.keys(savedColors).forEach(eventId => {
    const listItem = document.createElement('li');

    // Create a button to toggle the event ID visibility
    const eventIdButton = document.createElement('button');
    eventIdButton.textContent = 'Event ID';
    eventIdButton.style.marginRight = '10px';
    eventIdButton.style.marginBottom = '10px';
    eventIdButton.style.cursor = 'pointer';

    let isHidden = true;
    eventIdButton.addEventListener('click', () => {
      isHidden = !isHidden;
      eventIdButton.textContent = isHidden ? 'Event ID' : eventId;
    });

    // Create a container for the color info
    const colorContainer = document.createElement('span');
    colorContainer.textContent = 'Color: ';
    colorContainer.style.fontWeight = 'bold';
    colorContainer.style.marginBottom = '10px';

    // Create the color picker input
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = savedColors[eventId] || '#ffffff'; // Default to white if no saved color

    // Event listener for when the color is selected
    colorPicker.addEventListener('input', () => {
      const newColor = colorPicker.value;
      savedColors[eventId] = newColor;  // Update the saved color in localStorage
      localStorage.setItem('savedColors', JSON.stringify(savedColors));  // Save updated colors to localStorage
    });

    // Append the color picker instead of the hex code
    colorContainer.appendChild(colorPicker);

    // Create the delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '10px';
    deleteButton.style.marginBottom = '10px';

    deleteButton.addEventListener('click', () => {
      // Find the affected element
      const affectedElement = document.querySelector(`.GTG3wb[data-eventid="${eventId}"]`);

      if (affectedElement) {
        // Reset to the default background color if available
        affectedElement.style.backgroundColor = defaultColors[eventId] || '';
      }

      // Remove from saved settings
      delete savedColors[eventId];
      localStorage.setItem('savedColors', JSON.stringify(savedColors));

      // Refresh the list and elements
      reapplySavedColors();
      populateSavedSettings(); // Refresh the list UI
    });

    // Append elements to the list item
    listItem.appendChild(eventIdButton);
    listItem.appendChild(colorContainer);
    listItem.appendChild(deleteButton);
    settingsList.appendChild(listItem);
  });

  if (Object.keys(savedColors).length === 0) {
    settingsList.textContent = 'No saved settings.';
  }
}


// View Saved Settings button event
viewSavedButton.addEventListener('click', () => {
  savedSettingsModal.style.display = 'block';
  populateSavedSettings(); // Populate the modal with saved settings
});

// Append the modal to the body
document.body.appendChild(savedSettingsModal);

// Ensure default colors are saved before applying custom colors on page load
window.addEventListener('load', () => {
  saveDefaultBackgroundColors();
  reapplySavedColors();
  attachEventClickListeners(); // Attach event listeners on page load
});
