# gtfs-react-hooks

React hooks for fetching data from gtfs sources.

## Usage

There are two hooks which this package provides. `useGtfsSchedule` and `useGtfsRealtime`. Both take two arguments, a resolver and a timeout.

The resolver must be an async function which takes no arguments and returns a `Uint8Array` containing the raw data for the hook to process.
For the schedule hook, this should be the raw zip data coming from your GTFS Schedule endpoint.
For the realtime hook, this should be the protobuf binary data from your GFTS Realtime Alerts endpoint.

The timeout defines how often the resolver will be called to fetch new data. This should be defined in milliseconds.

The following is suitable for most purposes:
```js
const fetchGtfsSchedule = useCallback(async () => {
  const response = await fetch(gtfsScheduleUrl)
  return new Uint8Array(await response.arrayBuffer())
}, [gtfsScheduleUrl])

const gtfsSchedule = useGtfsSchedule(fetchGtfsSchedule, 1000 * 60 * 60 * 24)

const fetchGtfsRealtimeAlerts = useCallback(async () => {
  const response = await fetch(gtfsRealtimeAlertsUrl)
  return new Uint8Array(await response.arrayBuffer())
}, [gtfsRealtimeAlertsUrl])

const gtfsRealtimeAlerts = useGtfsRealtime(fetchGtfsRealtimeAlerts, 1000 * 30)
```

The object returned by the GTFS Schedule hook follows the [GTFS Schedule Standard][gtfs-schedule-standard]'s structure, except for all field/attribute names being camel cased. Note that our implementation
operates without checking if the standard is being met. Thus any other files in the zip will be parsed as a CSV and added to the returned object.

The GTFS Realtime Alerts hook is a thin wrapper around the [GTFS Realtime Language Bindings for Node][gtfs-realtime-node], which follows the [GTFS Realtime Standard][gtfs-realtime-standard]'s structure,
but camel cases all field/attribute names.

If either of the hooks encounters an error during resolving or parsing, they will return `null`.

## Contributing

Bug reports and pull requests are welcome on [GitHub][github].

Due to automatic version detection in our release process, **all commits to the master branch must follow
[conventional commits][conventional-commits] formatting.** Pay close attention to this when squashing your PRs and
setting your commit messages on the main branch.

## Development

The library is built using [vite][vite]/[node.js][nodejs]. It is recommended that you use
[nodenv][nodenv] to manage local node installations.

### Requirements

- node.js matching the version in the `.node-version` file (just run `nodenv install` if using nodenv)

### Setup

```sh
npm install # bundle dependencies
```

### Scripts

```sh
npm run build    # builds the library.
npm run lint     # runs the js linter.
npm run test     # runs the test suite.
```

## Release

Releases are (mostly) automated using [semantic-release][semantic-release]. It can be run using the `cd/release` github
action, which has a manual `workflow_dispatch` trigger.

Again, **all commits to the master branch must follow [conventional commits][conventional-commits] format.** Verify
that all commits since the last release adhere to the standard before triggering a release.

## License

The application is available as open source under the terms of the [MIT License](license).

[conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0/#summary
[github]: https://github.com/umts/gtfs-react-hooks
[gtfs-realtime-node]: https://gtfs.org/documentation/realtime/language-bindings/nodejs/
[gtfs-realtime-standard]: https://gtfs.org/documentation/realtime/reference/
[gtfs-schedule-standard]: https://gtfs.org/documentation/schedule/reference/
[license]: https://opensource.org/licenses/MIT
[nodejs]: https://nodejs.org
[nodenv]: https://github.com/nodenv/nodenv
[npm]: https://www.npmjs.com
[semantic-release]: https://github.com/semantic-release/semantic-release
[vite]: https://vitejs.dev
