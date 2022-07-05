const core = require('@actions/core');

try {
  const startTime = core.getInput('startTime');
  const currentTime = new Date();
  console.log(`Start time: ${startTime} - Current time: ${startTime}`);

  const executionTimeInMs = currentTime - new Date(startTime);
  const minutes = Math.floor(executionTimeInMs / 60000);
  const seconds = ((executionTimeInMs % 60000) / 1000).toFixed(0);
  const executionTime = `${minutes}m ${(seconds < 10 ? "0" : "")}${seconds}s`;

  core.setOutput("executionTime", executionTime);
  console.log(`Execution time: ${executionTime}`);
} catch (error) {
  core.setFailed(error.message);
}