# Server-side Client-Token Generation

To instantiate the Braintree client, a client-token will need to be generated via a server-side call and then passed into the create call.

## Prerequisites

- Python 3.x
- pip (Python package installer)

## Installation

1. Clone the repository or download the app.py, requirements.txt, and README.md files.

2. Ensure you have a .env file located in the parent directory (../../.env) with the right environment variables.

3. Navigate to the directory containing the app.py file.

4. Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

    

5. Install the required packages:

```bash
pip install -r requirements.txt
```
    

## Running the Application

1. Start the Flask server:

```bash
python app.py
```
    
2. The server will start listening on the specified port (default is 8080). You can start the client at:

```
http://localhost:8080/
```

## Notes

- Ensure your .env file is properly configured with all the values.
- Ensure your Braintree credentials are correct and you are using the Sandbox environment for testing.

