import neostandard from 'neostandard'

export default [
  { ignores: ['dist/*', 'coverage/*'] },
  ...neostandard({ env: ['browser'] }),
]
