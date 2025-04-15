import { describe, expect, it } from "vitest";
import { UUID } from "../valueObjects/UUID";
import { BaseEntity } from "./BaseEntity";

describe("BaseEntity", () => {
  it("should create an instance with default values", () => {
    const entity = new BaseEntity();
    expect(entity.uuid).toBeInstanceOf(UUID);
    expect(entity.createdAt).toBeInstanceOf(Date);
    expect(entity.updatedAt).toBeInstanceOf(Date);
  });

  it("should create an instance with provided values", () => {
    const uuid = new UUID();
    const createdAt = new Date("2020-01-01");
    const updatedAt = new Date("2020-01-02");

    const entity = new BaseEntity({
      uuid: uuid.toString(),
      createdAt,
      updatedAt
    });

    expect(entity.uuid.toString()).toBe(uuid.toString());
    expect(entity.createdAt).toEqual(createdAt);
    expect(entity.updatedAt).toEqual(updatedAt);
  });

  it("should return an EntityNotFoundError from static method", () => {
    const error = BaseEntity.notFoundError();
    expect(error.code).toBe("ENTITY_NOT_FOUND");
    expect(error.isExpected).toBe(true);
    expect(error.message).toBe("Entidade não encontrada");
  });

  it("should return an UnableToCreateEntityError from static method", () => {
    const error = BaseEntity.unableToCreateError();
    expect(error.code).toBe("UNABLE_TO_CREATE_ENTITY");
    expect(error.isExpected).toBe(true);
    expect(error.message).toBe("Entidade não foi criada");
  });

  it("should return an UnableToUpdateEntityError from static method", () => {
    const error = BaseEntity.unableToUpdateError();
    expect(error.code).toBe("UNABLE_TO_UPDATE_ENTITY");
    expect(error.isExpected).toBe(true);
    expect(error.message).toBe("Entidade não foi atualizada");
  });
});
