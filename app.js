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
