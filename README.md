# Udagram Application using Serverless

The project provides the following features-
1) Create new feed.
2) Get all feeds along with feed image.
3) Update a feed to attach image to it.

# Functionality of the application

This application will allow creating/removing/updating/fetching FEED items. Each FEED item can optionally have an attachment image. Each user only has access to FEED items that he/she has created.


# Frontend

The `client` folder contains a web application. This web-app uses the backend APIs which are developed in serverless.

The only file that you need to edit is the `config.ts` file in the `client` folder. 

const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless FEED application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection:

![Alt text](images/import-collection-5.png?raw=true "Image 5")