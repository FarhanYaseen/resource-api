# Task Management API

A RESTful API built with TypeScript, Express, and PostgreSQL for managing tasks. This project includes Docker containerization, automated deployment, and a CI/CD pipeline.

## Features

- RESTful API endpoints for CRUD operations on tasks
- PostgreSQL database with TypeORM
- Input validation using Joi
- Docker containerization with Docker Compose
- Environment-based configuration
- Automated deployment script
- CI/CD pipeline using GitHub Actions
- Unit tests with Jest

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- PostgreSQL (if running locally)
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rest-api-oppizi
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the services:
   ```bash
   chmod +x run.sh
   ./run.sh
   ```
   This will start both the API and PostgreSQL database.

## Development

To run the application in development mode:

```bash
npm run dev
```

This will start the application with hot-reload enabled.

## API Endpoints

All endpoints are prefixed with `/tasks`

### Create Task
- Method: `POST`
- Path: `/tasks`
- Body:
  ```json
  {
    "title": "Complete project",
    "description": "Finish the REST API implementation",
    "completed": false
  }
  ```

### Get All Tasks
- Method: `GET`
- Path: `/tasks`

### Get Single Task
- Method: `GET`
- Path: `/tasks/:id`

### Update Task
- Method: `PUT`
- Path: `/tasks/:id`
- Body:
  ```json
  {
    "title": "Updated title",
    "completed": true
  }
  ```

### Delete Task
- Method: `DELETE`
- Path: `/tasks/:id`

## Database Management

### Migrations

Generate a new migration:
```bash
npm run migration:generate -- src/migrations/MigrationName
```

Run migrations:
```bash
npm run migration:run
```

## Docker Setup

The project uses Docker Compose to run multiple services:

- API service (Node.js application)
- PostgreSQL database

### Environment Variables

Key environment variables:

- `PORT`: API port (default: 3000)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name

## Testing

Run the test suite:

```bash
npm test
```

This will:
- Execute all unit tests
- Generate coverage reports
- Validate API endpoints

## Deployment

The application can be deployed using the following methods:

### Manual Deployment

1. Build the Docker images:
   ```bash
   docker-compose build
   ```

2. Push to container registry:
   ```bash
   docker-compose push
   ```

### Automated Deployment (CI/CD)

The GitHub Actions workflow will automatically:
1. Run tests
2. Build Docker images
3. Push to container registry
4. Deploy to the target environment

Required secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DB_PASSWORD`

## Troubleshooting

### Common Issues

1. Database Connection Issues
   ```bash
   # Check database logs
   docker-compose logs db
   
   # Check database connection
   docker-compose exec db psql -U postgres
   ```

2. API Issues
   ```bash
   # Check API logs
   docker-compose logs api
   
   # Restart API service
   docker-compose restart api
   ```

## Development Decisions

1. **TypeORM**: Chosen for its TypeScript support and robust features
2. **PostgreSQL**: Used for reliable, relational data storage
3. **Docker Compose**: Enables easy development and deployment setup
4. **Environment Configuration**: Uses dotenv for flexible configuration

## Future Enhancements

- Authentication and authorization
- Request rate limiting
- API documentation using Swagger/OpenAPI
- Monitoring and logging integration
- Database indexing optimization
- Caching layer implementation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

MIT