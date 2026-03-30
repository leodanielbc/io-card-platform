export interface ICardIssuanceGateway {
  process(forceError: boolean): Promise<void>;
}
