# astro-resend-router

## 2.1.2

### Patch Changes

- [`84baa2e`](https://github.com/tmykkanen/astro-resend-router/commit/84baa2eddc8dd6294ee125e6958e92435f32d206) Thanks [@tmykkanen](https://github.com/tmykkanen)! - moved vite to devDependencies

## 2.1.1

### Patch Changes

- [`0cbf2d3`](https://github.com/tmykkanen/astro-resend-router/commit/0cbf2d3c30ca1ba1d9efcdb802d9581370204914) Thanks [@tmykkanen](https://github.com/tmykkanen)! - fixed optional config options accidentally being required in ts

## 2.1.0

### Minor Changes

- [`1d86e79`](https://github.com/tmykkanen/astro-resend-router/commit/1d86e7934edd1aa31b42db974137dc0cf3ab2a57) Thanks [@tmykkanen](https://github.com/tmykkanen)! - Added support for better mailchimp forwarding
  - use cheerio to strip mailchimp header and footer, since we'll use
    Resend unsubscribe links

## 2.0.0

### Major Changes

- [#12](https://github.com/tmykkanen/astro-resend-router/pull/12) [`55eb639`](https://github.com/tmykkanen/astro-resend-router/commit/55eb639bd8e13b155214b9599847ac7b00b77639) Thanks [@tmykkanen](https://github.com/tmykkanen)! - Rewrote and restructured + added custom contact syncing
  - Refactored / reorganized internal file structure.
  - Moved features into domains using barrel exports.
  - Added custom syncing feature with Planning Center Online built in and capacity for user-added sync providers.
  - Previous configs will break and need to be updated, but core functionality remains the same.

## 1.1.1

### Patch Changes

- [`1944eb1`](https://github.com/tmykkanen/astro-resend-router/commit/1944eb1cd61e52d866fc069710aa97df24e47927) Thanks [@tmykkanen](https://github.com/tmykkanen)! - removed dependency picocolors

## 1.1.0

### Minor Changes

- [`7ef8970`](https://github.com/tmykkanen/astro-resend-router/commit/7ef8970cb239eba3fdfd477c451bf7ef45b704c4) Thanks [@tmykkanen](https://github.com/tmykkanen)! - restructured file structure and error handling for more consistency and to enable a GET route with api status

### Patch Changes

- [`33b6607`](https://github.com/tmykkanen/astro-resend-router/commit/33b6607e93302042d73cd673b84af40015955e4f) Thanks [@tmykkanen](https://github.com/tmykkanen)! - Fix: topicName should not be normalized

## 1.0.1

### Patch Changes

- [`0f05dc9`](https://github.com/tmykkanen/astro-resend-router/commit/0f05dc91291f8249995f156acf8b9cdf9a58cb05) Thanks [@tmykkanen](https://github.com/tmykkanen)! - Bug fix for customEmailFooter
  - moved validation to zod schema for better handling
  - fixed error in passing defaults if customEmailFooter is unsent

## 1.0.0

### Major Changes

- [`88f993c`](https://github.com/tmykkanen/astro-resend-router/commit/88f993c2ce7584db86895a0ed08fb63e6d7eee3d) Thanks [@tmykkanen](https://github.com/tmykkanen)! - Breaking Changes - API finalized and ready for major release

  fix: breaking changes to config
  - Changed 'name' to segmentName and segmentIdentifier to enable display friendly name
  - moved files / functions to better separate concerns
  - improved error handling and logging
  - added default email footer with unsubscribe link and support for custom footer

## 0.6.0

### Minor Changes

- [`63016dc`](https://github.com/tmykkanen/astro-resend-router/commit/63016dcccae14c3df770544220ebae22f045de44) Thanks [@tmykkanen](https://github.com/tmykkanen)! - api rewrite to support segment specific settings

## 0.5.0

### Minor Changes

- [`078ffd9`](https://github.com/tmykkanen/astro-resend-router/commit/078ffd93f80adecdf4608b502f8111d539e84768) Thanks [@tmykkanen](https://github.com/tmykkanen)! - updated readme

## 0.3.0

### Minor Changes

- [#2](https://github.com/tmykkanen/astro-resend-router/pull/2) [`be38da9`](https://github.com/tmykkanen/astro-resend-router/commit/be38da9b8f98c0f7ec5bc59ea2527e5afc23b5d0) Thanks [@tmykkanen](https://github.com/tmykkanen)! - improved jsDoc annotation and error logging

### Patch Changes

- [`297f30d`](https://github.com/tmykkanen/astro-resend-router/commit/297f30d7b6a55898e8ef6823afaf8f3f90984b2f) Thanks [@tmykkanen](https://github.com/tmykkanen)! - lint files and fix release.yml workflow

- [`404ea8a`](https://github.com/tmykkanen/astro-resend-router/commit/404ea8ad7a9e00c5cf7e57c007b157ddd2e661eb) Thanks [@tmykkanen](https://github.com/tmykkanen)! - Initial release

## 0.2.0

### Minor Changes

- alpha release
