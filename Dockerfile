# --- Build stage ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite bakes VITE_* vars into the bundle at build time — pass them as
# build args so the same Dockerfile can produce a staging or prod image.
# httpClient.js fails the build if VITE_API_BASE_URL is missing.
ARG VITE_API_BASE_URL
ARG VITE_UNSPLASH_ACCESS_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_UNSPLASH_ACCESS_KEY=$VITE_UNSPLASH_ACCESS_KEY

RUN npm run build

# --- Serve stage ---
FROM nginx:1.27-alpine AS serve

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
