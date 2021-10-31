import { Duration } from 'moment';

export class AddJobDto {
  public readonly name!: string;

  public readonly period!: Duration;

  public readonly job!: () => Promise<unknown>;

  public readonly beforeStart?: () => Promise<unknown>;

  public readonly afterStart?: () => Promise<unknown>;

  public readonly executeImmediately?: boolean;
}
