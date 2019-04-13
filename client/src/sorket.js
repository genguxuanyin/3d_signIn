export default {
    ws: null, // WebSocket实例
    init(config, onMessage, onError) {
        if (this.ws) this.ws.close()
        this.ws = new WebSocket(`ws://localhost:3000/${config.user.id}`);
        // 客户端接收消息
        this.ws.onmessage = event => {
            let message = JSON.parse(event.data);
            onMessage && onMessage(message) // 接收到消息触发的回调
        };
        // 出错
        this.ws.onerror = error => {
            onError && onError(error)  // 出错时触发的回调
        };
        this.ws.onclose = () => { // WebSocket关闭时触发
            this.ws = null
        }
    },
    send(msgObj) { // 发送消息时调用
        this.ws.send(JSON.stringify(msgObj));
    }
}