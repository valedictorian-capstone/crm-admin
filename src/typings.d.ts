declare class StringeeClient {
  on(type: string, callback: Function)
  connect(token: string)
}
declare class StringeeVideo {
  static createLocalVideoTrack(client: StringeeClient, options: any)
}
