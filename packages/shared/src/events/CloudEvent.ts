export interface CloudEvent<T = unknown> {
  specversion: '1.0';
  id: string;
  source: string;
  type: string;
  datacontenttype: 'application/json';
  time: string;
  iocorrelationid: string;
  data: T;
}
