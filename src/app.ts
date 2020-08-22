import "apollo-cache-control";
import "dotenv/config";
import { httpServer, server } from "./server";

const PORT = process.env.PORT || 4000;
async function main() {
  httpServer.listen(PORT, () => {
    console.log(
      `🚀 HN GraphQL at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 HN GraphQL updates ready at ws://localhost:${PORT}${server.subscriptionsPath}`
    );
  });
}

main();
