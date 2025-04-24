import { mockedProductsRepository } from "$/domain/repositories/mockedProductsRepository";
import { makeProduct } from "$/factories/makeProduct";
import { Product } from "@/domain/entities";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { SyncProductsInput } from "./SyncProductsInput";
import { SyncProductsUseCase } from "./SyncProductsUseCase";

describe("SyncProductsUseCase", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create a product if it doesn't exist", async () => {
    const inputProduct = makeProduct();

    (mockedProductsRepository.findOne as Mock).mockResolvedValue(null);
    const createSpy = vi.spyOn(mockedProductsRepository, "create");

    const sut = new SyncProductsUseCase(mockedProductsRepository);

    const input: SyncProductsInput = {
      products: [{ uuid: inputProduct.uuid, name: inputProduct.name, price: inputProduct.price }]
    };

    await sut.execute(input);

    expect(mockedProductsRepository.findOne).toHaveBeenCalledWith(inputProduct.uuid);
    expect(createSpy.mock.calls[0][0]).toBeInstanceOf(Product);
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        uuid: inputProduct.uuid,
        name: inputProduct.name,
        price: inputProduct.price
      })
    );
  });

  it("should not create product if it already exists", async () => {
    const inputProduct = makeProduct();

    (mockedProductsRepository.findOne as Mock).mockResolvedValue(inputProduct);
    const createSpy = vi.spyOn(mockedProductsRepository, "create");

    const sut = new SyncProductsUseCase(mockedProductsRepository);

    const input: SyncProductsInput = {
      products: [{ uuid: inputProduct.uuid, name: inputProduct.name, price: inputProduct.price }]
    };

    await sut.execute(input);

    expect(createSpy).not.toHaveBeenCalled();
  });
});
