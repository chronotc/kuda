# pit
Simple deployment tool for monorepo

- pit `init` generates pit.json to store registered services and prompts for s3 bucket to store state.
- pit `add` adds a service to pit.json (folder must sit directly under root for the time being)
- pit `add` also writes to service's package.json (throws error if not found). Adds a pit property to package.json
- pit `deploy` will run tasks for services defined in `pit.json` serially providing that the remoteState has a lower version.

package.json
```
version: 0.0.1,
pit: {
  tasks: [
    {
      name: '',
      command: ''
    }
  ]
}
```

pit.json
```
  services: [
    {
      name: 'foo'
    },
    {
      name: 'bar'
    }
  ],
  remoteState: s3://blah/{ENV}/pitstate
```
This will run task(s) for foo and then task(s) for bar.

remoteState
```
services: {
  foo: {
    deployedVersion: '0.0.0'
  },
  bar: {
    deployedVersion: null
  }
}
```
