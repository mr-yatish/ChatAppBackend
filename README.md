# Socket.IO Server

This project sets up a basic Node.js server using Socket.IO for real-time communication. It also implements CORS to allow cross-origin requests and utilizes environment variables for configuration.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd socketio-server
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Create a `.env` file in the root directory and set the necessary environment variables (see [Environment Variables](#environment-variables) for details).

2. Start the server:
   ```
   npm start
   ```

3. The server will be running on the specified port (default is 3000).

## Environment Variables

- `PORT`: The port on which the server will listen (default is 3000).

## License

This project is licensed under the MIT License.