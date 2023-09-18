import io from 'socket.io-client';

const skt = () => {
  return io('http://localhost:80');
};

export default skt;
