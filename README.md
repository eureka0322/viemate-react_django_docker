## Installation

```bash
npm install
```

## Running Dev Server

```bash
npm run dev
```

## Building and Running Production Server

```bash
npm run build
npm run start
```


## Build docker image
```bash
docker build -t viemateorg/frontend-viemate .
```


## Run docker
```
docker run --name frontend-viemate -p 8080:8080 -d viemateorg/frontend-viemate
```


## Push docker

```
docker push viemateorg/frontend-viemate
```


## Restart docker
```
docker pull viemateorg/frontend-viemate
docker stop frontend-viemate
docker rm frontend-viemate
docker run --name frontend-viemate -p 8080:8080 -d viemateorg/frontend-viemate
```
