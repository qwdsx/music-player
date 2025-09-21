

# (WIP) A music player written in Angular and Rust

## env files
Environment files should look like this:
<br>
Frontend: create a file called 'env.ts' in the folder "front/src/environments/"
```ts
export const env = {
    apiUrl: "<api url>" // Backend url, most likely localhost
}
```
Backend: file called .env in the root of backend
```console
ROCKET_ADDRESS="<server address>" // most likely localhost (e.g., "127.0.0.1"), port is automatically assigned by rocket
MUSIC_FOLDER="<folder containing songs>"
```

### Preview
![preview](./assets/preview.png)
![preview2](./assets/preview2.png)
