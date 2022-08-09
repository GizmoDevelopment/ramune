<p align="center">
	<img src="https://user-images.githubusercontent.com/25076630/124389427-e2520600-dc9b-11eb-88a9-150a0e372899.png" height="50">
</p>
<p align="center" style="font-weight: bold;">Watch anime together with your friends.</p>

<p align="center">
	<a href="https://github.com/GizmoDevelopment/ramune/actions"><img src="https://img.shields.io/github/workflow/status/GizmoDevelopment/ramune/Build?label=Build"></a>
	<a href="https://discord.gg/DHKjwQY"><img src="https://img.shields.io/discord/246369359705014272?color=%236E85D2&label=Discord&logo=discord&logoColor=white"></a>
</p>

<div align="center" style="display: inline-flex; width: 100%; justify-content: center; align-items: center;">
	<img height="24" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png" style="border-radius: 2px; margin: .5rem;">
	<img height="24" src="https://vitejs.dev/logo.svg" style="margin: .5rem;">
	<img height="24" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/vue/vue.png"  style="margin: .5rem;">
</div>

#

### Special thanks to [Cas (ThaUnknown)](https://github.com/ThaUnknown) for [their dedicated rewrite](https://github.com/ThaUnknown/JavascriptSubtitlesOctopus) of JSO's codebase that includes many improvements and bug fixes!

#

Website: [Click here](https:///ramune.gizmo.moe)

<br>

# Setup

## 1. Clone the repository
This will create a local copy of the project.
```sh
git clone https://github.com/GizmoDevelopment/ramune.git
```

## 2. Set environmental variables
Make sure that you have the environmental variables set up if you want full functionality.
```sh
mv .env.example .env
```
### VITE_SHOW_ENDPOINT
This endpoint is responsible for fetching show data. [Project page](https://github.com/GizmoDevelopment/ramune-backend)

### VITE_SOCKET_ENDPOINT
This endpoint is responsible for handling the WebSocket connections for rooms and chatting. [Project page](https://github.com/GizmoDevelopment/gizmo-chat-backend)

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