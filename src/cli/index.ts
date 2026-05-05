// Entry point — orchestration complète implémentée en Story 3.3
const [major] = process.versions.node.split(".").map(Number);
if (major < 18) {
  console.error("pet-theme-converter requires Node.js >= 18.0.0");
  process.exit(1);
}

export {};
