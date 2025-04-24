import { makeMockedUnitOfWork } from "$/core/mockedUnitOfWork";
import { mockedCustomersRepository } from "$/domain/repositories/mockedCustomersRepository";
import { mockedOrdersRepository } from "$/domain/repositories/mockedOrdersRepository";
import { mockedProductsRepository } from "$/domain/repositories/mockedProductsRepository";
import { makeCustomer } from "$/factories/makeCustomer";
import { makeProduct } from "$/factories/makeProduct";
import { Order, OrderConstants } from "@/domain/entities/Order";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { CreateOrderInput } from "./CreateOrderInput";
import { CreateOrderUseCase } from "./CreateOrderUseCase";

describe("CreateOrderUseCase", () => {
  let mockedUnitOfWork: ReturnType<typeof makeMockedUnitOfWork>;

  beforeEach(() => {
    vi.resetAllMocks();
    mockedUnitOfWork = makeMockedUnitOfWork();
  });

  it("should throw if customer is not found", async () => {
    (mockedCustomersRepository.findOne as Mock).mockResolvedValueOnce(null);

    const sut = new CreateOrderUseCase(
      mockedCustomersRepository,
      mockedProductsRepository,
      mockedOrdersRepository,
      mockedUnitOfWork
    );

    const input: CreateOrderInput = {
      customerUuid: "not-found-uuid",
      status: OrderConstants.Status.APPROVED,
      paymentMethod: OrderConstants.PaymentMethod.PIX,
      value: 5000,
      gatewayTransactionId: "any-tx-id",
      qrcode: "any-qrcode",
      expiration: new Date(),
      productUuids: ["any-product-uuid"]
    };

    await expect(() => sut.execute(input)).rejects.toThrow("Customer not found");
  });

  it("should throw if any product is not found", async () => {
    const customer = makeCustomer();

    (mockedCustomersRepository.findOne as Mock).mockResolvedValueOnce(customer);
    (mockedProductsRepository.findMany as Mock).mockResolvedValueOnce([]);

    const sut = new CreateOrderUseCase(
      mockedCustomersRepository,
      mockedProductsRepository,
      mockedOrdersRepository,
      mockedUnitOfWork
    );

    const input: CreateOrderInput = {
      customerUuid: customer.uuid,
      productUuids: ["not-found-id"],
      status: OrderConstants.Status.APPROVED,
      paymentMethod: OrderConstants.PaymentMethod.PIX,
      value: 5000,
      gatewayTransactionId: "any-tx-id",
      qrcode: "any-qrcode",
      expiration: new Date()
    };

    await expect(() => sut.execute(input)).rejects.toThrow("Product not found");
  });

  it("should create a order successfully", async () => {
    const customer = makeCustomer();
    const product = makeProduct();

    (mockedCustomersRepository.findOne as Mock).mockResolvedValueOnce(customer);
    (mockedProductsRepository.findMany as Mock).mockResolvedValueOnce([product]);
    const createSpy = vi.spyOn(mockedOrdersRepository, "create");

    const sut = new CreateOrderUseCase(
      mockedCustomersRepository,
      mockedProductsRepository,
      mockedOrdersRepository,
      mockedUnitOfWork
    );

    const input: CreateOrderInput = {
      customerUuid: customer.uuid,
      productUuids: [product.uuid],
      status: OrderConstants.Status.APPROVED,
      paymentMethod: OrderConstants.PaymentMethod.PIX,
      value: 5000,
      gatewayTransactionId: "any-tx-id",
      qrcode: "any-qrcode",
      expiration: new Date()
    };

    await sut.execute(input);

    expect(createSpy).toHaveBeenCalledOnce();
    expect(createSpy.mock.calls[0][0]).toBeInstanceOf(Order);
    expect(createSpy.mock.calls[0][1]).toEqual([product]);
  });

  it("should increment orders count for each product", async () => {
    const customer = makeCustomer();
    const product = makeProduct();

    (mockedCustomersRepository.findOne as Mock).mockResolvedValueOnce(customer);
    (mockedProductsRepository.findMany as Mock).mockResolvedValueOnce([product]);
    const incrementSpy = vi.spyOn(mockedProductsRepository, "incrementOrdersCount");

    const sut = new CreateOrderUseCase(
      mockedCustomersRepository,
      mockedProductsRepository,
      mockedOrdersRepository,
      mockedUnitOfWork
    );

    const input: CreateOrderInput = {
      customerUuid: customer.uuid,
      productUuids: [product.uuid],
      status: OrderConstants.Status.APPROVED,
      paymentMethod: OrderConstants.PaymentMethod.PIX,
      value: 5000,
      gatewayTransactionId: "any-tx-id",
      qrcode: "any-qrcode",
      expiration: new Date()
    };

    await sut.execute(input);

    expect(incrementSpy).toHaveBeenCalledOnce();
    expect(incrementSpy).toHaveBeenCalledWith(product.uuid, expect.any(Object));
  });
});
