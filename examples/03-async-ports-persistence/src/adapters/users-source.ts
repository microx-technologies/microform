import type { FetchArgs, QueryResult, QuerySource } from "microform";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
}

const MOCK_USERS: UserRecord[] = [
  { id: "usr_1", name: "Ada Lovelace", email: "ada@analytics.org", role: "Mathematician", company: "Babbage Engines" },
  { id: "usr_2", name: "Alan Turing", email: "alan@enigma.ac.uk", role: "Cryptanalyst", company: "Bletchley Park" },
  { id: "usr_3", name: "Grace Hopper", email: "grace@cobol.navy.mil", role: "Compiler Architect", company: "US Navy" },
  { id: "usr_4", name: "Margaret Hamilton", email: "margaret@apollo.mit.edu", role: "Software Director", company: "MIT Instrumentation" },
  { id: "usr_5", name: "Dennis Ritchie", email: "dmr@bell-labs.com", role: "Systems Engineer", company: "Bell Labs" },
  { id: "usr_6", name: "Ken Thompson", email: "ken@unix.org", role: "Kernel Architect", company: "Bell Labs" },
  { id: "usr_7", name: "Barbara Liskov", email: "liskov@csail.mit.edu", role: "Type Theorist", company: "MIT CSAIL" },
  { id: "usr_8", name: "Linus Torvalds", email: "torvalds@kernel.org", role: "Kernel Maintainer", company: "Linux Foundation" },
  { id: "usr_9", name: "John Carmack", email: "carmack@id.com", role: "Graphics Engine Engineer", company: "id Software" },
  { id: "usr_10", name: "Donald Knuth", email: "knuth@stanford.edu", role: "Algorithm Pioneer", company: "Stanford" },
  { id: "usr_11", name: "Leslie Lamport", email: "lamport@microsoft.com", role: "Distributed Systems", company: "Microsoft Research" },
  { id: "usr_12", name: "Radia Perlman", email: "radia@spanning-tree.org", role: "Network Engineer", company: "DEC" },
];

/**
 * Fuente asíncrona que implementa `QuerySource<UserRecord>`.
 * Simula latencia de red, filtrado en servidor, paginación y cancelación con AbortSignal.
 */
export const userQuerySource: QuerySource<UserRecord> = {
  fetch: async ({ search = "", page = 1, pageSize = 4, signal }: FetchArgs): Promise<QueryResult<UserRecord>> => {
    // Simular retardo de red de 200ms
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (signal?.aborted) {
      throw new DOMException("Fetch cancelado", "AbortError");
    }

    const query = search.toLowerCase().trim();
    const filtered = MOCK_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.company.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query),
    );

    const startIndex = (page - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items,
      total: filtered.length,
    };
  },
};
