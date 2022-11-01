FROM node:14.17.3-alpine as builder

WORKDIR /usr/src/app

ARG REACT_APP_API_URL=https://api.tradezonemap.com/api/v1.0
ARG REACT_APP_ENVIROMENT='production'
# Copying source files
COPY . .

#Installing yarn package
#RUN npm i -g yarn

# Building app
RUN yarn install && \
    yarn global add env-cmd && \
    env-cmd -f .env.production yarn build

FROM node:14.17.3-alpine

# Create app directory
WORKDIR /usr/src/app

# copy from the builder
COPY --from=builder /usr/src/app/ .

RUN ls -la

EXPOSE 6280

# Start the app
CMD npm run start
