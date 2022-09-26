# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.0.0](https://github.com/baetheus/datum/compare/v3.5.0...v4.0.0) (2022-02-04)


### ⚠ BREAKING CHANGES

* This commit removes and replaces existing apis
Co-authored-by: Sam Protas <sprotas@50onred.com>

### Features

* remove mega instances and old ap ([#21](https://github.com/baetheus/datum/issues/21)) ([00d934d](https://github.com/baetheus/datum/commit/00d934d9d26f601819d44e17f0b8d4a26ade4fc6))


### Bug Fixes

* only depend on fp-ts/es6 ([#37](https://github.com/baetheus/datum/issues/37)) ([9db343b](https://github.com/baetheus/datum/commit/9db343b4976100240026cfb32e9f6f15316db5ac))

## [3.5.0](https://github.com/baetheus/datum/compare/v3.4.0...v3.5.0) (2021-04-01)


### Features

* deprecate ap/chain disagreement and standalone instances ([#19](https://github.com/baetheus/datum/issues/19)) ([484d81d](https://github.com/baetheus/datum/commit/484d81d7a3845464ac41b03239a311aa32e1968d))
* implement initial DatumThese ADT ([#15](https://github.com/baetheus/datum/issues/15)) ([0ee8a3d](https://github.com/baetheus/datum/commit/0ee8a3d453d7bdf67a3197a920c53d0d9dd57731))

## [3.4.0](https://github.com/baetheus/datum/compare/v3.3.2...v3.4.0) (2021-02-06)


### Features

* add Valued type and fix docs ([2db2625](https://github.com/baetheus/datum/commit/2db2625df7566f7a58e1902c4915f274c1a234b6))

### [3.3.2](https://github.com/baetheus/datum/compare/v3.3.1...v3.3.2) (2021-02-05)


### Bug Fixes

* expand types on DatumEither constructors ([472c7ae](https://github.com/baetheus/datum/commit/472c7aebf53379f648040df0f95ec7d42d276b88)), closes [#12](https://github.com/baetheus/datum/issues/12)

### [3.3.1](https://github.com/baetheus/datum/compare/v3.3.0...v3.3.1) (2021-02-02)


### Bug Fixes

* correct type for fromOption ([b10a388](https://github.com/baetheus/datum/commit/b10a3881d4c61002fadf5c0a40bb87e96eb20f4b)), closes [#11](https://github.com/baetheus/datum/issues/11)

## [3.3.0](https://github.com/baetheus/datum/compare/v3.2.0...v3.3.0) (2020-11-13)


### Features

* implement experimental OneShot adt based on Datum ([6c47f40](https://github.com/baetheus/datum/commit/6c47f400e0153698aeccaf7a4ceca5caee7f2a86))

## [3.2.0](https://github.com/baetheus/datum/compare/v3.1.0...v3.2.0) (2020-10-15)


### Features

* export sequenceTuple and sequenceStruct ([968aa84](https://github.com/baetheus/datum/commit/968aa84e7d2aebfe526db2f23e96b03fc96628c3))

## [3.1.0](https://github.com/baetheus/datum/compare/v3.0.1...v3.1.0) (2020-05-05)


### Features

* Re-export modules from a main index file ([263644f](https://github.com/baetheus/datum/commit/263644f1f9284e5f9712409a38afe66c0f419e73))

### [3.0.3](https://github.com/baetheus/datum/compare/v3.0.1...v3.0.3) (2020-03-11)

### [3.0.2](https://github.com/baetheus/datum/compare/v3.0.1...v3.0.2) (2020-03-11)

### [3.0.1](https://github.com/baetheus/datum/compare/v3.0.0...v3.0.1) (2020-03-07)


### Bug Fixes

* cleaned up testing config ([a8f48fc](https://github.com/baetheus/datum/commit/a8f48fcf347202d09d8ec402e57aaf07af25d183))
* moved prepare script and update build ([6f2bbcd](https://github.com/baetheus/datum/commit/6f2bbcd2e8ba05c871391da90fe7acc07af0f9bf))

## [3.0.0](https://github.com/baetheus/datum/compare/v3.0.0-prerelease.0...v3.0.0) (2020-03-06)


### Bug Fixes

* fix coveralls command in nodejs workflow ([26d656b](https://github.com/baetheus/datum/commit/26d656b92fe13674405a0f8d52de0ac59c82b817))
* fix env vars for coveralls ([4beec9c](https://github.com/baetheus/datum/commit/4beec9c4acdf8b91b8465e5ce27c274ce8e4315f))
* try using the coveralls action ([95a6661](https://github.com/baetheus/datum/commit/95a6661971c6f114f8c5257cde19921731eabff2))

## [3.0.0-prerelease.0](https://github.com/baetheus/datum/compare/v2.7.2-prerelease.0...v3.0.0-prerelease.0) (2020-03-06)


### ⚠ BREAKING CHANGES

* simplified api

### Features

* migrate to es6 only build ([3d65d65](https://github.com/baetheus/datum/commit/3d65d650c81ce718bc7c6ce5669cd99df0adf942))

### [2.7.2-prerelease.0](https://github.com/baetheus/datum/compare/v2.7.1...v2.7.2-prerelease.0) (2020-03-06)

### [2.7.1](https://github.com/baetheus/datum/compare/v2.7.0...v2.7.1) (2020-01-29)


### Bug Fixes

* added since tags to modules for documentation ([6aa72d0](https://github.com/baetheus/datum/commit/6aa72d0c0dbfb647cd485d3051ba278156c098d2))
* bumped deps, refactored constants, cleaned up tests ([68ad17e](https://github.com/baetheus/datum/commit/68ad17ea2d40e87d4ed4e4fb94cee93a587329aa))

## [2.7.0](https://github.com/baetheus/datum/compare/v2.6.3...v2.7.0) (2019-09-17)


### Features

* added DatumEither features ([8a71a40](https://github.com/baetheus/datum/commit/8a71a40))

### [2.6.3](https://github.com/baetheus/datum/compare/v2.6.2...v2.6.3) (2019-09-16)

### [2.6.2](https://github.com/baetheus/datum/compare/v2.6.1...v2.6.2) (2019-09-12)


### Bug Fixes

* added source to package.json files so sourcemaps work ([a081616](https://github.com/baetheus/datum/commit/a081616))

### [2.6.1](https://github.com/baetheus/datum/compare/v2.6.0...v2.6.1) (2019-08-29)

# [2.6.0](https://github.com/baetheus/datum/compare/v2.5.1...v2.6.0) (2019-08-26)


### Features

* added additional pipeable Datum operators that were missed ([ae71d30](https://github.com/baetheus/datum/commit/ae71d30))



## [2.5.1](https://github.com/baetheus/datum/compare/v2.5.0...v2.5.1) (2019-08-22)


### Bug Fixes

* removed refershFoldR hangover from initial work ([2922490](https://github.com/baetheus/datum/commit/2922490))



# [2.5.0](https://github.com/baetheus/datum/compare/v2.4.0...v2.5.0) (2019-08-22)


### Features

* added better typing to exports of initial and pending from DatumEither ([2b95784](https://github.com/baetheus/datum/commit/2b95784))



# [2.4.0](https://github.com/baetheus/datum/compare/v2.3.0...v2.4.0) (2019-08-20)


### Bug Fixes

* various fixes to Datum to pass tests ([4769c24](https://github.com/baetheus/datum/commit/4769c24))


### Features

* add fromNullable for DatumEither ([c3d2f21](https://github.com/baetheus/datum/commit/c3d2f21))



## [2.3.1](https://github.com/baetheus/datum/compare/v2.3.0...v2.3.1) (2019-08-20)


### Bug Fixes

* various fixes to Datum to pass tests ([4769c24](https://github.com/baetheus/datum/commit/4769c24))



# [2.3.0](https://github.com/baetheus/datum/compare/v2.2.1...v2.3.0) (2019-08-16)


### Features

* additions to DatumEither ([e7e2e7a](https://github.com/baetheus/datum/commit/e7e2e7a))



## [2.2.1](https://github.com/baetheus/datum/compare/v2.2.0...v2.2.1) (2019-08-14)



# [2.2.0](https://github.com/baetheus/datum/compare/v2.1.0...v2.2.0) (2019-08-14)


### Features

* fromEither and fromOption for DatumEither ([7a24d63](https://github.com/baetheus/datum/commit/7a24d63))



# [2.1.0](https://github.com/baetheus/datum/compare/v2.0.2...v2.1.0) (2019-08-14)


### Features

* added more documentation and helper functions ([91de033](https://github.com/baetheus/datum/commit/91de033))



## [2.0.2](https://github.com/baetheus/datum/compare/v2.0.1...v2.0.2) (2019-08-14)



## [2.0.1](https://github.com/baetheus/datum/compare/v2.0.0...v2.0.1) (2019-08-14)



# 2.0.0 (2019-08-13)


### Features

* initial commit ([b711f2a](https://github.com/baetheus/datum/commit/b711f2a))
