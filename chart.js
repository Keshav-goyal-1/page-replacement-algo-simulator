chartInstance = new Chart(performanceChartCanvas, {
    type: 'bar', // Main chart type
    data: {
      labels: steps.map(step => `T${step}`),
      datasets: [
        {
          type: 'bar',
          label: 'Page Faults per Step',
          data: pageFaultsPerStep,
          backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: 'Page Hits per Step',
          data: pageHitsPerStep,
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Green
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Cumulative Page Faults',
          data: cumulativeFaults,
          borderColor: 'rgba(255, 99, 132, 1)', // Red
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          tension: 0.1,
          yAxisID: 'y1',
        },
        {
          type: 'line',
          label: 'Cumulative Page Hits',
          data: cumulativeHits,
          borderColor: 'rgba(75, 192, 192, 1)', // Green
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
          tension: 0.1,
          yAxisID: 'y1',
        },
        {
          type: 'line',
          label: 'Page Fault Rate (%)',
          data: faultRates,
          borderColor: 'rgba(255, 206, 86, 1)', // Yellow
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          fill: false,
          tension: 0.1,
          yAxisID: 'y2',
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: 'Page Replacement Performance Metrics'
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              if (context.dataset.type === 'line' && context.dataset.label === 'Page Fault Rate (%)') {
                return `${context.dataset.label}: ${context.parsed.y}%`;
              }
              return `${context.dataset.label}: ${context.parsed.y}`;
            }
          }
        },
        legend: {
          position: 'top',
        },
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Count'
          },
          grid: {
            drawOnChartArea: false, // Prevents overlapping with y1
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Cumulative Count'
          },
          grid: {
            drawOnChartArea: false, // Prevents overlapping with y
          },
        },
        y2: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Fault Rate (%)'
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          },
          // Prevent y1 and y2 from overlapping
          afterDataLimits: function(scale) {
            scale.max = 100;
            scale.min = 0;
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time (Steps)'
          }
        }
      }