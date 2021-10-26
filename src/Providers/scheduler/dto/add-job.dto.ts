import { Duration } from 'moment';

export class AddJobDto {
  public readonly name!: string;

  public readonly period!: Duration;

  public readonly job!: () => Promise<unknown>;

  public readonly callback?: () => Promise<unknown>;

  public readonly executeImmediately?: boolean;
}
