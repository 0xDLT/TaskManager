# Nodejs + Expressjs + MongoDB

## env file

1- Rename file '.env.exmaple' to '.env'
2- Put your mongo database URL 
3- Run the code `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` to genrate a JWT
4- Put your admin invite token manuly for exmaple `ADMIN_INVITE_TOKEN=123`
5- Put `PORT = 800` (optional)

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