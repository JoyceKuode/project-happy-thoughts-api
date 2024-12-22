# Project Happy Thoughts API

The Happy Thoughts API is designed to integrate with the previously created Happy Thoughts frontend that allows users to post a thought, view recent posts, and like others' thoughts.

## The problem

First I analyzed the requirements to define routes (GET /thoughts, POST /thoughts, PATCH /thoughts/:thoughtId/like) and structured the project so there was a clear separation between the Thought model and routes.

Technologies I used included Node.js and Express.js for server-side development, Mongoose for database modeling and interaction with MongoDB, MongoDB Atlas for cloud-based database storage, Postman for testing endpoints locally, and Render for deployment.

I created a Thought model with validation for message, hearts, and createdAt. I then implemented the routes to GET- fetch the 20 most recent thoughts, POST- validate input and create new thoughts, and PATCH- increment hearts count for a specific thought.

If I had more time, I would try stretch goals like adding categories to different types of thoughts or allowing users to remain anonymous or add their names by updating the Thought model. I would also add pagination for improved scalability.

## View it live

(https://project-happy-thoughts-api-ph1w.onrender.com/)

https://happy-thoughts-joyce.netlify.app/
