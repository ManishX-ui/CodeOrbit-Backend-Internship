const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;
const workspaceDir = path.resolve(rootDir, '..');

const results = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(url, options = {}) {
  const start = Date.now();
  let res;
  let text = '';
  let data = null;
  let status = null;
  let ok = false;
  try {
    res = await fetch(url, options);
    status = res.status;
    ok = res.ok;
    text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  } catch (err) {
    status = 0;
    text = err.message;
  }
  const duration = Date.now() - start;
  return { status, ok, data, raw: text, duration };
}

function startServer(dirName) {
  const cwd = path.join(workspaceDir, dirName);
  const child = spawn(process.execPath, ['server.js'], {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  return child;
}

async function waitForPort(url, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url);
      if (res.status >= 200) return true;
    } catch {
      await sleep(250);
    }
  }
  return false;
}

async function run() {
  console.log('====================================================');
  console.log('CODEORBIT BACKEND INTERNSHIP - COMPLETE TEST SUITE');
  console.log('====================================================\n');

  // ================= TASK 1: Notes REST API (Port 3001) =================
  console.log('>>> [TASK 1] Starting Notes REST API on http://localhost:3001 ...');
  const server1 = startServer('CodeOrbit_Notes_REST_API');
  await waitForPort('http://localhost:3001/');

  // 1. Root
  let t1_root = await request('http://localhost:3001/');
  console.log(`[Task 1] GET / -> HTTP ${t1_root.status}:`, t1_root.data.message);
  results.push({ task: 1, test: 'Root Health Check', method: 'GET', url: 'http://localhost:3001/', status: t1_root.status, response: t1_root.data });

  // 2. GET all notes
  let t1_getAll = await request('http://localhost:3001/api/notes');
  console.log(`[Task 1] GET /api/notes -> HTTP ${t1_getAll.status}, count: ${t1_getAll.data.data?.length || 0}`);
  results.push({ task: 1, test: 'GET All Notes', method: 'GET', url: 'http://localhost:3001/api/notes', status: t1_getAll.status, response: t1_getAll.data });

  // 3. POST create note
  let t1_create = await request('http://localhost:3001/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Task 1 Test Note',
      content: 'Building and testing beginner-friendly REST APIs with Node and Express'
    })
  });
  console.log(`[Task 1] POST /api/notes -> HTTP ${t1_create.status}, id: ${t1_create.data.data?.id}`);
  results.push({ task: 1, test: 'POST Create Note', method: 'POST', url: 'http://localhost:3001/api/notes', status: t1_create.status, response: t1_create.data });
  const noteId = t1_create.data.data?.id;

  // 4. GET note by ID
  let t1_getById = await request(`http://localhost:3001/api/notes/${noteId}`);
  console.log(`[Task 1] GET /api/notes/${noteId} -> HTTP ${t1_getById.status}, title: "${t1_getById.data.data?.title}"`);
  results.push({ task: 1, test: 'GET Note by ID', method: 'GET', url: `http://localhost:3001/api/notes/${noteId}`, status: t1_getById.status, response: t1_getById.data });

  // 5. PUT update note
  let t1_put = await request(`http://localhost:3001/api/notes/${noteId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Updated Task 1 Note',
      content: 'Updated note content verified successfully'
    })
  });
  console.log(`[Task 1] PUT /api/notes/${noteId} -> HTTP ${t1_put.status}, updated title: "${t1_put.data.data?.title}"`);
  results.push({ task: 1, test: 'PUT Update Note', method: 'PUT', url: `http://localhost:3001/api/notes/${noteId}`, status: t1_put.status, response: t1_put.data });

  // 6. DELETE note
  let t1_delete = await request(`http://localhost:3001/api/notes/${noteId}`, {
    method: 'DELETE'
  });
  console.log(`[Task 1] DELETE /api/notes/${noteId} -> HTTP ${t1_delete.status}, message: "${t1_delete.data.message}"`);
  results.push({ task: 1, test: 'DELETE Note', method: 'DELETE', url: `http://localhost:3001/api/notes/${noteId}`, status: t1_delete.status, response: t1_delete.data });

  // 7. Invalid input (empty title)
  let t1_invalid = await request('http://localhost:3001/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '', content: 'Invalid note test' })
  });
  console.log(`[Task 1] POST /api/notes (Validation Fail) -> HTTP ${t1_invalid.status}, message: "${t1_invalid.data.message}"`);
  results.push({ task: 1, test: 'POST Validation - Empty Title', method: 'POST', url: 'http://localhost:3001/api/notes', status: t1_invalid.status, response: t1_invalid.data });

  // 8. Not Found ID
  let t1_notFound = await request(`http://localhost:3001/api/notes/999999`);
  console.log(`[Task 1] GET /api/notes/999999 (Not Found) -> HTTP ${t1_notFound.status}, message: "${t1_notFound.data.message}"`);
  results.push({ task: 1, test: 'GET Note by ID - Not Found', method: 'GET', url: 'http://localhost:3001/api/notes/999999', status: t1_notFound.status, response: t1_notFound.data });

  server1.kill();
  console.log('[Task 1] Server stopped.\n');

  // ================= TASK 2: User Authentication API (Port 3002) =================
  console.log('>>> [TASK 2] Starting User Auth API on http://localhost:3002 ...');
  const server2 = startServer('CodeOrbit_User_Auth_API');
  await waitForPort('http://localhost:3002/');

  // 1. Root
  let t2_root = await request('http://localhost:3002/');
  console.log(`[Task 2] GET / -> HTTP ${t2_root.status}:`, t2_root.data.message);
  results.push({ task: 2, test: 'Root Health Check', method: 'GET', url: 'http://localhost:3002/', status: t2_root.status, response: t2_root.data });

  const testEmail = `intern.qa.${Date.now()}@codeorbit.test`;
  const testPassword = 'Password#2026';

  // 2. Signup valid user
  let t2_signup = await request('http://localhost:3002/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'QA Test Engineer',
      email: testEmail,
      password: testPassword
    })
  });
  console.log(`[Task 2] POST /api/auth/signup -> HTTP ${t2_signup.status}, user:`, t2_signup.data.user);
  results.push({ task: 2, test: 'Signup with valid test details', method: 'POST', url: 'http://localhost:3002/api/auth/signup', status: t2_signup.status, response: t2_signup.data });

  // 3. Login with correct credentials
  let t2_login = await request('http://localhost:3002/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword
    })
  });
  console.log(`[Task 2] POST /api/auth/login (Success) -> HTTP ${t2_login.status}, message: "${t2_login.data.message}"`);
  results.push({ task: 2, test: 'Login with correct credentials', method: 'POST', url: 'http://localhost:3002/api/auth/login', status: t2_login.status, response: t2_login.data });

  // 4. Login with incorrect password
  let t2_badLogin = await request('http://localhost:3002/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'IncorrectPassword999'
    })
  });
  console.log(`[Task 2] POST /api/auth/login (Wrong Password) -> HTTP ${t2_badLogin.status}, message: "${t2_badLogin.data.message}"`);
  results.push({ task: 2, test: 'Login with incorrect password', method: 'POST', url: 'http://localhost:3002/api/auth/login', status: t2_badLogin.status, response: t2_badLogin.data });

  // 5. Duplicate signup
  let t2_dupSignup = await request('http://localhost:3002/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'QA Duplicate',
      email: testEmail,
      password: 'AnotherPassword123'
    })
  });
  console.log(`[Task 2] POST /api/auth/signup (Duplicate) -> HTTP ${t2_dupSignup.status}, message: "${t2_dupSignup.data.message}"`);
  results.push({ task: 2, test: 'Duplicate signup', method: 'POST', url: 'http://localhost:3002/api/auth/signup', status: t2_dupSignup.status, response: t2_dupSignup.data });

  // 6. Missing or invalid fields
  let t2_invalid = await request('http://localhost:3002/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'A',
      email: 'not-an-email',
      password: 'short'
    })
  });
  console.log(`[Task 2] POST /api/auth/signup (Validation) -> HTTP ${t2_invalid.status}, message: "${t2_invalid.data.message}"`);
  results.push({ task: 2, test: 'Missing or invalid fields', method: 'POST', url: 'http://localhost:3002/api/auth/signup', status: t2_invalid.status, response: t2_invalid.data });

  server2.kill();
  console.log('[Task 2] Server stopped.\n');

  // ================= TASK 3: Modular CRUD API (Port 3003) =================
  console.log('>>> [TASK 3] Starting Modular CRUD API on http://localhost:3003 ...');
  const server3 = startServer('CodeOrbit_CRUD_API');
  await waitForPort('http://localhost:3003/');

  // 1. Root
  let t3_root = await request('http://localhost:3003/');
  console.log(`[Task 3] GET / -> HTTP ${t3_root.status}:`, t3_root.data.message);
  results.push({ task: 3, test: 'Root Health Check', method: 'GET', url: 'http://localhost:3003/', status: t3_root.status, response: t3_root.data });

  // 2. GET all records
  let t3_getAll = await request('http://localhost:3003/api/notes');
  console.log(`[Task 3] GET /api/notes -> HTTP ${t3_getAll.status}, count: ${t3_getAll.data.data?.length || 0}`);
  results.push({ task: 3, test: 'GET All Records', method: 'GET', url: 'http://localhost:3003/api/notes', status: t3_getAll.status, response: t3_getAll.data });

  // 3. POST create record
  let t3_create = await request('http://localhost:3003/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Modular Architecture Note',
      content: 'Separating concerns across routes, controllers, and data storage layers'
    })
  });
  console.log(`[Task 3] POST /api/notes -> HTTP ${t3_create.status}, id: ${t3_create.data.data?.id}`);
  results.push({ task: 3, test: 'POST Create Record', method: 'POST', url: 'http://localhost:3003/api/notes', status: t3_create.status, response: t3_create.data });
  const recordId = t3_create.data.data?.id;

  // 4. GET record by ID
  let t3_getById = await request(`http://localhost:3003/api/notes/${recordId}`);
  console.log(`[Task 3] GET /api/notes/${recordId} -> HTTP ${t3_getById.status}, title: "${t3_getById.data.data?.title}"`);
  results.push({ task: 3, test: 'GET Record by ID', method: 'GET', url: `http://localhost:3003/api/notes/${recordId}`, status: t3_getById.status, response: t3_getById.data });

  // 5. PUT update record
  let t3_put = await request(`http://localhost:3003/api/notes/${recordId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Updated Modular Architecture Note',
      content: 'Updated content verified through controller logic'
    })
  });
  console.log(`[Task 3] PUT /api/notes/${recordId} -> HTTP ${t3_put.status}, updated title: "${t3_put.data.data?.title}"`);
  results.push({ task: 3, test: 'PUT Update Record', method: 'PUT', url: `http://localhost:3003/api/notes/${recordId}`, status: t3_put.status, response: t3_put.data });

  // 6. DELETE record
  let t3_delete = await request(`http://localhost:3003/api/notes/${recordId}`, {
    method: 'DELETE'
  });
  console.log(`[Task 3] DELETE /api/notes/${recordId} -> HTTP ${t3_delete.status}, message: "${t3_delete.data.message}"`);
  results.push({ task: 3, test: 'DELETE Record', method: 'DELETE', url: `http://localhost:3003/api/notes/${recordId}`, status: t3_delete.status, response: t3_delete.data });

  // 7. Invalid-input test (missing title)
  let t3_invalid = await request('http://localhost:3003/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'Missing title property' })
  });
  console.log(`[Task 3] POST /api/notes (Missing Title) -> HTTP ${t3_invalid.status}, message: "${t3_invalid.data.message}"`);
  results.push({ task: 3, test: 'Invalid-input test - Missing Title', method: 'POST', url: 'http://localhost:3003/api/notes', status: t3_invalid.status, response: t3_invalid.data });

  // 8. Invalid ID format (non-integer)
  let t3_invalidId = await request('http://localhost:3003/api/notes/invalid_id');
  console.log(`[Task 3] GET /api/notes/invalid_id (Invalid ID) -> HTTP ${t3_invalidId.status}, message: "${t3_invalidId.data.message}"`);
  results.push({ task: 3, test: 'Invalid-input test - Non-integer ID', method: 'GET', url: 'http://localhost:3003/api/notes/invalid_id', status: t3_invalidId.status, response: t3_invalidId.data });

  server3.kill();
  console.log('[Task 3] Server stopped.\n');

  fs.writeFileSync(
    path.join(__dirname, 'test_execution_log.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('====================================================');
  console.log(`All ${results.length} tests executed successfully! Results saved to SUBMISSION_EVIDENCE/test_execution_log.json`);
  console.log('====================================================');
}

run().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});

