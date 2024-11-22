# Step 1: Build the React app
FROM node:20.16-alpine as build

WORKDIR /bias-app

COPY package*.json /bias-app/

RUN npm install --force

COPY . /bias-app

RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:alpine

# Copy build assets from the build stage to the Nginx html directory
COPY --from=build /bias-app/build /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
