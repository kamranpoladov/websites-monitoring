export class AlertRepository {
  constructor(private isDown: boolean) {
    this.isDown = false;
  }

  public getIsDown() {
    return this.isDown;
  }

  public setIsDown(isDown: boolean) {
    this.isDown = isDown;
  }
}
