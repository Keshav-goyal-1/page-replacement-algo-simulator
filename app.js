const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });
}

const startSimulationBtn = document.getElementById('startSimulation');
if (startSimulationBtn) {
  startSimulationBtn.addEventListener('click', () => {
    // Retrieve and process user inputs
    const pageRefsInput = document.getElementById('pageReferences').value.trim();
    const pageRefs = pageRefsInput.split(/\s+/).map(Number);
    const frameCount = parseInt(document.getElementById('frameCount').value);
    const algorithm = document.getElementById('algorithm').value;

    // Validate inputs
    if (validateInput(pageRefs, frameCount)) {
      let simulationResult;

      // Execute the selected algorithm
      switch (algorithm) {
        case 'FIFO':
          simulationResult = simulateFIFO(pageRefs, frameCount);
          break;
        case 'ModifiedFIFO':
          simulationResult = simulateModifiedFIFO(pageRefs, frameCount);
          break;
        case 'LRU':
          simulationResult = simulateLRU(pageRefs, frameCount);
          break;
        case 'Optimal':
          simulationResult = simulateOptimal(pageRefs, frameCount);
          break;
        default:
          alert('Algorithm not implemented.');
          return;
      }
      simulationHistory = simulationResult.history;
        currentStep = 0;

        // Expose simulationHistory globally for chart.js
        window.simulationHistory = simulationHistory;

        // Display total page faults
        const totalPageFaultsElem = document.getElementById('totalPageFaults');
        if (totalPageFaultsElem) {
          totalPageFaultsElem.innerText = `Total Page Faults: ${simulationResult.pageFaults}`;
        }

        // Clear previous visualization, narration, and feedback
        const visualizationArea = document.getElementById('visualizationArea');
        if (visualizationArea) visualizationArea.innerHTML = '';

        const narrationText = document.getElementById('narrationText');
        if (narrationText) narrationText.innerText = '';

        const aiFeedback = document.getElementById('aiFeedback');
        if (aiFeedback) {
          aiFeedback.innerText = '';
          aiFeedback.classList.remove('text-red-500');
          aiFeedback.classList.add('text-gray-800', 'dark:text-gray-200');
        }

        // Ensure any simulation-specific errors are cleared
        const simulationError = document.getElementById('simulationError');
        if (simulationError) {
          simulationError.innerText = '';
          simulationError.classList.add('hidden');
        }

        // Initialize the visualization with frame labels
        initializeVisualization(frameCount);

        // Show the first step
        showStep(0);
        currentStep = 1; // Since we have shown the first step

        // Enable simulation controls appropriately
        const nextStepBtn = document.getElementById('nextStep');
        const prevStepBtn = document.getElementById('prevStep');
        const playPauseBtn = document.getElementById('playPause');

        if (nextStepBtn) nextStepBtn.disabled = false;
        if (prevStepBtn) prevStepBtn.disabled = true;
        if (playPauseBtn) playPauseBtn.disabled = false;

        // Generate AI feedback based on the simulation results
        generateFeedback({
          algorithm: algorithm,
          pageFaults: simulationResult.pageFaults,
          frames: frameCount,
          pageReferences: pageRefs,
        });
      } else {
        console.log('Validation failed.');
      }
    });
  }

 // Ensure any simulation-specific errors are cleared
 const simulationError = document.getElementById('simulationError');
 if (simulationError) {
   simulationError.innerText = '';
   simulationError.classList.add('hidden');
 }

 // Initialize the visualization with frame labels
 initializeVisualization(frameCount);

 // Show the first step
 showStep(0);
 currentStep = 1; // Since we have shown the first step

 // Enable simulation controls appropriately
 const nextStepBtn = document.getElementById('nextStep');
 const prevStepBtn = document.getElementById('prevStep');
 const playPauseBtn = document.getElementById('playPause');

 if (nextStepBtn) nextStepBtn.disabled = false;
 if (prevStepBtn) prevStepBtn.disabled = true;
 if (playPauseBtn) playPauseBtn.disabled = false;

 // Generate AI feedback based on the simulation results
 generateFeedback({
   algorithm: algorithm,
   pageFaults: simulationResult.pageFaults,
   frames: frameCount,
   pageReferences: pageRefs,
 });
} else {
 console.log('Validation failed.');
}
});
}

