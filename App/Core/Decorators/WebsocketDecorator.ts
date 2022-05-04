import 'reflect-metadata';

export function Websocket(channelName: string) {
  return (target: object) => {
    const channel = {
      channelName: channelName,
      target: target,
    };

    Reflect.defineMetadata('websocket-channel', channel, target);
  };
}
