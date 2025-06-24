# gtfs-react-hooks

React hooks for fetching data from gtfs sources.

## Usage

TODO: Describe.

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

Due to automatic version detection in our release process, **all commits to the master branch must follow
[conventional commits][conventional-commits] formatting.** Pay close attention to this when squashing your PRs and
setting your commit messages on the main branch.

### Release

Releases are (mostly) automated using [semantic-release][semantic-release]. It can be run using the `cd/release` github
action, which has a manual `workflow_dispatch` trigger.

Again, **All commits to the master branch must follow [conventional commits][conventional-commits] format.** Verify
that all commits since the last release adhere to the standard before triggering a release.

## Contributing

Bug reports and pull requests are welcome on [GitHub][github].

## License

The application is available as open source under the terms of the [MIT License](license).

[conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0/#summary
[github]: https://github.com/umts/gtfs-react-hooks
[license]: https://opensource.org/licenses/MIT
[nodejs]: https://nodejs.org
[nodenv]: https://github.com/nodenv/nodenv
[npm]: https://www.npmjs.com
[semantic-release]: https://github.com/semantic-release/semantic-release
[vite]: https://vitejs.dev
