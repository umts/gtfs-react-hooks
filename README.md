# gtfs-react-hooks

React hooks for fetching data from gtfs sources.

## Usage

The two main hooks provided by this library (`useGtfsSchedule` and `useGtfsRealtime`) handle parsing
and periodic refreshing of [GTFS Schedule][gtfs-schedule-standard] and [GTFS Realtime][gtfs-realtime-standard] data.

The [GTFS Realtime Language Bindings for Node][gtfs-realtime-node] are used for parsing GTFS Realtime data
and its types are relevant when using the `useGtfsRealtime` hook.

Note that due to dependency constraints, this library must be processed by a bundler such as [vite][vite].

### API

```javascript
/**
 * A resolver callback retrieves and returns raw GTFS data. This type of callback is used as an argument for the two
 * GTFS hooks offered by this library.
 *
 * It may be asynchronous and *must* return either a Uint8Array (when data is successfully retrieved) or undefined
 * (when data is not successfully retrieved). Any error handling must happen internally.
 *
 * @callback Resolver
 * @return {Uint8Array|undefined|Promise<Uint8Array|undefined>}
 */

/**
 * A hook that resolves, parses and periodically refreshes GTFS Schedule data.
 *
 * The data is unzipped and its entries are parsed as CSV files internally. File names and properties are converted
 * from snake_case to camelCase (see the standard for structure).
 * 
 * Individual files are parsed asynchronously, and may be updated/made available at different times. Be careful to guard
 * against this when accessing your data.
 *
 * @example
 *
 *    const scheduleData = useGtfsSchedule(yourResolver, 10000)
 * 
 *    scheduleData?.routes.each(...)  // improper
 *    scheduleData?.routes?.each(...) // proper
 *
 * @param {Resolver} resolve - a resolver that returns raw zipped gtfs schedule data.
 * @param {Number} timeout - the time in ms between periodic refreshes.
 * @param {Number} [1000] retry - the time in ms to retry a refresh if the previous one failed.
 * @return {{}|undefined} parsed data if resolved, undefined if not.
 */
export function useGtfsSchedule (resolve, timeout) { }

/**
 * A hook that resolves, parses and periodically refreshes GTFS Realtime data.
 *
 * The data is parsed using the gtfs-realtime-bindings library and is returned in the form of a FeedMessage object
 * (see the standard for structure).
 *
 * @param {Resolver} resolve - a resolver that returns raw gtfs-rt protobuf data.
 * @param {Number} timeout - the time in ms between periodic refreshes.
 * @param {Number} [1000] retry - the time in ms to retry a refresh if the previous one failed.
 * @return {FeedMessage|undefined} parsed data if resolved, undefined if not.
 */
export function useGtfsRealtime (resolve, timeout) { }

/**
 * A convenience hook that creates a simple GTFS data resolver using the fetch API.
 *
 * It will send simple GET requests to the given url. If the response status is OK, it will
 * return the raw response body as a Uint8Array.
 *
 * If any errors occur or if the response status is not OK, it will return undefined.
 * 
 * If you need to use a different API for retrieving your data, use more advanced fetch options or add side effects
 * when errors occur, it is reccommended that you write your own resolver.
 *
 * @param {string} url - the url to send requests to.
 * @return {Resolver} a simple fetch resolver.
 */
export function useFetchResolver (url) { }
```

### Examples

```javascript
import { useFetchResolver, useGtfsRealtime, useGtfsSchedule } from 'gtfs-react-hooks'
import { useCallback } from 'react'

export default function MyComponent() {
  // gtfs schedule data
  const scheduleResolver = useFetchResolver('https://your-domain.com/gtfs_schedule.zip')
  const gtfsSchedule = useGtfsSchedule(scheduleResolver, 1000 * 60 * 60 * 24)

  // gtfs realtime data
  const realtimeAlertsResolver = useFetchResolver('https://your-domain.com/gtfs-realtime-alerts')
  const gtfsRealtimeAlerts = useGtfsRealtime(realtimeAlertsResolver, 1000 * 30)
  
  // ...
}
```

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
