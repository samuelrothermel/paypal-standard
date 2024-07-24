# Server-side Client-Token Generation

To instantiate the Braintree client, a client-token will need to be generated via a server-side call and then passed into the create call.

## Prerequisites

- .NET 6.0 SDK or later
- Visual Studio 2019 or later / Visual Studio Code
- .NET CLI

## Installation

1. Clone the repository or download the source code files.

2. Ensure you have a .env file located in the root folder of the project (server/dot/.env) with the right environment variables.

3. Navigate to that directory.

4. Restore the required packages:

```bash
dotnet restore
```  

## Running the Application

1. Build and run the application:

```bash
dotnet run
```
    
2. The server will start listening on the specified port (default is 8080). You can start the client at:

```
http://localhost:8080/
```

## Notes

- Ensure your .env file is properly configured with all the values.
- Ensure your Braintree credentials are correct and you are using the Sandbox environment for testing.

