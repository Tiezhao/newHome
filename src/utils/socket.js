
import io from 'socket.io-client'

class Socket {
  register = (url, query) => {
    const socket = io(url, {
      forceNew: true,
      rejectUnauthorized: false,
      ...query,
      // 传输协议
      transports: ['websocket']
    })

    return socket
  }


}

export default new Socket()
