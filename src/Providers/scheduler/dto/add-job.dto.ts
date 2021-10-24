import { Duration } from 'moment';

export class AddJobDto {
  public readonly name!: string;

  public readonly frequency!: Duration;

  public readonly callback!: () => unknown | Promise<unknown>;

  public readonly onStart?: () => void;

  public readonly executeImmediately?: boolean;
}
