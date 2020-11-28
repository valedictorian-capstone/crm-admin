import { Component, OnInit } from '@angular/core';
import { CallService } from '@services';
@Component({
  selector: 'app-call-main',
  templateUrl: './call-main.page.html',
  styleUrls: ['./call-main.page.scss']
})
export class CallMainPage implements OnInit {

  accessToken = '';
  roomToken = '';
  restToken = '';
  roomId = '855e6384-c3b2-4772-8919-0c55f3942563';
  roomName = 'New Call';
  userId = 'b3413f1e-86d4-4042-b8d8-b8c1e3310193';
  client: StringeeClient;
  audio = false;
  video = false;
  screen = false;
  dimentions = {
    width: {
      min: '1280',
      max: '1280'
    },
    height: {
      min: '720',
      max: '720'
    }
  };
  quanlities = [
    {
      label: '720p',
      videoDimensions: {
        width: {
          min: '1280',
          max: '1280'
        },
        height: {
          min: '720',
          max: '720'
        }
      }
    },
    {
      label: '480p',
      videoDimensions: {
        width: {
          min: '854',
          max: '854'
        },
        height: {
          min: '480',
          max: '480'
        }
      }
    },
    {
      label: '360p',
      videoDimensions: {
        width: {
          min: '640',
          max: '640'
        },
        height: {
          min: '360',
          max: '360'
        }
      }
    },
    {
      label: '240p',
      videoDimensions: {
        width: {
          min: '426',
          max: '426'
        },
        height: {
          min: '240',
          max: '240'
        }
      }
    }
  ];
  constructor(
    protected readonly callService: CallService
  ) {
    this.client = new StringeeClient();
    this.client.on('authen', (res) => {
    });
  }

  async ngOnInit() {
    //   this.accessToken = data.access_token;
    //   this.roomToken = data.room_token;
    //   this.restToken = data.rest_access_token;
    await this.callService.getRestToken(true).toPromise().then((data) => this.restToken = data.rest_access_token);
    // this.callService.getToken(undefined, undefined, true).subscribe((data) => {
    //   this.accessToken = data.access_token;
    //   this.roomToken = data.room_token;
    //   this.restToken = data.rest_access_token;
    //   this.callService.create(this.roomId, data.rest_access_token).subscribe((e) => {
    //   });
    // });
    // await this.callService.create(this.roomId, this.restToken).toPromise().then((data) => {
    // });
    await this.createRoom();
  }

  createRoom = async () => {
    this.roomId = (await this.callService.create(this.roomName, this.restToken).toPromise()).roomId;
    this.roomToken = await this.callService.getRoomToken(this.roomId).toPromise();
    this.connect();
    this.publishVideo();
  }

  connect = async () => {
    this.accessToken = await this.callService.getAccessToken(this.userId).toPromise();

    this.client.connect(this.accessToken);
  }

  publishVideo = async () => {
    const localTrack = await StringeeVideo.createLocalVideoTrack(this.client, {
      audio: this.audio,
      video: this.video,
      screen: this.screen,
      videoDimensions: this.dimentions
    });
    document.getElementById('videos').appendChild(localTrack.attach());
  }
}
