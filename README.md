# Websites Monitoring CLI App

CLI application that allows users to monitor websites' performance, gathering statistics 
about average response time, maximum responses time, availability of a given website 
and HTTP status codes count.

## Features
- Have a single instance of a program to be responsible for monitoring a single website
- Send GET requests to a website over custom defined frequency
- Obtain useful statistics such as average response time, maximum responses time, availability of a given website and HTTP status codes count
- Get alert messages when website is down and when it has recovered
- Optionally save the statistics in a separate `.log` file

## Tech stack
- [TypeScript](https://github.com/microsoft/TypeScript)
- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/) *(progressive Node.js framework)*
- [NestJS Console](https://www.npmjs.com/package/nestjs-console) *(NestJS Module that provides CLI tools)*
- [Moment.js](https://momentjs.com/) *(working with time)*
- [ESLint](https://eslint.org/) *(code analysis)*
- [Prettier](https://prettier.io/) *(code formatting)*

## Installation

### Prerequisites
Make sure that [Node.js](https://nodejs.org/en/) and [Git](https://git-scm.com/) is installed on your operating system

### Setup
1) Install the application with **Git**:
```
$ git clone https://github.com/kamranpoladov/websites-monitoring.git
$ cd websites-monitoring
```
2) Install the dependencies with either **Yarn** or **npm**:
```
$ yarn install
```

## Usage
### Format
```
$ yarn start monitor [options]
```

### Available options
- **Required**:
  - `-w --website <website>` - define the website to be monitored. Has to be a valid URL, protocol is not required
  - `-i --interval <interval>` - define the frequency (in seconds) of monitoring a website. Minimum 3 seconds
- **Optional**:
  - `-s --save` - if present, will create a new file inside `logs` folder and save all the logs for website there

### Examples

```
$ yarn start monitor -w datadoghq.com -i 5

✔ Validation passed!

...
```

```
$ yarn start monitor --website https://datadoghq.com --interval 5

✔ Validation passed!

...
```

```
$ yarn start monitor -w localhost:3000 -i 5 -s

✔ Validation passed!

...
```

```
$ yarn start monitor -w invalid_website -i 5

✖ Validation failed!
Url is invalid
Please, restart the application
```

```
$ yarn start monitor -w datadoghq.com -i 1

✖ Validation failed!
Interval has to be a positive number greater than or equal to 3
Please, restart the application
```

```
$ yarn start monitor -w invalid_website

error: required option '-i --interval <interval>' not specified
```

```
$ yarn start monitor -i 5

error: required option '-w --website <website>' not specified
```

## Interface

### Statistics for past 10 minutes (displayed every 10 seconds)
```
--------------------------------------- SHORT STATS ---------------------------------------


Displaying stats for http://localhost:3000 from 04:22:52 am to 04:32:50 am
Average response time: 2 ms
Maximum response time: 14 ms
Availability: 51%

Status	Frequency

500	46
200	66
201	11
502	27
```

### Statistics for past hour (displayed every minute)
```
--------------------------------------- LONG STATS ---------------------------------------


Displaying stats for http://localhost:3000 from 03:33:00 am to 04:33:00 am
Average response time: 2 ms
Maximum response time: 22 ms
Availability: 51%

Status	Frequency

200	150
500	127
201	11
502	27
```

### Alerting when website is down for the past 2 minutes (i.e. availability is below 80%)
```
--------------------------------------- ALERT DOWN ---------------------------------------


Website http://localhost:3000 is down. Availability is 67% at 04:12:08 am
```

### Alerting when website recovered (i.e. availability is more than 80%)
```
--------------------------------------- ALERT RECOVER ---------------------------------------


Website http://localhost:3000 recovered. Availability is 81% at 04:33:24 am
```


## Code examples

### Periodic website fetching and statistics displaying

`SchedulerService` is used to set up the jobs to be run periodically. It is based on `ScheduleModule` of `@nestjs/schedule` library but provides additional functionality such as optionally firing off the callback function immediately and a second callback to be run only once after a job starts

`src/Providers/scheduler/scheduler.service.ts`

```
public async addJob({
  name,
  frequency,
  callback,
  onStart,
  executeImmediately
}: AddJobDto) {
  executeImmediately && (await callback());
  const interval = setInterval(callback, frequency.asMilliseconds());
  this.schedulerRegistry.addInterval(name, interval);
  onStart && onStart(); // execute onStart callback if it was provided
}
```

`StatsService` consumes `SchedulerService` to set up periodic fetching of a website and logging of statistics for both *short* (every 10 seconds) and *long* (every minute) intervals. Note that the jobs for displaying for *short* and *long* stats start only after the website has been fetched for the first time. This is done to handle the edge case of the very first request giving timeout error: if it takes a website too long to respond (i.e. longer than 10 seconds) for the first time, the statistics should not be displayed as we have no responses to analyze yet

`src/Modules/stats/stats.service.ts`

```
public async monitor({ website, interval, save }: AddWebsiteDto) {
  // save logs to unique file if -s flag was provided
  save && this.loggerService.streamLogsToFile(`${website}.${Date.now()}.log`);

  const startStatsShortJob = () =>
    this.schedulerService.addJob({
      name: DISPLAY_STATS_SHORT_JOB_KEY,
      frequency: this.configService.shortFrequency,
      callback: () =>
        this.displayStats({
          website,
          duration: this.configService.shortDuration,
          statsType: StatsType.Short
        })
    });

  const startStatsLongJob = () =>
    this.schedulerService.addJob({
      name: DISPLAY_STATS_LONG_JOB_KEY,
      frequency: this.configService.longFrequency,
      callback: () =>
        this.displayStats({
          website,
          duration: this.configService.longDuration,
          statsType: StatsType.Long
        })
    });

  await this.schedulerService.addJob({
    name: FETCH_JOB_KEY,
    frequency: interval,
    callback: () => this.fetchWebsite(website),
    onStart: () => (startStatsShortJob(), startStatsLongJob()),
    executeImmediately: true
  });
}
```

### Alerting logic

Alerts are implemented using `EventEmitter` to avoid circular dependency between `AlertService` and `ResponseService`

`ResponseService` emits an event every time a new response is registered

`src/Modules/response/response.service.ts`

```
public async registerResponse(url: string): Promise<void> {
  const httpResponse = await this.httpService.fetch(url);

  const response = plainToClass(ResponseModel, {
    ...httpResponse,
    registeredAt: moment().toISOString()
  });

  this.responseRepository.addResponse(response);

  // notify AlertService about new registered response
  this.eventEmitter.emit(
    RegisterResponseEvent.eventName,
    new RegisterResponseEvent(url)
  );
}
```

`AlertService` listens to this event and consumes `ResponseService` to determine whether website is down or has recovered and displays according message in console via `LoggerService`

`src/Modules/alert/alert.service.ts`

```
@OnEvent(RegisterResponseEvent.eventName)
private onRegisterResponse({ website }: RegisterResponseEvent): void {
  const start = moment().subtract(this.configService.downCheckDuration);
  const now = moment();
  const interval = new Interval({ start, end: now });

  const availability = this.responseService.getAvailability(interval);
  const targetAvailability = this.configService.alertAvailability;
  const currentlyDown = this.alertRepository.getIsDown();

  this.alertRepository.setIsDown(availability < targetAvailability);

  if (availability < targetAvailability && !currentlyDown) {
    this.loggerService.alert({
      availability,
      time: now,
      website,
      type: AlertType.Down
    });
  } else if (availability >= targetAvailability && currentlyDown) {
    this.loggerService.alert({
      availability,
      time: now,
      website,
      type: AlertType.Recover
    });
  }
}
```

### Optimization

Fetched responses are being stored in-memory inside an array. To reduce the memory usage, cron job that runs every 30 minutes is implemented to delete the old responses from memory. A response is considered old if it was registered more than one hour ago (the time of displaying *long* statistics)

`src/Modules/response/response.service.ts`

```
@Cron(CronExpression.EVERY_30_MINUTES)
private deleteOldResponses() {
  const time = moment().subtract(this.configService.longDuration);

  this.responseRepository.clearBeforeTime(time);
}
```

Stats are calculated "on the go", analyzing the in-memory responses over certain interval. Since responses are **always** sorted by their registration time (because a new response is always pushed to the end of array), binary search is used to quickly find all responses over a certain interval

`src/Modules/response/response.repository.ts`

```
public getResponsesForInterval(interval: Interval): ResponseModel[] {
  const startIndex = this.getClosestResponseIndexToTime(interval.start);
  const endIndex = this.getClosestResponseIndexToTime(interval.end);

  return this.responses.slice(startIndex, endIndex);
}

private getClosestResponseIndexToTime(time: Moment): number {
  let [start, end] = [0, this.responses.length];

  while (start < end) {
    const mid = Math.floor((start + end) / 2);
    if (this.responses[mid].registeredAt === time) {
      return mid;
    } else if (this.responses[mid].registeredAt < time) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return start;
}
```

## Testing

## Further thoughts