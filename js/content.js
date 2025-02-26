// Create input fields for user input
const namespaceInput = document.createElement('input');
const colorInput = document.createElement('input');
const timeInput = document.createElement('input');
const colorPicker = document.createElement('input'); // Color Picker
const saveButton = document.createElement('button');
const clearFiltersButton = document.createElement('button'); // Clear Filters Button
let selectedElement = null; // Track selected event

namespaceInput.placeholder = 'Enter event name';
colorInput.placeholder = 'Enter background color';
timeInput.placeholder = 'Enter event time';
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
document.body.prepend(saveButton);

// Clear Filters Functionality
clearFiltersButton.addEventListener('click', () => {
  selectedElement = null; // Deselect any selected event
});

// Function to apply background color to the selected event or matching events
function applyBackgroundColor() {
  const namespace = namespaceInput.value.trim();
  const color = colorInput.value.trim();
  const time = normalizeTime(timeInput.value.trim());

  // Select all event elements (make sure this matches the correct selector for your event elements)
  const eventElements = document.querySelectorAll(".GTG3wb");

  // Loop through all cached event elements
  eventElements.forEach((element) => {
    const nameElement = element.querySelector(".I0UMhf");
    const eventTime = extractEventTime(element);
    const eventId = element.dataset.eventid;
    const currentColor = element.style.backgroundColor;

    let newColor = '';

    if (savedColors[eventId]) {
      newColor = savedColors[eventId]; // Apply ID-based color
    } else {
      let groupMatch = null;

      // Use a simple loop instead of .find
      for (let i = 0; i < savedGroups.length; i++) {
        if (savedGroups[i].name === getElementText(nameElement) && savedGroups[i].time === eventTime) {
          groupMatch = savedGroups[i];
          break; // Exit loop once a match is found
        }
      }

      if (groupMatch) {
        newColor = groupMatch.color; // Apply group color if no ID match
      } else {
        newColor = defaultColors[eventId] || ''; // Fall back to default
      }
    }

    // Only apply the color if it has changed
    if (currentColor !== newColor) {
      element.style.backgroundColor = newColor;
    }
  });

  // Trigger a repaint after applying colors (force update)
  requestAnimationFrame(() => {
    // This forces a style recalculation
    eventElements.forEach(element => {
      const styles = getComputedStyle(element);
      const backgroundColor = styles.backgroundColor; // Force recompute the background color
    });
  });
}

// Function to save the applied background color as "custom"
function saveCustomBackgroundColor() {
  const namespace = namespaceInput.value.trim();
  const color = colorInput.value.trim();
  const time = normalizeTime(timeInput.value.trim());

  if (selectedElement) {
    // Save custom color for selected event ID
    savedColors[selectedElement.dataset.eventid] = color;
  } else {
    // Save group data if no specific event is selected
    savedGroups.push({ name: namespace, time, color });
  }

  // Asynchronously save to localStorage to avoid UI blocking
  setTimeout(() => {
    localStorage.setItem('savedColors', JSON.stringify(savedColors));
    localStorage.setItem('savedGroups', JSON.stringify(savedGroups));
  }, 0);
}

// Save button event
saveButton.addEventListener('click', () => {
  // First apply the background color immediately to the UI
  applyBackgroundColor();

  // Then save the custom color asynchronously to avoid UI blocking
  saveCustomBackgroundColor();

  // Trigger an immediate update after saving the color
  applyBackgroundColor(); // Ensure the color is reapplied right after saving
});








// Attach event listeners and logic
function attachEventClickListeners() {
  document.querySelectorAll(".GTG3wb").forEach((element) => {
    element.addEventListener("click", handleEventSelection);
  });
}

// Retrieve stored colors from localStorage
const savedColors = JSON.parse(localStorage.getItem('savedColors')) || {}; // ID-based colors
const savedGroups = JSON.parse(localStorage.getItem('savedGroups')) || []; // Name-time based groups
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

// Ensure default colors are saved before applying custom colors on page load
window.addEventListener('load', () => {
  saveDefaultBackgroundColors();
  reapplySavedColors();
  attachEventClickListeners(); // Attach event listeners on page load
});







// Create the "View Saved Colors" button
const viewSavedColorsButton = document.createElement('button');
viewSavedColorsButton.textContent = 'View Saved Colors';

