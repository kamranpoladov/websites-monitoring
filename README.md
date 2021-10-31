# Websites Monitoring CLI App

An interactive shell that allows users to monitor websites' performance, gathering statistics
about average response time, maximum responses time, availability and HTTP status codes count.

## Table of contents

- [Websites Monitoring CLI App](#websites-monitoring-cli-app)
  - [Table of contents](#table-of-contents)
  - [Features](#features)
  - [Tech stack](#tech-stack)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
  - [Usage](#usage)
    - [Starting the application](#starting-the-application)
    - [Examples](#examples)
  - [Interface](#interface)
  - [Code examples](#code-examples)
    - [Periodic website fetching and statistics displaying](#periodic-website-fetching-and-statistics-displaying)
    - [Alerting logic](#alerting-logic)
    - [Optimization](#optimization)
  - [Testing](#testing)
  - [Further thoughts](#further-thoughts)

## Features

- Monitor websites using an interactive shell
- Observe the statistics for all the websites you add in a single updating terminal window
- Send GET requests to a website over custom defined frequency
- Obtain useful statistics such as average response time, maximum responses time, availability of a given website and HTTP status codes count
- Get alert messages when website is down and when it has recovered

## Tech stack

- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/) _- progressive Node.js framework_
- [Vorpal](https://vorpal.js.org/) _- uninterrupted user input_
- [Winston](https://github.com/winstonjs/winston) _- logger_
- [Boxen](https://github.com/sindresorhus/boxen) & [Table](https://github.com/gajus/table) _- console output formatting_
- [Moment.js](https://momentjs.com/) _- working with time_
- [Jest](https://jestjs.io/) _- unit testing_
- [ESLint](https://eslint.org/) _- code analysis_
- [Prettier](https://prettier.io/) _- code formatting_

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) - version `16.13.0` is recommended, at least `12.22.7` is required
- [Git](https://git-scm.com/) - not required if you download project as a zip file

### Setup

1. Install the application with **Git**:

```
$ git clone https://github.com/kamranpoladov/websites-monitoring.git
$ cd websites-monitoring
```

2. Copy the contents of `.env.dist` file into `.env` file located in the root of the project directory either manually or with one of the commands below:

**Linux or macOS:**

```
$ cp .env.dist .env
```

**Windows:**

```
$ copy .env.dist .env
```

Feel free to adjust the configurations inside `.env` to change intervals, durations, etc.

3. Install the dependencies with **npm**:

```
$ npm install
```

4. Build the project:

```
$ npm run build
```

## Usage

### Disclaimer

It is strongly recommended using the application in full-screen mode since the statistics for all the websites added are displayed in a single window. Because of the non-responsive nature of terminal, changing the width and height parameters may lead to disturbed output.

### Starting the application

```
$ npm start
```

You can also alternatively start application in dev mode in order to skip `npm run build` stage every time code is changed using

```
$ npm run start:dev
```

An interactive shell will appear in your command line (wait to see `>` symbol)

Start using this shell to monitor different websites

#### Available commands

- `monitor <website> <interval>` - adds a new website (has to be a valid, unique in the scope of application URL, adding protocol is optional but recommended) to be monitored over a specified interval (number in seconds, minimum is 3)
- `help` - lists all available commands
- `exit` - exits the application (this will not close any of the windows displaying stats for the websites you have already added)

### Examples

```
$ npm start
> monitor datadoghq.com 5

> monitor invalid_website 6

   ┏ Validation failed ━┓
   ┃                    ┃
   ┃   Url is invalid   ┃
   ┃                    ┃
   ┗━━━━━━━━━━━━━━━━━━━━┛

> monitor localhost:3000 2

   ┏━━━━━━━━━━━━━━━━━━━━━━━━━ Validation failed ━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃                                                                     ┃
   ┃   Interval has to be a positive number greater than or equal to 3   ┃
   ┃                                                                     ┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## Interface

Interface represents a table with all the websites added during program uptime. Stats are updated automatically as program is running. You can add more websites to be monitored using the commands above while viewing this table. However, please note that the height of this table is limited to the size of your terminal window. Therefore, it is not recommended adding too many websites in a single instance of program (more details on "why" in [further thoughts](#further-thoughts))

```                                             
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                   STATS FOR ALL WEBSITES                                                                                   ║
╟───────────────────────┬────────┬─────────────┬─────────────┬──────────────┬───────────────────────┬───────────────────┬───────────────────┬────────────────────────────────────────────────╢
║ Website               │ Period │ From        │ To          │ Availability │ Average response time │ Max response time │ Http status count │ Alerts                                         ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║ http://google.com     │ Short  │ 06:25:48 pm │ 06:35:47 pm │ 100%         │ 205 ms                │ 635 ms            │ 200 => 120        │                                                ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║                       │ Long   │ 05:45:17 pm │ 06:35:17 pm │ 100%         │ 207 ms                │ 1227 ms           │ 200 => 600        │                                                ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║ http://facebook.com   │ Short  │ 06:25:44 pm │ 06:35:41 pm │ 100%         │ 687 ms                │ 1641 ms           │ 200 => 150        │                                                ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║                       │ Long   │ 05:45:31 pm │ 06:35:31 pm │ 100%         │ 695 ms                │ 2763 ms           │ 200 => 750        │                                                ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║ http://localhost:3000 │ Short  │ 06:25:45 pm │ 06:35:45 pm │ 75%          │ 3 ms                  │ 17 ms             │ 200 => 112        │ Went down with availability 71% at 05:46:49 pm ║
║                       │        │             │             │              │                       │                   │ 400 => 36         │ Recovered with availability 81% at 06:03:33 pm ║
║                       │        │             │             │              │                       │                   │ 502 => 2          │ Went down with availability 79% at 06:33:37 pm ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║                       │ Long   │ 05:45:45 pm │ 06:35:45 pm │ 64%          │ 2 ms                  │ 17 ms             │ 200 => 481        │                                                ║
║                       │        │             │             │              │                       │                   │ 400 => 36         │                                                ║
║                       │        │             │             │              │                       │                   │ 502 => 233        │                                                ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║ http://localhost:3001 │ Short  │ 06:25:43 pm │ 06:35:43 pm │ 0%           │ 1 ms                  │ 4 ms              │ 502 => 120        │ Went down with availability 0% at 05:45:53 pm  ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║                       │ Long   │ 05:45:53 pm │ 06:34:53 pm │ 0%           │ 1 ms                  │ 22 ms             │ 502 => 588        │                                                ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║ http://youtube.com    │ Short  │ 06:25:44 pm │ 06:35:44 pm │ 100%         │ 647 ms                │ 5100 ms           │ 200 => 120        │                                                ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║                       │ Long   │ 05:46:04 pm │ 06:35:04 pm │ 100%         │ 624 ms                │ 5100 ms           │ 200 => 588        │                                                ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║ http://github.com     │ Short  │ 06:25:44 pm │ 06:35:40 pm │ 100%         │ 318 ms                │ 907 ms            │ 200 => 86         │                                                ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║                       │ Long   │ 05:46:10 pm │ 06:35:10 pm │ 100%         │ 361 ms                │ 5262 ms           │ 200 => 420        │                                                ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║ http://localhost:3010 │ Short  │ 06:25:41 pm │ 06:35:41 pm │ 0%           │ 1 ms                  │ 4 ms              │ 502 => 120        │ Went down with availability 0% at 05:47:21 pm  ║
╟───────────────────────┼────────┼─────────────┼─────────────┼──────────────┼───────────────────────┼───────────────────┼───────────────────┼────────────────────────────────────────────────╢
║                       │ Long   │ 05:47:21 pm │ 06:35:21 pm │ 0%           │ 8868 ms               │ 30015 ms          │ 408 => 167        │                                                ║
║                       │        │             │             │              │                       │                   │ 500 => 6          │                                                ║
║                       │        │             │             │              │                       │                   │ 502 => 403        │                                                ║
╚═══════════════════════╧════════╧═════════════╧═════════════╧══════════════╧═══════════════════════╧═══════════════════╧═══════════════════╧════════════════════════════════════════════════╝

> monitor anotherwebsite.com 4
```

## Code examples

### "Any fool can write code that a computer can understand. Good programmers write code that humans can understand" - Martin Fowler

Regardless of this famous quote, the implementations of the most important features of the application along with explanations can be found in this section

### Periodic website fetching and statistics displaying

`SchedulerService` is used to set up the jobs to be run periodically. It is based on `ScheduleModule` of `@nestjs/schedule` library but provides additional functionality such as optionally firing off the job function immediately and two types of callbacks to be run only once after or before a job starts

`src/Providers/scheduler/scheduler.service.ts`

```
public async addJob({
  name,
  period,
  job,
  afterStart,
  executeImmediately,
  beforeStart
}: AddJobDto) {
  await beforeStart?.(); // execute beforeStart callback if it was provided

  await this.executeAndScheduleJob({
    name,
    job,
    period,
    executeImmediately
  });

  afterStart?.(); // execute afterStart callback if it was provided
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

`StatsService` consumes `SchedulerService` to set up periodic fetching of a website and logging of statistics for both _short_ (every 10 seconds) and _long_ (every minute) intervals. Note that the job for displaying for _short_ stats starts only after the website has been fetched for the first time. This is done to handle the edge case of the very first request giving timeout error: if it takes a website too long to respond (i.e. longer than 10 seconds) for the first time, the statistics should not be displayed as we have no responses to analyze yet. Also, the displaying of _long_ stats is delayed since for the first 10 minutes they are going to be the same as _short_ stats.

Method below listens to the events emitted each time a new website is added (see `src/Modules/shell/shell.service.ts`)

`src/Modules/stats/stats.service.ts`

```
@OnEvent(MonitorWebsiteEvent.eventName)
public async monitor({ website, interval }: MonitorWebsiteEvent) {
  const startStatsShortJob = () =>
    this.schedulerService.addJob({
      name: `${website}#${DISPLAY_STATS_SHORT_JOB_KEY}`,
      period: this.appConfigService.shortInterval,
      job: async () =>
        this.updateStats(
          website,
          this.appConfigService.shortDuration,
          StatsType.Short
        ),
      executeImmediately: true
    });

  const startStatsLongJob = () =>
    this.schedulerService.addJob({
      name: `${website}#${DISPLAY_STATS_LONG_JOB_KEY}`,
      period: this.appConfigService.longInterval,
      job: async () =>
        this.updateStats(
          website,
          this.appConfigService.longDuration,
          StatsType.Long
        ),
      executeImmediately: true
    });

  await this.schedulerService.addJob({
    name: `${website}#${FETCH_JOB_KEY}`,
    period: interval,
    job: () => this.fetchWebsite(website),
    afterStart: async () => {
      startStatsShortJob();
      setTimeout(
        () => startStatsLongJob(),
        this.appConfigService.shortDuration.asMilliseconds()
      );
    },
    beforeStart: async () =>
      this.statsRepository.initializeEmptyStats(website), // create new stats instance before fetching every website
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

`AlertService` listens to this event and consumes `ResponseService` to determine whether website is down or has recovered and adds according `AlertModel` entity to the `StatsRepository`. Therefore, all alerts are stored per each website in a unified storage inside `StatsRepository` 

`src/Modules/alert/alert.service.ts`

```
@OnEvent(RegisterResponseEvent.eventName, { async: true, nextTick: true })
public onRegisterResponse({ website }: RegisterResponseEvent): void {
  const start = moment().subtract(this.appConfigService.downCheckDuration);
  const now = moment();
  const interval = new Interval({ start, end: now });

  const availability = this.responseService.getAvailability(
    website,
    interval
  );
  const targetAvailability = this.appConfigService.alertAvailability;
  const currentlyDown = this.alertRepository.getIsDown(website);

  this.alertRepository.setIsDown(website, availability < targetAvailability);

  if (availability < targetAvailability && !currentlyDown) {
    this.statsRepository.addAlertForWebsite(website, {
      time: now,
      availability,
      type: AlertType.Down
    });
  } else if (availability >= targetAvailability && currentlyDown) {
    this.statsRepository.addAlertForWebsite(website, {
      time: now,
      availability,
      type: AlertType.Recover
    });
  }
}
```

### Optimization

Fetched responses are being stored in-memory inside an array. To reduce the memory usage, cron job that runs every 30 minutes is implemented to delete the old responses from memory. A response is considered old if it was registered more than one hour ago (the time of displaying _long_ statistics)

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
public getResponsesForWebsitePerInterval(
  website: string,
  interval: Interval
): ResponseModel[] {
  return this.getResponsesForInterval(interval).filter(
    response => response.website === website
  );
}

private getResponsesForInterval(interval: Interval): ResponseModel[] {
  const startIndex = this.getClosestResponseIndexToTime(interval.start);
  const endIndex = this.getClosestResponseIndexToTime(interval.end);

  return this.responses.slice(startIndex, endIndex);
}

// since responses are always sorted by registeredAt, use binary search for quicker find operations
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

- `npm run test` - run all tests
- `npm run test:types` - run the test for TypeScript types compatability
- `npm run test:lint` - run ESLint code analysis test
- `npm run fix:lint` - fix ESLint errors
- `npm run test:prettier` - run Prettier code formatting test
- `npm run fix:prettier` - fix Prettier errors

## Further thoughts

The application is refreshing data inside terminal window every time stats for any of the websites should update. Even though user input is being preserved between inputs, the outputs for invalid inputs will be cleared as soon as window is refreshed. This rather happens because of the nature of Node.js console.

Additionally, as mentioned in [interface](#interface) section, it is not recommended adding too many websites per single program instance (i.e. more than your terminal viewport can handle). Doing so may result into disturbed display of the statistics that is left outside your terminal viewport. Console is being cleared every time stats need to update for any of the websites and new, updated stats are being drawn, therefore, it is very inconvenient to scroll to the stats that are outside the viewport. Nevertheless, all of these stats are being preserved and user can easily see them by scrolling after shutting down the application.

Because of the issues described above, perhaps, web application would be a better solution for such problem. It is way easier to selectively update information on the web page using a library like React and instead of clearing the whole page every time stats need to update, it is better to send server-sent events (SSE) and make React client-side listen to them and update stats accordingly.

One of the possible design improvements would be to separate the storage of alerts and statistics and "join" them with some unique common key (e.g. website). In SQL database context, for example, we would "left join" alerts inside `StatsRepository` in order to obtain full stats per website, instead of keeping alerts and stats together. 

