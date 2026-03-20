# pear-apps-utils-generate-unique-id

Generate unique IDs for Pear Apps

## Features

- Generates unique IDs.

## Security Notice

1. To ensure the security and integrity of your projects, please note that official PearPass packages are distributed exclusively through our GitHub organization.
2. Any packages with similar names found on the npm registry or other third-party package managers are not affiliated with PearPass and should be strictly avoided. We recommend installing directly from this repository to ensure you are using the verified, open-source version.

## Installation

Install the package using npm:

```bash
npm install git+https://github.com/tetherto/pear-apps-utils-generate-unique-id.git
```

## Testing

To run the tests, use the following command:

```bash
npm test
```

## Usage Examples

```javascript
import { generateUniqueId } from '@tetherto/pear-apps-utils-generate-unique-id';

const uniqueId = generateUniqueId();
console.log(uniqueId);
```

## Related Projects

- [@tetherto/pearpass-app-mobile](https://github.com/tetherto/pearpass-app-mobile) - A mobile app for PearPass, a password manager
- [@tetherto/pearpass-app-browser-extension](https://github.com/tetherto/pearpass-app-browser-extension) - A browser extension for PearPass, a password manager
- [@tetherto/pearpass-app-desktop](https://github.com/tetherto/pearpass-app-desktop) - A desktop app for PearPass, a password manager

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](./LICENSE) file for details.
