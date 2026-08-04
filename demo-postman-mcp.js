const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const isWindows = process.platform === 'win32';

// Load the Eventrix Postman collection
const collection = JSON.parse(fs.readFileSync(path.join(__dirname, 'server', 'eventrix.json'), 'utf8'));

const child = spawn(
  isWindows ? 'npx.cmd' : 'npx',
  ['-y', '@postman/postman-mcp-server'],
  {
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: isWindows
  }
);

let buffer = '';
let initialized = false;

// Read stdout from the MCP server
child.stdout.on('data', (data) => {
  buffer += data.toString();
  let newlineIndex;
  while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, newlineIndex).trim();
    buffer = buffer.slice(newlineIndex + 1);
    if (line) {
      handleMessage(JSON.parse(line));
    }
  }
});

child.stderr.on('data', (data) => {
  console.error('STDERR:', data.toString());
});

function sendMessage(message) {
  child.stdin.write(JSON.stringify(message) + '\n');
}

function handleMessage(message) {
  if (message.id === 1 && message.result) {
    console.log('=== MCP Server Initialized ===');
    console.log('Server Info:', JSON.stringify(message.result.serverInfo, null, 2));
    console.log('Protocol Version:', message.result.protocolVersion);
    console.log('');
    initialized = true;
    // Send initialized notification
    sendMessage({
      jsonrpc: '2.0',
      method: 'notifications/initialized',
      params: {}
    });
    // List tools
    sendMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    });
  } else if (message.id === 2 && message.result) {
    console.log('=== Available Tools ===');
    message.result.tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}`);
      console.log(`   Description: ${tool.description ? tool.description.split('\n')[0] : 'N/A'}`);
    });
    console.log(`Total tools: ${message.result.tools.length}`);
    console.log('');
    // Find the collection creation tool to demonstrate capabilities
    const collectionTool = message.result.tools.find(t => t.name.toLowerCase().includes('collection'));
    const toolToCall = collectionTool || message.result.tools[0];
    if (toolToCall) {
      console.log(`=== Calling tool: ${toolToCall.name} ===`);
      console.log(`Using Eventrix collection: ${collection.info.name}`);
      console.log('');
      // Pass the collection data to the tool
      const args = {};
      if (collectionTool) {
        // Try to determine the right argument key based on the tool schema
        const schema = collectionTool.inputSchema || {};
        const props = schema.properties || {};
        if (props.collection) {
          args.collection = collection;
        } else if (props.collectionData) {
          args.collectionData = collection;
        } else if (props.data) {
          args.data = collection;
        } else {
          // Fallback: pass collection as the first property
          const firstKey = Object.keys(props)[0];
          if (firstKey) {
            args[firstKey] = collection;
          }
        }
      }
      sendMessage({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: toolToCall.name,
          arguments: args
        }
      });
    } else {
      console.log('No tools available.');
      child.kill();
      process.exit(0);
    }
  } else if (message.id === 3 && message.result) {
    console.log('=== Tool Result ===');
    console.log(JSON.stringify(message.result, null, 2));
    child.kill();
    process.exit(0);
  } else if (message.error) {
    console.error('Error:', JSON.stringify(message.error, null, 2));
    child.kill();
    process.exit(1);
  }
}

// Send initialize request
console.log('Connecting to Postman MCP Server...');
sendMessage({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'blackbox-demo',
      version: '1.0.0'
    }
  }
});

// Timeout after 60 seconds
setTimeout(() => {
  console.error('Timed out waiting for MCP server response.');
  child.kill();
  process.exit(1);
}, 60000);
