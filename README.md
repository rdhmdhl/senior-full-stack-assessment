# Vinyl Record Finder Assessment

## Quick Start
- Frontend is mobile first
- The MOCK_API_FAILURE environment variable is set to true, which will simulate 429 errors (see bonus section in statemachine/README.md)
- run `docker-compose up --build` in the root of the project to start the backend, statemachine and Redis containers.
- run `npm install` and then `npm run dev` in the frontend directory


## Problem Statement

Your goal is to build a vinyl record search service that finds records across multiple stores while ensuring authenticity.
This assessment should showcase your abilities in complex problem-solving and fullstack literacy.

## Core workflow

A user will query for multiple vinyl records at once. For each record in the query, the system should:

1. Query multiple stores sequentially for the record
2. Handle unavailability - if the primary store indicates the record is unavailable, try backup stores 2 and 3.
3. Verify authenticity and metadata of any found records before presenting them to users
4. Return the details of every record such as availability and authenticity

## State Machine and API Overview

The provided Docker stack includes 1 backend service that simulates a state machine and APIs for querying vinyl records. You will need to implement the state machine logic to orchestrate the workflow described above. Read `state-machine/README.md` for details on:

- Setting up and running the state machine
- Expected inputs and outputs
- Requirements to implement

## Frontend Requirements

### Search Interface

A way for users to search for multiple vinyl records at once. For all possible records, check `state-machine/state-machine-input.json`.

### Results

Display records with all of their details including availability, which store has it (if any), and whether it's authentic

### Technical Notes

- Use React for the frontend
- Focus on functionality over styling

## Time Expectation

This assessment should take 4-6 hours total. Focus on demonstrating solid workflow orchestration and error handling rather than complex features.

## Deliverable

- State machine workflow implementation
- React frontend that integrates with the workflow
- Backend server that acts as a middleman - handles requests from the frontend and executes the state machine and handles its responses
- Backend should be in node.js with TypeScript
- Use any data stores or other technologies you feel are appropriate
