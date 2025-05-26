import { app } from "./app";

app.listen({
    host: '0.0.0.0',
    port: 2323
}).then(() => {
    console.log('🚀 Server is running on PORT 2323')
})