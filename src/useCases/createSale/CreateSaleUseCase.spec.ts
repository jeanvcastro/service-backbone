import { mockedProductsRepository } from "$/core/domain/repositories/mockedProductsRepository";
import { mockedSalesRepository } from "$/core/domain/repositories/mockedSalesRepository";
import { makeMockedUnitOfWork } from "$/core/mockedUnitOfWork";
import { makeProduct } from "$/factories/makeProduct";
import { Sale, SaleConstants } from "@/core/domain/entities/Sale";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { CreateSaleInput } from "./CreateSaleInput";
import { CreateSaleUseCase } from "./CreateSaleUseCase";

describe("CreateSaleUseCase", () => {
  let mockedUnitOfWork: ReturnType<typeof makeMockedUnitOfWork>;

  beforeEach(() => {
    vi.resetAllMocks();
    mockedUnitOfWork = makeMockedUnitOfWork();
  });

  it("should throw if any product is not found", async () => {
    (mockedProductsRepository.findMany as Mock).mockResolvedValueOnce([]);

    const sut = new CreateSaleUseCase(mockedProductsRepository, mockedSalesRepository, mockedUnitOfWork);

    const input: CreateSaleInput = {
      status: SaleConstants.Status.APPROVED,
      paymentMethod: SaleConstants.PaymentMethod.PIX,
      value: 5000,
      gatewayTransactionId: "any-tx-id",
      qrcode: "any-qrcode",
      expiration: new Date(),
      products: ["not-found-id"]
    };

    await expect(() => sut.execute(input)).rejects.toThrow("Product not found");
  });

  it("should create a sale successfully", async () => {
    const product = makeProduct();

    (mockedProductsRepository.findMany as Mock).mockResolvedValueOnce([product]);
    const createSpy = vi.spyOn(mockedSalesRepository, "create");

    const sut = new CreateSaleUseCase(mockedProductsRepository, mockedSalesRepository, mockedUnitOfWork);

    const input: CreateSaleInput = {
      status: SaleConstants.Status.APPROVED,
      paymentMethod: SaleConstants.PaymentMethod.PIX,
      value: 5000,
      gatewayTransactionId: "any-tx-id",
      qrcode: "any-qrcode",
      expiration: new Date(),
      products: [product.uuid]
    };

    await sut.execute(input);

    expect(createSpy).toHaveBeenCalledOnce();
    expect(createSpy.mock.calls[0][0]).toBeInstanceOf(Sale);
    expect(createSpy.mock.calls[0][1]).toEqual([product]);
  });

  it("should increment sales count for each product", async () => {
    const product = makeProduct();

    (mockedProductsRepository.findMany as Mock).mockResolvedValueOnce([product]);
    const incrementSpy = vi.spyOn(mockedProductsRepository, "incrementSalesCount");

    const sut = new CreateSaleUseCase(mockedProductsRepository, mockedSalesRepository, mockedUnitOfWork);

    const input: CreateSaleInput = {
      status: SaleConstants.Status.APPROVED,
      paymentMethod: SaleConstants.PaymentMethod.PIX,
      value: 5000,
      gatewayTransactionId: "any-tx-id",
      qrcode: "any-qrcode",
      expiration: new Date(),
      products: [product.uuid]
    };

    await sut.execute(input);

    expect(incrementSpy).toHaveBeenCalledOnce();
    expect(incrementSpy).toHaveBeenCalledWith(product.uuid, expect.any(Object));
  });
});
