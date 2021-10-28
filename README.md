# Websites Monitoring CLI App

An interactive shell that allows users to monitor websites' performance, gathering statistics 
about average response time, maximum responses time, availability and HTTP status codes count.

## Table of contents

* [Features](#features)
* [Tech stack](#tech-stack)
* [Installation](#installation)
  * [Prerequisites](#prerequisites)
  * [Setup](#setup)
* [Usage](#usage)
  * [Disclaimer](#disclaimer)
  * [Primary way](#primary-way)
  * [Examples](#examples)
  * [Alternative way](#alternative-way)
* [Interface](#interface)
* [Code examples](#code-examples)
  * [Periodic website fetching and statistics displaying](#periodic-website-fetching-and-statistics-displaying)
  * [Alerting logic](#alerting-logic)
  * [Optimization](#optimization)
* [Testing](#testing)
* [Further thoughts](#further-thoughts)

## Features
- Monitor websites using an interactive shell
- Observe the statistics for each website you add in a separate terminal popup window
- Send GET requests to a website over custom defined frequency
- Obtain useful statistics such as average response time, maximum responses time, availability of a given website and HTTP status codes count
- Get alert messages when website is down and when it has recovered

## Tech stack
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/) *- progressive Node.js framework*
- [Winston](https://github.com/winstonjs/winston) *- logger*
- [Boxen](https://github.com/sindresorhus/boxen) & [Chalk](https://github.com/chalk/chalk) *- console output formatting*
- [Moment.js](https://momentjs.com/) *- working with time*
- [Jest](https://jestjs.io/) *- unit testing*
- [ESLint](https://eslint.org/) *- code analysis*
- [Prettier](https://prettier.io/) *- code formatting*

## Installation

### Prerequisites
Make sure that [Node.js](https://nodejs.org/en/) and [Git](https://git-scm.com/) are installed on your operating system

### Setup
1) Install the application with **Git**:
```
$ git clone https://github.com/kamranpoladov/websites-monitoring.git
$ cd websites-monitoring
```
2) Install the dependencies with either **npm** or **Yarn**:
```
$ npm install
```

or

```
$ yarn install
```

## Usage

### Disclaimer
The application will try to open a new terminal window for each website you are trying to monitor. Even though it supports 3 main operating systems (Microsoft Windows, macOS, Linux), it doesn't support all kinds of terminals

**List of supported terminals:**
- Linux: GNOME Terminal
- macOS: default Terminal application
- Windows: default Command Prompt application (cmd.exe)

May you not have any of those installed, you still can run the application in [alternative way](#alternative-way) 

### Primary way
```
$ yarn start
```

or

```
$ npm start
```

An interactive shell will appear in your command line (wait to see `>` symbol)

Start using this shell to monitor different websites

#### Available commands
- `monitor <website> <interval>` - adds a new website (has to be a valid URL, adding protocol is optional but recommended) to be monitored over a specified interval (number in seconds, minimum is 3)
- `help` - lists all available commands
- `exit` - exits the application (this will not close any of the windows displaying stats for the websites you have already added)

### Examples

```
$ yarn start
> monitor datadoghq.com 5

Monitoring datadoghq.com!

> monitor invalid_website 6

   ┏ Validation failed ━┓
   ┃                    ┃
   ┃   Url is invalid   ┃
   ┃                    ┃
   ┃                    ┃
   ┗━━━━━━━━━━━━━━━━━━━━┛

> monitor localhost:3000 2

   ┏━━━━━━━━━━━━━━━━━━━━━━━━━ Validation failed ━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃                                                                     ┃
   ┃   Interval has to be a positive number greater than or equal to 3   ┃
   ┃                                                                     ┃
   ┃                                                                     ┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> monitor wrongusage
Wrong usage: monitor <website> <interval>
> help

   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Available commands ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃                                                                                        ┃
   ┃   monitor <website> <interval> - Starts monitoring a website with specified interval   ┃
   ┃   help  - Displays all commands with description and usage                             ┃
   ┃   exit  - Exits a program                                                              ┃
   ┃                                                                                        ┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> exit
Bye-bye!
```

### Alternative way

As mentioned, you still can use the application even if you don't have a supported terminal installed. This method will not automatically open a new terminal window for each website you are adding. Instead, you will have to use flags to monitor a website inside your current window. To add a new website, you will have to start the application again in another terminal instance

```
$ yarn start:manual [options]
```

or

```
$ npm run start:manual -- [options]
```

#### Required options

- `-w --website <website>` - define the website to be monitored. Has to be a valid URL, protocol is not required
- `-i --interval <interval>` - define the period (in seconds) of monitoring a website. Minimum 3 seconds

## Interface

### Statistics for past 10 minutes (displayed every 10 seconds)
```
   ┏━━━━━━━━━━━━━━━━━━━━━ https://datadoghq.com - SHORT STATS ━━━━━━━━━━━━━━━━━━━━━━┓
   ┃                                                                                ┃
   ┃   Displaying stats for https://datadoghq.com from 04:20:29 pm to 04:30:29 pm   ┃
   ┃                         Average response time: 351 ms                          ┃
   ┃                         Maximum response time: 534 ms                          ┃
   ┃                              Availability: 100%                                ┃
   ┃                            ╔════════╤═══════════╗                              ┃
   ┃                            ║ Status │ Frequency ║                              ┃
   ┃                            ╟────────┼───────────╢                              ┃
   ┃                            ║ 200    │ 114       ║                              ┃
   ┃                            ╚════════╧═══════════╝                              ┃
   ┃                                                                                ┃
   ┃                                                                                ┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Statistics for past hour (displayed every minute)
```
   ┏━━━━━━━━━━━━━━━━━━━━━ https://datadoghq.com - LONG STATS ━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃                                                                                ┃
   ┃   Displaying stats for https://datadoghq.com from 03:30:29 pm to 04:30:29 pm   ┃
   ┃                         Average response time: 452 ms                          ┃
   ┃                         Maximum response time: 673 ms                          ┃
   ┃                              Availability: 100%                                ┃
   ┃                            ╔════════╤═══════════╗                              ┃
   ┃                            ║ Status │ Frequency ║                              ┃
   ┃                            ╟────────┼───────────╢                              ┃
   ┃                            ║ 200    │ 712       ║                              ┃
   ┃                            ╚════════╧═══════════╝                              ┃
   ┃                                                                                ┃
   ┃                                                                                ┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Alerting when website is down for the past 2 minutes (i.e. availability is below 80%)
```
┏━━━━━━━━━━━━━━━ ALERT DOWN ━━━━━━━━━━━━━━━━┓
┃                                           ┃
┃   Website http://localhost:3000 is down   ┃
┃     Availability is 0% at 04:35:07 pm     ┃
┃                                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Alerting when website recovered (i.e. availability is more than 80%)
```
┏━━━━━━━━━━━━━━━ ALERT RECOVER ━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                      ┃
┃   Website http://localhost:3000 has recovered down   ┃
┃         Availability is 82% at 04:59:07 pm           ┃
┃                                                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```


## Code examples

### "Any fool can write code that a computer can understand. Good programmers write code that humans can understand" - Martin Fowler

Regardless of this famous quote, the implementations of the most important features of the application along with explanations can be found in this section

### Periodic website fetching and statistics displaying

`SchedulerService` is used to set up the jobs to be run periodically. It is based on `ScheduleModule` of `@nestjs/schedule` library but provides additional functionality such as optionally firing off the job function immediately and a callback to be run only once after a job starts

`src/Providers/scheduler/scheduler.service.ts`

```
public async addJob({
  name,
  period,
  job,
  callback,
  executeImmediately
}: AddJobDto) {
  await this.executeAndScheduleJob({
    name,
    job,
    period,
    executeImmediately
  });

  callback?.(); // execute callback if it was provided
}

private async executeAndScheduleJob({
  name,
  job,
  period,
  executeImmediately
}: Omit<AddJobDto, 'callback'>): Promise<void> {
  if (executeImmediately) await job();
  const interval = setInterval(job, period.asMilliseconds());
  this.schedulerRegistry.addInterval(name, interval);
}
```

`StatsService` consumes `SchedulerService` to set up periodic fetching of a website and logging of statistics for both *short* (every 10 seconds) and *long* (every minute) intervals. Note that the job for displaying for *short* stats starts only after the website has been fetched for the first time. This is done to handle the edge case of the very first request giving timeout error: if it takes a website too long to respond (i.e. longer than 10 seconds) for the first time, the statistics should not be displayed as we have no responses to analyze yet. Also, the displaying of *long* stats is delayed since for the first 10 minutes they are going to be the same as *short* stats 

`src/Modules/stats/stats.service.ts`

```
public async monitor({ website, interval }: AddWebsiteDto) {

  ...
  
  const startStatsShortJob = () =>
    this.schedulerService.addJob({
      name: DISPLAY_STATS_SHORT_JOB_KEY,
      period: this.appConfigService.shortInterval,
      job: async () =>
        this.displayStats({
          website,
          duration: this.appConfigService.shortDuration,
          statsType: StatsType.Short
        })
    });

  const startStatsLongJob = () =>
    this.schedulerService.addJob({
      name: DISPLAY_STATS_LONG_JOB_KEY,
      period: this.appConfigService.longInterval,
      job: async () =>
        this.displayStats({
          website,
          duration: this.appConfigService.longDuration,
          statsType: StatsType.Long
        }),
      executeImmediately: true
    });

  await this.schedulerService.addJob({
    name: FETCH_JOB_KEY,
    period: interval,
    job: () => this.fetchWebsite(website),
    callback: async () => {
      startStatsShortJob();
      setTimeout(
        () => startStatsLongJob(),
        this.appConfigService.shortDuration.asMilliseconds()
      );
    },
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
  
  return response;
}
```

`AlertService` listens to this event and consumes `ResponseService` to determine whether website is down or has recovered and displays according message in console via `LoggerService`

`src/Modules/alert/alert.service.ts`

```
@OnEvent(RegisterResponseEvent.eventName)
public onRegisterResponse({ website }: RegisterResponseEvent): void {
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

Unit tests are implemented to test alerting mechanism.

`alert-listener.spec.ts` ensures that events are correctly emitted and listened to in order to trigger alert

`alert-logic.spec.ts` ensures that `AlertService` correctly determines the type of alert to be triggered and whether it should be triggered at all

### Scripts

- `yarn test` - run all tests
- `yarn test:types` - run the test for TypeScript types compatability
- `yarn test:lint` - run ESLint code analysis test
- `yarn fix:lint` - fix ESLint errors
- `yarn test:prettier` - run Prettier code formatting test
- `yarn fix:prettier` - fix Prettier errors

## Further thoughts