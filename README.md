<p align="center">
	<img src="https://user-images.githubusercontent.com/25076630/124389427-e2520600-dc9b-11eb-88a9-150a0e372899.png" height="50">
	<br>
	<span align="center"><b>Watch anime together with your friends.</b></span>
	<br><br>
	<a href="https://github.com/GizmoDevelopment/ramune/actions"><img src="https://img.shields.io/github/actions/workflow/status/GizmoDevelopment/ramune/ci.yml?branch=master"></a>
	<a href="https://discord.gg/DHKjwQY"><img src="https://img.shields.io/discord/246369359705014272?color=%236E85D2&label=Discord&logo=discord&logoColor=white"></a>
	<br><br>
	<img src="https://skillicons.dev/icons?i=ts,vite,vue&theme=dark" alt="Languages and tools used">
</p>

#

#### Special thanks to [Cas (ThaUnknown)](https://github.com/ThaUnknown) for [their dedicated rewrite](https://github.com/ThaUnknown/jassub) of JSO's codebase that includes many improvements and bug fixes!

#

<br>

# Setup

## 1. Clone the repository
This will create a local copy of the project.
```sh
git clone https://github.com/GizmoDevelopment/ramune.git
```

## 2. Set environmental variables
Make sure that you have the environmental variables set up if you want the website to function.
```sh
mv .env.example .env
```
### VITE_SHOW_ENDPOINT
This endpoint is responsible for fetching show data. [Project page](https://github.com/GizmoDevelopment/ramune-backend)

### VITE_SOCKET_ENDPOINT
This endpoint is responsible for handling the WebSocket connections for rooms and chatting. [Project page](https://github.com/GizmoDevelopment/ramune-chat)

### VITE_CDN_ENDPOINT
This is where all the images and videos are actually stored.

## 3. Run development server
```sh
npm run dev
```

## 4. Build for production
```sh
npm run build
```
