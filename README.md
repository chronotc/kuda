# kuda
Simple deployment tool for monorepo

- kuda `deploy` will run tasks for services defined in `kuda.json` serially providing that the remoteState has a lower version.

## Commands

### init

This is run at the root of the repository to initialize kuda.
You will be asked to select a service (folder) you wish to have managed under kuda.

```
kuda init
```

### add

Once a repository is initialized, a `kuda.json` will be generated in the root of the repository.
You can continue adding services using the add command or alternatively, update `kuda.json` or `package.json` to reflect the changes you want.

```
kuda add
```

### deploy

This command will attempt to run all the tasks for each service defined in `kuda.json`. Once all tasks have completed successfully, the `remoteState` is updated.

The `localVersion` (derived from `package.json`) and the `remoteVersion` are compared before deployment. If the `remoteVersion` is up to date, no action will be taken.

Thus, in order to trigger tasks to run, the user is required to increment the `version` inside `<service>/package.json`

```
KUDA_ENV=staging kuda deploy
```

## Typical folder structure
```
monorepo
├── foo
│   └── package.json
├── bar
│   └── package.json
├── unmanagedFolder1
├── unmanagedFolder2
├── kuda.json
```

## kuda.json
```
  services: [
    {
      name: 'foo'
    },
    {
      name: 'bar'
    }
  ],
  remoteState: s3://monorepo/{KUDA_ENV}/kudastate
```
This will run task(s) for foo and then task(s) for bar.

## foo/package.json
```
name: 'foo'
version: 0.0.1,
kuda: {
  tasks: [
    {
      name: 'foo',
      command: 'echo {SOME_ENV}'
    },
    {
      name: 'bar',
      command: 'cat file.json stuff.json'
    }
  ]
}
```

## remoteState
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
