# CMM
Church Music Manager

## Run Project

```
npm install
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
