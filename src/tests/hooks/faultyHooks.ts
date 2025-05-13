export function useMutatesContext() {
  const { setUser } = useContext(UserContext);
  useEffect(() => {
    setUser({ name: "Mutated" });
  }, []);
}

export function useManyDeps(a, b, c, d, e, f, g) {
  useEffect(() => {
    console.log(a, b, c, d, e, f, g);
  }, [a, b, c, d, e, f, g]);
}

export function useUnsafeFetcher(id: string) {
  useEffect(() => {
    fetch(`/api/user/${id}`)
      .then((res) => res.json())
      .then(console.log);
  }, [id]);
}

export function useMissingCleanup() {
  useEffect(() => {
    const timer = setInterval(() => console.log("ping"), 1000);
  }, []);
}

export function useConsoleLogger() {
  console.log("This is a harmless hook.");
}

const UserContext = { name: "John" };
function useContext(UserContext: any): { setUser: any } {
  console.log("====================================");
  console.log(UserContext);
  console.log("====================================");
  throw new Error("Function not implemented.");
}
function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}
