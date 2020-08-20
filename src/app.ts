import "apollo-cache-control";
import server from "./server";

async function main() {
  const { url } = await server.listen();
  console.log(`🚀 HN GraphQL server ready at ${url}`);
}

main();
