# RedSky Core Utilities

A number of core utilities functions presented in Pure Static Classes that can be easily tree-shaken. This does not include any
utility methods that are specific to front-end of backend. Such as database routines or web browser utilities. Those are best left
in projects or a different library

## Usage

Simply install this node module directly from npmjs.com and start importing method you need.

`pnpm add -D @redskytech/core-utils`

Then import

```typescript
import { StringUtils, ObjectUtils, DateUtils } from '@redskytech/core-utils';

// Use utility below
StringUtils.capitalizeFirst('jim bob');
```

## Dependencies

The one dependency that this project does bring in is lodash.clonedeep(). We have not yet been able to write a better algorithm for cloning a JSON object that might have all sorts of weird nested stuff.

## Building

To build run the following command

`pnpm build`

This will generate both commonjs modules and es modules in the lib folder under main and module respectively.

## Publishing

**_FIRST: Make sure your build is working and you have committed all your changes to master and pushed them up to remote._**

You need to be a member of the @redskytech organization with publishing capability. Then you need to run the
following command:

`pnpm release:xxx` - where xxx is either (major, minor, patch, pre:alpha)

This uses the npm package standard-version which will automatically increment the package.json version
as well as git tag the commit and put all commit notes into the CHANGELOG.md

Push up the changes and tags to master branch on remote, make sure to include tags

`git push --follow-tags origin master`

Finally, publish to npmjs.com with the command

`pnpm build:publish`

## Commit Messages

Commit messages should follow guidelines specified at [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).
This helps with auto changelog generated file.
