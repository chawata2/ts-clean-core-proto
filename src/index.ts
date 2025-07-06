import z from "zod";
import { createUserUC } from "./useCases/createUserUC";
import { inMemoryUserRepo } from "./useCases/inMemoryUserRepo";

const createUserSchema = z.object({
  name: z.string(),
  email: z.string(),
});

const server = Bun.serve({
  port: 3000,
  routes: {
    "/api/users": {
      GET: () => Response.json({ users: [] }),
      POST: async (req) => {
        const body = await req.json();
        const parsed = createUserSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            {
              message: "Invalid request body",
              errors: parsed.error,
            },
            { status: 422 },
          );
        }
        return Response.json(await createUserUC(parsed.data, inMemoryUserRepo));
      },
    },
  },
  fetch(req) {
    return new Response(`Not Fountd`, { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);
