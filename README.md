# CAF - Herramienta Digital - api

### Prerequisites

* **Node**. Nothing to do here if already installed for [`formularioCAF`](https://github.com/Program-AR/formulariocaf). Maybe just run `nvm use` to make sure right npm version is in use. The version required is indicated in `.nvmrc` file.

### Running the app
1. `npm install`
2. Create `.env` file with environment configurations, following example in `sample.env`. (WEB_DB_CONNECTION_URI must point to PosgreSQL database & port)
3. Run the app: for development: `npm run dev`, for production: `npm run start` 

### Testing the app

```Bash
npm test
```

### Further commands

Refer to `package.json` for all the usable scripts.
