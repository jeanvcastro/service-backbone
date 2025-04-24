type ContainerDependencies = Record<string, unknown>;

class MissingDependencyError extends Error {
  constructor(key: string) {
    super(`Missing dependency: ${key}`);
  }
}

export class DIContainer<Dependencies extends ContainerDependencies> {
  private dependencies: Partial<Dependencies> = {};

  add<Key extends keyof Dependencies>(key: Key, resolver: (container: Dependencies) => Dependencies[Key]) {
    this.dependencies[key] = resolver(this.dependencies as Dependencies);
  }

  get<Key extends keyof Dependencies>(key: Key): Dependencies[Key] {
    const dependency = this.dependencies[key];

    if (!dependency) {
      throw new MissingDependencyError(key as string);
    }

    return dependency;
  }
}
