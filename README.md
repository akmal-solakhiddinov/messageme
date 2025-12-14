# MessageMe

## CI/CD Pipeline Setup

This project uses GitHub Actions to build and deploy the application automatically.

When code is pushed to the `main` branch, the pipeline starts and deploys the app to the server.

---

### Step 1: Create a GitHub Repository

1. Log in to GitHub
2. Create a new repository
3. Open the **Actions** tab

You can choose a ready template or click **“Set up a workflow yourself”** to create your own pipeline.

This will open a new file in the GitHub editor.

---

### Step 2: Add the Workflow File

Copy and paste the following code into the workflow file:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 21

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

      - name: Deploy to server
        run: |
          ssh -o StrictHostKeyChecking=no ${{ secrets.USERNAME }}@${{ secrets.HOST }} << 'EOF'
            cd /var/www/messageme
            git pull origin main
            docker-compose down
            docker-compose build --no-cache
            docker-compose up -d
          EOF
```

### Step 3: Add GitHub Secrets

The pipeline needs secrets to connect to the server securely.

#### Required secrets

- `SSH_PRIVATE_KEY` – Private SSH key for server access
- `USERNAME` – Server username
- `HOST` – Server IP address or domain

#### How to add secrets

1. Open **Settings** in your repository
2. Go to **Secrets and variables → Actions**
3. Click **New repository secret**
4. Add each secret one by one

---

### How the Pipeline Works

- You push code to the `main` branch
- GitHub Actions builds the project
- If the build succeeds, deployment starts
- The server pulls new code and restarts Docker containers

## Dockerization

> “It works on my computer.”

Docker helps solve the problem of configuring the application on every server.

We configure the application **once** using Docker, and then run it **anywhere** in the same way.

---

### Steps

1. Create a `Dockerfile`
2. Create a `docker-compose.yaml` file

---

### Dockerfile

The `Dockerfile` contains instructions on how to build the application image based on the project requirements.

```dockerfile
FROM node:alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose application port
EXPOSE 4000

# Start the application
CMD ["npm", "run", "dev"]
```

### What this Dockerfile does

- Uses a lightweight Node.js image

- Sets /app as the working directory

- Installs project dependencies

- Copies the application code

- Exposes port 4000

- Starts the application using npm run dev

### docker-compose.yaml

The `docker-compose.yaml` file is used to define and run multiple services together.

In this project, it is used to run the application container in a simple and repeatable way.

```yaml
version: "3.9"

services:
  app:
    build: .
    container_name: messageme-app
    ports:
      - "4000:4000"
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
```

### What this docker-compose file does

- Builds the Docker image using the Dockerfile

- Runs the application in a container named messageme-app

- Maps port 4000 from the container to the host machine

- Mounts the project files into the container for development

- Starts the application using npm run dev

### Why Docker Compose is used

- Simplifies running the application with a single command

- Ensures the same environment on every machine

- Makes deployment and local development consistent

To start the application, run:

`docker-compose up --build`

### Future Plans

- Separate `development` and `production` environments

- Add **production targets** to the `Dockerfile`

- Rename the current file to `docker-compose.development.yaml`

- Keep `docker-compose.yaml` **production-only**

- Remove `npm run dev` from `production`

- Run production using `npm start` or `node index.js` after build
