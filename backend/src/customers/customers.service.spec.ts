import { CustomersService } from './customers.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Customer } from './entities/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CustomersService', () => {
  let service: CustomersService;

  const mockCustomers: Customer[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'test@example.com',
      password: 'hashedpassword',
    },
    {
      id: 2,
      name: 'Max Mustermann',
      email: 'test2@example.com',
      password: 'hashedpassword',
    },
  ];

  const mockCustomerRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of customers without password', async () => {
      mockCustomerRepository.find.mockResolvedValue(mockCustomers);
      const customers = await service.findAll();
      expect(customers).toEqual([
        { id: 1, name: 'John Doe', email: 'test@example.com' },
        { id: 2, name: 'Max Mustermann', email: 'test2@example.com' },
      ]);
      expect(customers[0]).not.toHaveProperty('password');
    });
  });

  describe('findOne', () => {
    it('should return a customer without password', async () => {
      mockCustomerRepository.findOneBy.mockResolvedValue(mockCustomers[0]);
      const customer = await service.findOne(1);
      expect(customer).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'test@example.com',
      });
      expect(customer).not.toHaveProperty('password');
    });
  });

  describe('create', () => {
    it('should create and return a customer without password', async () => {
      const createCustomerDto = {
        name: 'Jane Doe',
        email: 'test@example.com',
        password: 'plaintextpassword',
      };
      const savedCustomer = {
        id: 3,
        name: 'Jane Doe',
        email: 'test@example.com',
        password: 'hashedpassword',
      };
      mockCustomerRepository.create.mockReturnValue(savedCustomer);
      mockCustomerRepository.save.mockResolvedValue(savedCustomer);

      const customer = await service.create(createCustomerDto);
      expect(customer).toEqual({
        id: 3,
        name: 'Jane Doe',
        email: 'test@example.com',
      });
      expect(customer).not.toHaveProperty('password');
    });
  });
});
