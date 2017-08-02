# kuda
Simple deployment tool for monorepo

- kuda `init` generates kuda.json to store registered services and prompts for s3 bucket to store state.
- kuda `add` adds a service to kuda.json (folder must sit directly under root for the time being)
- kuda `add` also writes to service's package.json (throws error if not found). Adds a kuda property to package.json
- kuda `deploy` will run tasks for services defined in `kuda.json` serially providing that the remoteState has a lower version.

package.json
```
version: 0.0.1,
kuda: {
  tasks: [
    {
      name: '',
      command: ''
    }
  ]
}
```

kuda.json
```
  services: [
    {
      name: 'foo'
    },
    {
      name: 'bar'
    }
  ],
  remoteState: s3://blah/{ENV}/kudastate
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
