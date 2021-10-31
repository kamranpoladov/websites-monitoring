export class AlertRepository {
  constructor(private websitesDownMap: Map<string, boolean>) {
    this.websitesDownMap = new Map();
  }

  public getIsDown(website: string) {
    if (!this.websitesDownMap.has(website)) {
      this.websitesDownMap.set(website, false);
    }
    return this.websitesDownMap.get(website) as boolean;
  }

  public setIsDown(website: string, isDown: boolean) {
    this.websitesDownMap.set(website, isDown);
  }
}
