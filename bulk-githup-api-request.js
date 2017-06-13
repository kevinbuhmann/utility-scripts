const http = require('https');

const baseOptions = {
  method: 'PUT',
  hostname: 'api.github.com',
  port: null,
  headers: {
    'user-agent': 'GitHub Manager',
    'authorization': 'Bearer ',
    'accept': 'application/vnd.github.loki-preview+json',
    'content-type': 'application/json'
  }
};

const payload = {
  required_status_checks: { include_admins: true, strict: true, contexts: [] },
  restrictions: { users: [], teams: [] },
  enforce_admins: true
};

const repos = [
  'antique-malls',
  'common-databases',
  'config',
  'conversion-scripts',
  'estate-sales',
  'external-dependencies',
  'programs',
  'vintage-software',
  'vstack',
  'web-utility'
];

const branches = [
  // 'dev',
  'qa',
  'release',
  'master'
];

const requests = repos
  .map(repo => branches.map(branch => `/repos/vintage-software/${repo}/branches/${branch}/protection`))
  .reduce((prev, curr) => prev.concat(curr), [])
  .map(url => request(url));

Promise.all(requests).then(() => { console.log('done'); });

function request(path) {
  return new Promise((resolve, reject) => {
    const options = Object.assign({}, baseOptions, { path });

    const req = http.request(options, res => {
      const chunks = [];

      res.on('data', chunk => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks);
        console.log(path);
        resolve(body.toString());
      });

      res.on('error', () => {
        reject(error);
      });
    });

    req.write(JSON.stringify(payload));
    req.end();
  })
}