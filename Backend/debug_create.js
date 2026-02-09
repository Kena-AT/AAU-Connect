const http = require('http');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODVhN2Q5YmVlMWJhYjU1ZjczOWU1NSIsImlhdCI6MTc3MDQxMDcxNywiZXhwIjoxNzczMDAyNzE3fQ.5xI7JoRw1ZKmSgjLUw6Yje-2rIk7VjqnuFGWkWrPYrE';

function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
        'Authorization': `Bearer ${TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: responseBody });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('Testing Post Creation...');
  const postResult = await makeRequest('/api/posts', {
    title: 'Manual Test Post',
    description: 'This is a description created via debug script',
    course: 'General'
  });
  console.log('Post Status:', postResult.status);
  console.log('Post Data:', JSON.stringify(postResult.data || postResult.body, null, 2));

  console.log('\nTesting Story Creation...');
  const storyResult = await makeRequest('/api/stories', {
    content: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop'
  });
  console.log('Story Status:', storyResult.status);
  console.log('Story Data:', JSON.stringify(storyResult.data || storyResult.body, null, 2));
}

run();