// Create the modal
const savedColorsModal = document.createElement('div');
savedColorsModal.style.display = 'none';
savedColorsModal.style.position = 'fixed';
savedColorsModal.style.top = '50%';
savedColorsModal.style.left = '50%';
savedColorsModal.style.transform = 'translate(-50%, -50%)';
savedColorsModal.style.background = '#fff';
savedColorsModal.style.border = '1px solid #ccc';
savedColorsModal.style.padding = '15px';
savedColorsModal.style.zIndex = '1000';
savedColorsModal.style.maxHeight = '400px';
savedColorsModal.style.overflowY = 'auto';

// Close button for modal
const closeModalButton = document.createElement('button');
closeModalButton.textContent = 'Close';
closeModalButton.style.marginBottom = '15px';
closeModalButton.addEventListener('click', () => savedColorsModal.style.display = 'none');

// Function to populate and show the saved colors modal
function showSavedColors() {
  savedColorsModal.innerHTML = ''; // Clear previous entries
  savedColorsModal.appendChild(closeModalButton); // Add close button

  // Check if there are saved groups
  if (savedGroups.length > 0) {
    savedGroups.forEach(group => {
      const groupEntry = document.createElement('div');
      groupEntry.style.display = 'flex';
      groupEntry.style.alignItems = 'center';
      groupEntry.style.marginBottom = '8px';

      // Color preview box for the group
      const colorPreview = document.createElement('div');
      colorPreview.style.width = '20px';
      colorPreview.style.height = '20px';
      colorPreview.style.backgroundColor = group.color;
      colorPreview.style.border = '1px solid #000';
      colorPreview.style.marginRight = '10px';
      colorPreview.style.cursor = 'pointer';
      colorPreview.style.position = 'relative';

      // Invisible color picker inside the color box
      const colorPicker = document.createElement('input');
      colorPicker.type = 'color';
      colorPicker.value = group.color;
      colorPicker.style.opacity = '0';  // Make invisible but still interactive
      colorPicker.style.width = '100%';
      colorPicker.style.height = '100%';
      colorPicker.style.position = 'absolute';
      colorPicker.style.left = '0';
      colorPicker.style.top = '0';
      colorPicker.style.cursor = 'pointer';

      // Update the group color when a new color is picked
      colorPicker.addEventListener('input', () => {
        const newColor = colorPicker.value;

        // Update the displayed color box and the group color
        colorPreview.style.backgroundColor = newColor;
        group.color = newColor; // Update the color in the savedGroups array

        // Also update the colors of events with this group name and time
        document.querySelectorAll(".GTG3wb").forEach((element) => {
          const nameElement = element.querySelector(".I0UMhf");
          const eventTime = extractEventTime(element);
          
          if (nameElement && getElementText(nameElement) === group.name && eventTime.includes(group.time)) {
            element.style.backgroundColor = newColor;
          }
        });

        // Save the updated group color to localStorage
        localStorage.setItem('savedGroups', JSON.stringify(savedGroups));
      });

      // Event info (name and time)
      const eventInfo = document.createElement('span');
      eventInfo.textContent = `${group.name} (${group.time})`;

      deleteButton.addEventListener('click', () => {
        // Remove the group from savedGroups by filtering out the current group
        savedGroups = savedGroups.filter(g => g !== group);
      
        // Save the updated groups back to localStorage
        localStorage.setItem('savedGroups', JSON.stringify(savedGroups));
      
        // Re-render the saved colors
        showSavedColors();
      
        // Update the event backgrounds after deletion
        updateEventBackgrounds();
      });
      

      // Append the color picker and other elements
      colorPreview.appendChild(colorPicker);
      groupEntry.appendChild(colorPreview);
      groupEntry.appendChild(eventInfo);
      groupEntry.appendChild(deleteButton);
      savedColorsModal.appendChild(groupEntry);
    });
  } else {
    const noGroupsMessage = document.createElement('div');
    noGroupsMessage.textContent = "No groups saved yet.";
    savedColorsModal.appendChild(noGroupsMessage);
  }

  // Check if there are individual saved colors for events
  if (Object.keys(savedColors).length > 0) {
    Object.entries(savedColors).forEach(([eventId, color]) => {
      const eventElement = document.querySelector(`[data-eventid="${eventId}"]`);
      const eventName = eventElement ? getElementText(eventElement.querySelector('.I0UMhf')) : 'Unknown Event';
      const eventTime = eventElement ? extractEventTime(eventElement) : 'Unknown Time';

      const colorEntry = document.createElement('div');
      colorEntry.style.display = 'flex';
      colorEntry.style.alignItems = 'center';
      colorEntry.style.marginBottom = '8px';

      // Color preview box for the event
      const colorPreview = document.createElement('div');
      colorPreview.style.width = '20px';
      colorPreview.style.height = '20px';
      colorPreview.style.backgroundColor = color;
      colorPreview.style.border = '1px solid #000';
      colorPreview.style.marginRight = '10px';
      colorPreview.style.cursor = 'pointer';
      colorPreview.style.position = 'relative';

      // Invisible color picker inside the color box
      const colorPicker = document.createElement('input');
      colorPicker.type = 'color';
      colorPicker.value = color;
      colorPicker.style.opacity = '0';  // Make invisible but still interactive
      colorPicker.style.width = '100%';
      colorPicker.style.height = '100%';
      colorPicker.style.position = 'absolute';
      colorPicker.style.left = '0';
      colorPicker.style.top = '0';
      colorPicker.style.cursor = 'pointer';

      // Update the event color when a new color is picked
      colorPicker.addEventListener('input', () => {
        const newColor = colorPicker.value;

        // Update the displayed color box and the saved event color
        colorPreview.style.backgroundColor = newColor;
        savedColors[eventId] = newColor;

        // Update the background color for the event
        if (eventElement) {
          eventElement.style.backgroundColor = newColor;
        }

        // Save the updated event color to localStorage
        localStorage.setItem('savedColors', JSON.stringify(savedColors));
      });

      // Event info (name and time)
      const eventInfo = document.createElement('span');
      eventInfo.textContent = `${eventName} (${eventTime})`;

      // Delete button for the event
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.style.marginLeft = '10px';
      deleteButton.addEventListener('click', () => {
        // Remove the event from savedColors
        delete savedColors[eventId];
        localStorage.setItem('savedColors', JSON.stringify(savedColors));

        // Re-render the saved colors
        showSavedColors();

        // Update the event backgrounds after deletion
        updateEventBackgrounds();
      });

      // Append the color picker and other elements
      colorPreview.appendChild(colorPicker);
      colorEntry.appendChild(colorPreview);
      colorEntry.appendChild(eventInfo);
      colorEntry.appendChild(deleteButton);
      savedColorsModal.appendChild(colorEntry);
    });
  } else {
    const noColorsMessage = document.createElement('div');
    noColorsMessage.textContent = "No individual event colors saved yet.";
    savedColorsModal.appendChild(noColorsMessage);
  }

  // Show the modal
  savedColorsModal.style.display = 'block';
}

