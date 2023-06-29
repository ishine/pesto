FROM node:16.18 as builder

# Set the working directory to /app inside the container
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./

# Install requirements
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# Copy app
COPY . ./

RUN npm run build

FROM nginx:1.19-alpine AS server
COPY --from=builder ./app/build /usr/share/nginx/html