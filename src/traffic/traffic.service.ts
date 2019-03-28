import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import * as fs from 'fs';
import * as zlib from 'zlib';
import * as sax from 'sax';
import * as parser from 'xml2json';
import { catchError, map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { AnwbApiReply } from '../shared/models/feeds/traffic/anwb/anwb-reply.model';
import { AnwbRoadEntry } from '../shared/models/feeds/traffic/anwb/anwb-road-entry.model';
import { AnwbRadar } from '../shared/models/feeds/traffic/anwb/anwb-radar.model';
import { Traffic } from '../shared/models/feeds/traffic/traffic.model';
import { TrafficJamsEntry } from '../shared/models/feeds/traffic/traffic-jams-entry.model';
import { TrafficRadarEntry } from '../shared/models/feeds/traffic/traffic-radar-entry.model';
import { TrafficRoadWorksEntry } from '../shared/models/feeds/traffic/traffic-road-works-entry.model';

@Injectable()
export class TrafficService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async findAllTraffic(): Promise<Traffic> {
    const url = this.configService.get('api').feeds.traffic.serviceUrls.url;
    const anwbResponse = await this.httpService
      .get(url)
      .pipe(map(response => response.data))
      .toPromise();

    return this.anwbMapper(anwbResponse);
  }

  /**
   * Maps the AnwbReply to a GZ response
   * @param anwbResponse
   */
  anwbMapper(anwbResponse: AnwbApiReply): any {
    const response = {
      radars: {
        total: this.getEventTotal(anwbResponse, 'radars').length,
        roadEntries: this.getRoadEntriesByEvent(anwbResponse, 'radars'),
      },
      trafficJams: {
        total: this.getEventTotal(anwbResponse, 'trafficJams').length,
        roadEntries: this.getRoadEntriesByEvent(anwbResponse, 'trafficJams'),
      },
      roadWorks: {
        total: this.getEventTotal(anwbResponse, 'roadWorks').length,
        roadEntries: this.getRoadEntriesByEvent(anwbResponse, 'roadWorks'),
      },
    };

    return response;
  }

  /**
   * Retrieves all road entries by a certain event
   * @param anwbResponse
   * @param eventKey
   */
  private getRoadEntriesByEvent(anwbResponse: AnwbApiReply, eventKey: string) {
    return anwbResponse.roadEntries
      .map((roadEntry: AnwbRoadEntry) =>
        roadEntry.events[eventKey].length
          ? {
              road: roadEntry.road,
              roadType: roadEntry.roadType,
              [eventKey]: roadEntry.events[eventKey],
            }
          : null,
      )
      .filter(entry => Boolean(entry));
  }

  /**
   * Retrieves the total of a certain event
   * @param anwbResponse
   * @param eventKey
   */
  private getEventTotal(anwbResponse: AnwbApiReply, eventKey: string) {
    return anwbResponse.roadEntries
      .map((roadEntry: AnwbRoadEntry) => roadEntry.events[eventKey])
      .filter(eventsArr => eventsArr.length)
      .reduce((accEvents, currEvents) => accEvents.concat(currEvents), []);
  }

  getGzipXml() {
    const saxStream = sax.createStream();
    const xml = fs
      .createReadStream(__dirname + '/trafficspeed.xml.gz')
      .pipe(zlib.createUnzip())
      .pipe(saxStream);
    console.log('xml-----: ', xml);
    return xml;
  }
}