// Function to update event background colors after deletion
function updateEventBackgrounds() {
  // Update individual events
  document.querySelectorAll(".GTG3wb").forEach((element) => {
    const eventId = element.dataset.eventid;
    if (savedColors[eventId]) {
      element.style.backgroundColor = savedColors[eventId];
    } else {
      let groupMatch = null;

      // Loop through saved groups to find a match
      for (let i = 0; i < savedGroups.length; i++) {
        if (savedGroups[i].name === getElementText(element.querySelector(".I0UMhf")) && extractEventTime(element) === savedGroups[i].time) {
          groupMatch = savedGroups[i];
          break;
        }
      }

      // Apply the group color if found, otherwise fall back to default
      if (groupMatch) {
        element.style.backgroundColor = groupMatch.color;
      } else {
        element.style.backgroundColor = defaultColors[eventId] || '';
      }
    }
  });

  // Trigger a repaint after updating event colors (force update)
  requestAnimationFrame(() => {
    document.querySelectorAll(".GTG3wb").forEach(element => {
      const styles = getComputedStyle(element);
      const backgroundColor = styles.backgroundColor; // Force recalculation of the background color
    });
  });
}


// Attach the event to the view saved colors button
viewSavedColorsButton.addEventListener('click', showSavedColors);


document.body.prepend(viewSavedColorsButton);
document.body.appendChild(savedColorsModal);
