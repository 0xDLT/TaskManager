# Nodejs + Expressjs + MongoDB

## env file

<div style="display:flex; gap:20px;">
  <div>
    <p><b>1.</b> Rename file <code>.env.example</code> to <code>.env</code></p>
    <p><b>2.</b> Put your MongoDB URL</p>
    <p><b>3.</b> Run code:</p>
    <pre><code>node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"</code></pre>
  </div>
  <div>
    <p><b>4.</b> Put your admin invite token manually</p>
    <pre><code>ADMIN_INVITE_TOKEN=123</code></pre>
    <p><b>5.</b> (Optional) Put <code>PORT=800</code></p>
  </div>
</div>

## install

-to isntall needed packes
```bash
npm install
```

## Run the project

```bash
npm run dev
```

-localhost:

```bash
http://localhost:800/
```

## Profile picture

all profile picutre will be uploaded in your upload forlder `server/uploads` and every profile picture has its own URL
