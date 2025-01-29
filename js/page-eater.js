// Define the text values to match
const namespace = "Morning Mile";
let time = null; // Example time; set this to `null` or `undefined` to test skipping time check

// MutationObserver to monitor changes to the DOM
const observer = new MutationObserver(() => {
  // Use querySelectorAll to find all potential matches
  const elements = document.querySelectorAll(".GTG3wb");

  elements.forEach((element) => {
    // Check if the element contains the required namespace
    const containsNamespace = element.textContent.includes(namespace);

    // If time is defined, check for both namespace and time
    if (time && containsNamespace && element.textContent.includes(time)) {
      element.style.backgroundColor = "yellow";
      console.log(`Background color applied to element with namespace: ${namespace} and time: ${time}`);
    }
    // If time is nil (null, undefined, or empty), only check for the namespace
    else if (!time && containsNamespace) {
      element.style.backgroundColor = "yellow";
      console.log(`Background color applied to element with namespace: ${namespace}`);
    }
  });
});

// Start observing the DOM for changes
observer.observe(document.body, { childList: true, subtree: true });
