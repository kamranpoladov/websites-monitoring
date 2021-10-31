import { AlertModel } from '../alert/models';

import { StatsType } from './constants';
import { StatsListModel, StatsModel, WebsiteStatsModel } from './models';

export class StatsRepository {
  constructor(private readonly statsList: StatsListModel) {
    this.statsList = {
      rows: []
    };
  }

  public updateStatsForWebsite(
    website: string,
    stats: StatsModel,
    type: StatsType
  ) {
    const index = this.findStatIndexByWebsite(website);

    if (type === StatsType.Short) {
      this.statsList.rows[index].short = { ...stats };
    } else {
      this.statsList.rows[index].long = { ...stats };
    }
  }

  public initializeEmptyStats(website: string) {
    const websiteStatsModel = new WebsiteStatsModel();

    websiteStatsModel.short = new StatsModel();
    websiteStatsModel.long = new StatsModel();
    websiteStatsModel.website = website;
    websiteStatsModel.alerts = [];

    this.statsList.rows.push(websiteStatsModel);
  }

  public addAlertForWebsite(website: string, alert: AlertModel) {
    const index = this.findStatIndexByWebsite(website);

    this.statsList.rows[index].alerts.push(alert);
  }

  public getStatsList(): StatsListModel {
    return this.statsList;
  }

  private findStatIndexByWebsite(website: string): number {
    return this.statsList.rows.findIndex(stats => stats.website === website);
  }
}
