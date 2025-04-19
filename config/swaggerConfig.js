import swaggerJsdoc from 'swagger-jsdoc';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Registration API',
      version: '1.0.0',
      description: 'A student registration system API for managing student accounts',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password', 'dateOfBirth'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User unique identifier'
            },
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password (hashed)'
            },
            registrationNumber: {
              type: 'string',
              description: 'Unique registration number starting with REG- and ending with -2025'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'User date of birth (must be between 10 and 20 years old)'
            },
            role: {
              type: 'string',
              enum: ['admin', 'student'],
              default: 'student',
              description: 'User role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp'
            }
          }
        },
        UserRegistration: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password', 'dateOfBirth'],
          properties: {
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'User date of birth (must be between 10 and 20 years old)'
            }
          }
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password'
            }
          }
        },
        UserUpdate: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'User date of birth'
            },
            role: {
              type: 'string',
              enum: ['admin', 'student'],
              description: 'User role'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: [
    'C:/Users/user/Desktop/student-registration-system/student-registration-backend/routes/**/*.js', 
    'C:/Users/user/Desktop/student-registration-system/student-registration-backend/controllers/**/*.js',
    'C:/Users/user/Desktop/student-registration-system/student-registration-backend/models/**/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
