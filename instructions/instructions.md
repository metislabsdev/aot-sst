# Product Requirements Document

## Project Overview

Build a data pipeline for financial data from stock market and blockchain sources. The data will be collected, stored, processed, and displayed in a front-end user interface for trading analysts to evaluate and make trading decisions.

## Core Functionalities

1. Data Collection

   1. Pull data from various stock market and blockchain APIs and data sources
   2. Handle API authentication, rate limiting, pagination, and error handling
   3. Schedule data pulls on a regular interval (e.g. every 15 minutes)

2. Data Processing & Storage

   1. Clean, validate, and transform incoming data into a standardized schema
   2. Store raw data and processed data in a database (e.g. DynamoDB)
   3. Update data incrementally and handle data consistency

3. Data Visualization

   1. Display key metrics, trends, and insights in an intuitive web-based UI
   2. Allow filtering, sorting, searching of data
   3. Provide data export options (CSV, JSON, PDF reports)
   4. Follow best practices for information hierarchy, interaction design, accessibility

4. AI/ML Integration
   1. Train models for anomaly detection, price forecasting, sentiment analysis
   2. Expose model predictions and insights in the front-end UI
   3. Allow analysts to interact with and fine-tune models

## Documentation

## Technical Requirements

- Use TypeScript for all new code;
- Use SST frameworkinfrastructure-as-code tools to provision and manage cloud resources
- Write code to be friendly tounit tests, integration tests, end-to-end tests; set up CI pipeline
- Implement monitoring, logging, tracing, and alerting
- Meet performance requirements: <1s page load, <100ms API response
- Follow security best practices: HTTPS everywhere, XSS/CSRF protection, etc

## File Structure

├── infra # Infrastructure-as-code
│ ├── api # API Gateway, Lambda functions, etc
│ ├── cron # Scheduled tasks
│ ├── dynamo-data-points # DynamoDB table for storing data points
│ ├── frontend # React UI
│ ├── queue # SQS queue for handling data ingestion
│ ├── secrets # Secrets manager for storing API keys and other secrets
│ ├── storage # S3 bucket for storing raw data
│ └── worker # Lambda function for processing data
├── packages
│ ├── core # Shared TS packages  
│ ├── frontend # React UI
│ ├── functions # Serverless functions
│ └── scripts # DB migrations, etc
├── docs # Documentation  
├── tests # Unit, integration, E2E tests
└── README.md