// ----------------------
// Input Validation Function
// ----------------------
function validateInput(pages, frameCount) {
let isValid = true;

// Validate Page References
const pageReferencesInput = document.getElementById('pageReferences');
const pageReferencesError = document.getElementById('pageReferencesError');
if (!pageReferencesInput || !pageReferencesError) {
console.error('Page References input or error element not found.');
return false;
}

if (pages.length === 0 || pages.some((p) => isNaN(p))) {
isValid = false;
pageReferencesInput.classList.add('input-error');
pageReferencesError.classList.remove('hidden');
} else {
pageReferencesInput.classList.remove('input-error');
pageReferencesError.classList.add('hidden');
}

 // ----------------------
  // Remove Error Styles on Input
  // ----------------------
  const pageReferencesInput = document.getElementById('pageReferences');
  const frameCountInput = document.getElementById('frameCount');

  if (pageReferencesInput) {
    pageReferencesInput.addEventListener('input', () => {
      const error = document.getElementById('pageReferencesError');
      pageReferencesInput.classList.remove('input-error');
      if (error) error.classList.add('hidden');
    });
  }

  if (frameCountInput) {
    frameCountInput.addEventListener('input', () => {
      const error = document.getElementById('frameCountError');
      frameCountInput.classList.remove('input-error');
      if (error) error.classList.add('hidden');
    });
  }

  // ----------------------
  // Page Replacement Algorithms
  // ----------------------

  function simulateFIFO(pages, frameCount) {
    let frames = Array(frameCount).fill(null); // Initialize frames
    let pageFaults = 0;
    let history = [];
    let pointer = 0; // Points to the frame to be replaced next

    pages.forEach((page, index) => {
      let fault = false;
      let frameUpdated = null;
      let hitFrames = [];

      if (!frames.includes(page)) {
        fault = true;
        frames[pointer] = page;
        frameUpdated = pointer;
        pointer = (pointer + 1) % frameCount;
        pageFaults++;
      } else {
        // Identify the frame that was hit
        const hitIndex = frames.indexOf(page);
        hitFrames.push(hitIndex);
      }

      history.push({
        step: index + 1,
        page: page,
        frames: [...frames],
        fault: fault,
        frameUpdated: frameUpdated,
        hitFrames: hitFrames, // Array of frame indices that had hits
      });
    });

    return { history, pageFaults };
  }

 // Modified FIFO (Second-Chance Algorithm) Implementation
 function simulateModifiedFIFO(pages, frameCount) {
  let frames = Array(frameCount).fill(null); // Initialize frames
  let referenceBits = Array(frameCount).fill(0); // Reference bits for second chance
  let pageFaults = 0;
  let history = [];
  let pointer = 0; // Points to the frame to be replaced next

  pages.forEach((page, index) => {
    let fault = false;
    let frameUpdated = null;
    let hitFrames = [];

    if (frames.includes(page)) {
      // Page hit
      const frameIndex = frames.indexOf(page);
      referenceBits[frameIndex] = 1; // Set reference bit
      hitFrames.push(frameIndex);
    } else {
      // Page fault
      fault = true;
      while (true) {
        if (referenceBits[pointer] === 0) {
          // Replace this page
          frames[pointer] = page;
          frameUpdated = pointer;
          referenceBits[pointer] = 0; // Reset reference bit
          pointer = (pointer + 1) % frameCount;
          break;
        } else {
          // Give a second chance
          referenceBits[pointer] = 0;
          pointer = (pointer + 1) % frameCount;
        }
      }
      pageFaults++;
    }

    history.push({
      step: index + 1,
      page: page,
      frames: [...frames],
      fault: fault,
      frameUpdated: frameUpdated,
      hitFrames: hitFrames, // Array of frame indices that had hits
    });
  });

  return { history, pageFaults };
}
