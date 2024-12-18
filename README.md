# Resource Management API

A RESTful API built with TypeScript, Express, and PostgreSQL for managing Resource. This project includes Docker containerization, automated deployment, and a CI/CD pipeline.

## Features

- RESTful API endpoints for CRUD operations on Resource
- PostgreSQL database with Sequelize
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
   git clone git@github.com:FarhanYaseen/resource-api.git
   cd resource-api
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

All endpoints are prefixed with `/resource`

### Create Resource
- Method: `POST`
- Path: `/resource`
- Body:
  ```json
  {
    "title": "Complete project",
    "description": "Finish the REST API implementation",
    "completed": false
  }
  ```

### Get All Resource
- Method: `GET`
- Path: `/resource`

### Get Single Resource
- Method: `GET`
- Path: `/resource/:id`

### Update Resource
- Method: `PUT`
- Path: `/resource/:id`
- Body:
  ```json
  {
    "title": "Updated title",
    "completed": true
  }
  ```

### Delete Resource
- Method: `DELETE`
- Path: `/resource/:id`

## Docker Setup

The project uses Docker Compose to run multiple services:

- API service (Node.js application)
- PostgreSQL database

### Environment Variables

Key environment variables:

- `PORT`: API port (default: 3001)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name
- `DATABASE_URL`: Full database connection URL
- `SSL_DISABLED`: For running with local db without ssl

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
2. Build
3. Deploy to the Vercel

Required secrets:


- `NODE_ENV`
- `PORT`
- `SSL_DISABLED`
- `DATABASE_URL`

### Setting Up Secrets in GitHub
1. Navigate to Repository Settings:

2. Go to your GitHub repository.
Click on the Settings tab.
3. Add Secrets:

4. On the left-hand menu, select Secrets and variables > Actions.
Click New repository secret.
5. Add a name for the secret (e.g., NODE_ENV, PORT, DATABASE_URL).
Enter the value of the secret.
Click Add secret.

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

1. **Sequelize**: Chosen for its TypeScript support and ORM features
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