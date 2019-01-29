# CMM
Church Music Manager

# Requirements

##### Create a project on firebase console.
##### Paste firebase config on `environment.ts` and `enviroment.prod.ts` (for `--prod`)

## Run Project

```
npm install
npm install -g firebase-tools
ionic serve
```

## Build Project To Deploy

```
ng build --prod
```
Copy Files from `www` to `public` (this folder will be created after firebase-tools installation.

```
firebase login
firebase deploy --only hosting
```
